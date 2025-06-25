import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BsPlay, BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { RiSwitchFill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { UserContext } from "../../context/UserContext";
import axiosInterceptor from "../../axiosInterceptor/Interceptor";
import ProfileSkeleton from "../../components/profileSkeleton/ProfileSkeleton";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { FaSlash } from "react-icons/fa6";
import { MusicContext } from "../../context/MusicContext";
import AudioSkeleton from "../../components/audioSkeleton/AudioSkeleton";



export default function Profile({ isLightMode, setIsLightMode }) {
    let { adminId } = useParams();
    const navigate = useNavigate();

    const { user, profileData, setProfileData, profileLoading, setProfileLoading, setLoader, profileMusicLoader, setProfileMusicLoader } = useContext(UserContext);
    const { setCurrentSong } = useContext(MusicContext);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [showCompleteBio, setShowCompleteBio] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [songDetails, setSongDetails] = useState({ showModal: false, data: null });
    const [songToEdit, setSongToEdit] = useState({ showEditModal: false, song: null });


    const axiosIntance = axiosInterceptor();
    // Move fetchUser function inside component
    async function fetchUser(forceRefresh = false) {
        try {
            const id = adminId === 'me' ? user?._id : adminId;
            let res;

            if (!forceRefresh && profileData?.currentPage !== undefined && profileData?.adminId === adminId) {
                // Only do pagination if we're viewing the same admin
                const nextPage = profileData.currentPage + 1;
                if (profileData.totalPages && nextPage > profileData.totalPages) return;

                setProfileMusicLoader(true);
                const url = `/api/admin/user/${id}?page=${nextPage}`;
                res = await axiosIntance.get(url);
                const newMusics = res.data?.user?.musics || [];
                if (newMusics.length === 0) return;

                // Filter out duplicates
                const existingMusicIds = new Set((profileData.musics || []).map(music => music._id));
                const uniqueNewMusics = newMusics.filter(music => !existingMusicIds.has(music._id));

                setProfileData(prev => ({
                    ...prev,
                    musics: [...(prev.musics || []), ...uniqueNewMusics],
                    currentPage: res.data?.user?.currentPage,
                    totalSongs: res.data?.user?.totalSongs,
                    totalPages: res.data?.user?.totalPages,
                }));

            } else {
                const url = `/api/admin/user/${id}`;
                res = await axiosIntance.get(url);
                setProfileData({
                    ...res.data?.user,
                    adminId: adminId
                });
            }

        } catch (error) {
            return;
        } finally {
            setProfileMusicLoader(false);
        }
    }

    // closes the song menu on window click
    useEffect(() => {
        function closeMenu() { setOpenMenuIndex(null) };
        if (openMenuIndex || openMenuIndex !== null) {
            window.addEventListener("click", closeMenu);
        } else {
            window.removeEventListener("click", closeMenu);
        }
        return () => window.removeEventListener("click", closeMenu);
    }, [openMenuIndex]);

    // Fetch user when adminId changes
    useEffect(() => {
        if (!adminId) return;
        setProfileLoading(true);
        setProfileData({});   // Reset profile data to prevent showing stale data
        fetchUser(true);    // Force refresh when adminId changes
    }, [adminId, user]);

    // Seconds to minutes
    function SecToMinutes(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds = Math.floor(sec % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update song metadata
    async function updateSongMetadata() {
        try {
            setLoader(true);
            await axiosIntance.post(`/api/admin/update-song`, {
                musicId: songToEdit?.song?.musicId,
                title: songToEdit?.song?.title,
                artist: songToEdit?.song?.artist
            });
            setSongToEdit({ showEditModal: false, song: null });
            fetchUser(true);
        } catch (error) {
            toast.error("Failed to update track");
        } finally {
            setLoader(false);
        }
    }

    // Delete song
    async function deleteMusic(musicId) {
        try {
            setLoader(true);
            await axiosIntance.delete(`/api/admin/delete-music/${musicId}`);
            fetchUser(true);
        } catch (error) {
            toast.error("Failed to delete track")
        } finally {
            setLoader(false);
        }
    }

    // get the time since the user joined
    function getMembershipDuration(createdAt) {
        if (!createdAt) return "N/A";

        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffMs = now - createdDate;

        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        const diffMonths = diffDays / 30.44;
        const diffYears = diffMonths / 12;

        if (diffYears >= 1) {
            return `${diffYears.toFixed(1)}y`;
        } else if (diffMonths >= 1) {
            return `${Math.floor(diffMonths)}m`;
        } else {
            return `${Math.floor(diffDays)}d`;
        }
    }



    // Theme styling
    const colorPallets = isLightMode ? 'bg-neutral-100 text-gray-900' : 'bg-[#0a0a0a] text-white';
    const textColor = isLightMode ? 'text-gray-700' : 'text-gray-200';
    const borderColor = isLightMode ? 'border-gray-300' : 'border-[#252525]';
    const ModalsBg = isLightMode ? "bg-white text-black" : "bg-[#181818] text-white";
    const updateButtonColor = isLightMode ? "bg-black/90 text-white hover:bg-black" : "bg-white/80 hover:bg-white text-black";
    const songsInputBorderColor = isLightMode ? 'border-gray-300' : 'border-[#444]';


    return (
        <>
            {
                profileLoading
                    ?
                    <ProfileSkeleton key="Profile-skeleton" isLightMode={isLightMode} borderColor={borderColor} />
                    :
                    <section className={`w-screen h-screen flex ${colorPallets}`}>
                        {/* Sidebar */}
                        <aside className={`w-64 h-screen px-6 py-3 border-r ${borderColor} max-md:hidden flex flex-col justify-between items-start`}>
                            <div className="flex flex-col items-start w-full">
                                <h1 className="text-2xl font-semibold tracking-wide mb-3">Sonexa</h1>
                                <button className={`cursor-pointer ${textColor} w-full py-2 text-start rounded-md hover:opacity-75 pl-2 focus-visible:outline-purple-500 focus-visible:outline-2`} onClick={() => navigate(-1)} aria-label="Home">Home</button>
                                <button className={`cursor-pointer ${textColor} w-full py-2 text-start rounded-md hover:opacity-75 pl-2 focus-visible:outline-purple-500 focus-visible:outline-2`} aria-label="Theme" onClick={() => setIsThemeModalOpen(true)}>Theme</button>
                            </div>
                        </aside>

                        {/* Profile */}
                        <section className="h-full w-full overflow-scroll">
                            <div className={`mb-4 sticky top-0 ${colorPallets} z-10 px-6 py-3 flex items-center justify-between`}>
                                <h1 className="text-2xl font-semibold tracking-wide truncate">{profileData?.username || "Sonexa_user"}</h1>
                                <div className="flex items-center gap-3">
                                    <RiSwitchFill className="md:hidden text-xl cursor-pointer" onClick={() => setIsThemeModalOpen(true)} />
                                    {adminId === 'me' && <button className="cursor-pointer text-xl focus-visible:outline-purple-500 focus-visible:outline-2 p-1 rounded-full" aria-label="Settings" onClick={() => navigate("/user/me/settings")}><FiSettings /></button>}
                                </div>
                            </div>

                            <section className="pb-36 px-6">
                                <article className="flex items-center gap-12 max-sm:gap-7 mb-2">
                                    <img src={profileData?.profileImage || "/user.png"} alt="" loading="eager" className="w-32 aspect-square rounded-full object-contain object-center" />

                                    <div className="flex gap-16 max-sm:gap-8 *:flex *:flex-col *:items-center *:justify-center">
                                        <div>
                                            <p className="font-semibold">{profileData?.totalSongs || 0}</p>
                                            <p className="text-sm">Songs</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{getMembershipDuration(profileData?.createdAt)}</p>
                                            <p className="text-sm">Tenure</p>
                                        </div>
                                    </div>
                                </article>

                                <i className={`${textColor}`}>{profileData?.nickname}</i>
                                <pre className={`whitespace-pre-wrap max-w-96 text-sm leading-6 mb-2 ${textColor}`}
                                >
                                    {profileData?.bio?.length > 250
                                        ?
                                        <p><span>{profileData.bio.slice(0, 250)}... </span><button type="button" aria-label="Show complete bio" onClick={() => setShowCompleteBio(true)} className="italic cursor-pointer">Read more</button></p>
                                        :
                                        profileData?.bio}
                                </pre>
                                {/* Profile edit button */}
                                {
                                    (adminId === 'me' && user?.username) && <button type="button" aria-label="Edit profile"
                                        className={`flex gap-2 items-center mt-3 mb-4 py-1.5 px-3 rounded-lg border ${borderColor} cursor-pointer focus-visible:outline-purple-500 focus-visible:outline-2" aria-label="Edit profile`}
                                        onClick={() => navigate("/user/me/edit")}
                                    >
                                        Edit profile <FaEdit />
                                    </button>
                                }

                                {/* Posts */}
                                <article className={`w-full border-t ${borderColor}`}>
                                    <h3 className="text-lg mt-3 mb-6 w-full">All tracks</h3>

                                    <ul className="profile-posts-grid *:mb-2">
                                        {
                                            (profileData?.musics?.length === 0 || !profileData?.musics) && <li className="col-span-full text-gray-400 flex flex-col justify-center items-center">
                                                <div className="relative text-9xl h-36 w-full flex justify-center">
                                                    <IoMusicalNotesSharp className="absolute" />
                                                    <FaSlash className="absolute" />
                                                </div>
                                                <span className="text-xl">No songs</span>
                                            </li>
                                        }
                                        {
                                            profileData?.musics?.map((obj, i) => (
                                                <li key={`song-${i}`} className="max-w-96" onClick={() => setCurrentSong(obj)}>
                                                    <img src={obj?.imagePath || "/template.png"} className="w-full aspect-square rounded-md" alt="" />

                                                    <p className="flex justify-between items-center mt-2 relative">
                                                        <span className="truncate">{obj?.title}</span>
                                                        {adminId === 'me' && <button type="button" onClick={(e) => { e.stopPropagation(); setOpenMenuIndex(prev => (prev === i ? null : i)) }} aria-label="Open menu" className="cursor-pointer focus-visible:outline-purple-500 focus-visible:outline-2 py-0.5 rounded-sm"><BsThreeDotsVertical /></button>}

                                                        <AnimatePresence>
                                                            {openMenuIndex === i && (
                                                                <motion.ul
                                                                    initial={{ opacity: 0, y: -5 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -5 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className={`absolute top-0 right-0 ${ModalsBg} text-sm shadow-md rounded-md dark:border-[#444] z-50`}
                                                                >
                                                                    <li className="px-4 py-2 hover:bg-black/10 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSongToEdit({ showEditModal: true, song: obj }); setOpenMenuIndex(null) }}>Edit</li>
                                                                    <li className="px-4 py-2 hover:bg-black/10 cursor-pointer" onClick={(e) => { e.stopPropagation(); deleteMusic(obj?.musicId); setOpenMenuIndex(null) }}>Delete</li>
                                                                    <li className="px-4 py-2 hover:bg-black/10 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSongDetails({ showModal: true, data: obj }); setOpenMenuIndex(null) }}>View Details</li>
                                                                </motion.ul>
                                                            )}
                                                        </AnimatePresence>
                                                    </p>

                                                    <p className="text-sm mb-0.5 text-gray-400 truncate">{obj?.artist}</p>
                                                    <div className="flex justify-between items-center *:text-xs *:text-gray-400">
                                                        <p className="truncate flex items-center"><BsPlay className="mb-[1px]" />{obj?.playCount || 0} Plays</p>
                                                        <p>{obj?.duration ? SecToMinutes(obj?.duration) + " min" : "--:--"}</p>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                        {
                                            profileData?.currentPage < profileData?.totalPages && !profileMusicLoader && <li className="col-span-full flex justify-center">
                                                <button onClick={() => { fetchUser() }} className={`cursor-pointer border px-4 py-2 rounded-lg ${borderColor}`}>Load more</button>
                                            </li>
                                        }
                                        {
                                            profileMusicLoader && <AudioSkeleton isLightMode={isLightMode} />
                                        }
                                    </ul>
                                </article>
                            </section>
                        </section>
                    </section>
            }

            <AnimatePresence>
                {
                    (showCompleteBio || songDetails.showModal || isThemeModalOpen || songToEdit.showEditModal) && <motion.section
                        initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
                        animate={{ background: 'rgba(0, 0, 0, 0.17)' }}
                        exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
                        transition={{ duration: 0.24, ease: 'easeIn' }}
                        className="w-screen h-screen flex justify-center items-center fixed inset-0 z-60"
                        onClick={e => { e.stopPropagation(); setShowCompleteBio(false); setSongDetails({ showModal: false, data: null }); setSongToEdit({ showEditModal: false, song: null }); setIsThemeModalOpen(false); }}>

                        {/* Song details */}
                        {songDetails.showModal && <motion.article
                            initial={{ y: 40, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className={`p-8 relative rounded-3xl w-full max-w-xl h-full max-h-[400px] overflow-hidden ${ModalsBg}`}
                            onClick={(e) => e.stopPropagation()}>

                            <button className="absolute top-4 right-4 text-2xl focus-visible:outline-purple-500 focus-visible:outline-2 rounded-sm cursor-pointer" aria-label="Close" onClick={() => setSongDetails({ showModal: false, data: null })}><CgClose /></button>
                            <p className="h-full w-full tracking-wide overflow-auto whitespace-pre-wrap flex flex-col items-start">
                                <img src={songDetails?.data?.imagePath || "/user.png"} className="w-28 aspect-square mb-2 object-cover rounded-lg" alt="" />
                                <span className="font-bold text-shadow-2xs">Title: {songDetails?.data?.title}</span>
                                <span className="text-shadow-2xs">Artist: {songDetails?.data?.artist || "Unknown artist"}</span>
                                <span className="text-shadow-2xs">Type: {songDetails?.data?.category || "Not defined"}</span>
                                <span className="text-shadow-2xs">Duration: {SecToMinutes(songDetails?.data?.duration)} min</span>
                                <span className="text-shadow-2xs">File extension: {(() => {
                                    const splittedArray = songDetails?.data?.filePath.split('.');
                                    const extension = splittedArray[splittedArray?.length - 1];
                                    return extension.toUpperCase();
                                })()}</span>
                                <span className="text-shadow-2xs">MIME type: audio/</span>
                                <span className="text-sm flex items-center mt-1"><BsPlay className="mb-[1px]" />{songDetails?.data?.playCount || 0} Plays</span>
                                {songDetails?.data?.createdAt && <span className="text-sm">Uploaded on: {new Date(songDetails?.data?.createdAt).toLocaleDateString()}</span>}
                            </p>
                        </motion.article>}

                        {/* Complete bio */}
                        {showCompleteBio && <motion.article
                            initial={{ y: 40, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className={`p-8 relative rounded-3xl w-full max-w-xl h-full max-h-[400px] overflow-hidden ${ModalsBg}`}
                            onClick={(e) => e.stopPropagation()}>

                            <button className="absolute top-4 right-4 text-2xl focus-visible:outline-purple-500 focus-visible:outline-2 rounded-sm cursor-pointer" aria-label="Close" onClick={() => setShowCompleteBio(false)}><CgClose /></button>
                            <p className="h-full w-full overflow-auto whitespace-pre-wrap">{profileData?.bio}</p>
                        </motion.article>}

                        {/* Theme modal */}
                        {isThemeModalOpen && <motion.article
                            initial={{ y: 40, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className={`px-8 pb-8 pt-6 relative rounded-3xl ${ModalsBg}`}
                            onClick={(e) => e.stopPropagation()}>

                            <button className="absolute top-4 right-4 text-2xl focus-visible:outline-purple-500 focus-visible:outline-2 rounded-sm cursor-pointer" aria-label="Close" onClick={() => setIsThemeModalOpen(false)}><CgClose /></button>
                            <p className="text-xl w-full text-center mb-5 font-bold">Select Your Preferred Look</p>
                            <div className="flex gap-8 *:w-72 max-md:*:w-48 *:aspect-square *:object-cover *:cursor-pointer *:border-2 *:rounded-md *:focus-visible:outline-purple-500 *:focus-visible:outline-2 *:outline-offset-1">
                                <img tabIndex='0' aria-label="Light mode" onClick={() => { setIsLightMode(true); localStorage.setItem('sonexa-light-theme', !isLightMode); setIsThemeModalOpen(false) }} className={`${isLightMode ? 'border-black' : 'border-transparent'}`} src="/light-skeleton.webp" alt="Light theme" />
                                <img tabIndex='0' aria-label="Dark mode" onClick={() => { setIsLightMode(false); localStorage.setItem('sonexa-light-theme', !isLightMode); setIsThemeModalOpen(false) }} className={`${isLightMode ? 'border-transparent' : 'border-black'}`} src="/dark-skeleton.webp" alt="Dark theme" />
                            </div>
                        </motion.article>}

                        {/* Edit song */}
                        {songToEdit.showEditModal && <motion.article
                            initial={{ y: 40, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className={`px-8 pb-8 pt-6 w-full max-w-xl h-full max-h-[400px] relative rounded-3xl ${ModalsBg}`}
                            onClick={(e) => e.stopPropagation()}>

                            <button className="absolute top-4 right-4 text-2xl focus-visible:outline-purple-500 focus-visible:outline-2 rounded-sm cursor-pointer" aria-label="Close" onClick={() => setSongToEdit({ showEditModal: false, song: null })}><CgClose /></button>
                            <p className="text-xl w-full text-center mb-5 font-bold">Update metadata</p>
                            <form className="flex flex-col items-start">
                                <label className="block mb-2" htmlFor="title">Title</label>
                                <input className={`w-full px-3 py-2 mb-4 border ${songsInputBorderColor} rounded-md focus-visible:outline-[1.4px] focus-visible:outline-purple-700`} type="text" required id="title" value={songToEdit?.song?.title || ""} onChange={e => setSongToEdit(prev => ({ ...prev, song: { ...prev.song, title: e.target.value } }))} />

                                <label className="block mb-2" htmlFor="artist">Artist</label>
                                <input className={`w-full px-3 py-2 mb-4 border ${songsInputBorderColor} rounded-md focus-visible:outline-[1.4px] focus-visible:outline-purple-700`} type="text" id="artist" value={songToEdit?.song?.artist} onChange={e => setSongToEdit(prev => ({ ...prev, song: { ...prev.song, artist: e.target.value } }))} />

                                <button className={`cursor-pointer px-6 py-2 mt-4 rounded-md ${updateButtonColor} ${songsInputBorderColor} rounded-md focus-visible:outline-[1.4px] focus-visible:outline-purple-700`} type="button" aria-label="Update song" onClick={updateSongMetadata}>Update</button>
                            </form>
                        </motion.article>}
                    </motion.section>
                }
            </AnimatePresence>
        </>
    )
}
