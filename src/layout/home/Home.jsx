import { useContext } from "react";
import { MusicContext } from "../../context/MusicContext";
import { IoAdd, IoMusicalNotesSharp } from "react-icons/io5";
import { FaSlash } from "react-icons/fa6";
import Navbar from "../../components/navbar/Navbar";
import ActionButtons from "../../components/actionButtons/ActionButtons";
import AudioCard from "../../components/audio/AudioCard";
import AudioSkeleton from "../../components/audioSkeleton/AudioSkeleton";

export default function Home({ isLightMode, setIsLightMode }) {
    const {
        songs, songsByUser, userSongCounts, loading, error, hasMore, loadMoreSongs,
        hasMoreUsers, fetchUserSongs, loadMoreUsers, filterUser, userLoading, userLoadingMap
    } = useContext(MusicContext);

    // theme styling
    const colorPallets = isLightMode ? 'bg-neutral-100 text-gray-900' : 'bg-[#0a0a0a] text-white';
    const borderColor = isLightMode ? 'border-gray-200 bg-white' : 'border-[#444] bg-[#1a1a1a]';
    const activeState = isLightMode ? 'active:bg-gray-200' : 'active:bg-zinc-800';
    const headingSkeleton = isLightMode ? "light-skeleton" : "dark-skeleton"

    return (
        <main className={`w-dvw min-h-dvh transition-colors duration-150 pb-16 ${colorPallets}`}>
            <Navbar isLightMode={isLightMode} setIsLightMode={setIsLightMode} />

            <section className="px-9 max-md:px-6 max-sm:px-2">
                <ActionButtons activeState={activeState} borderColor={borderColor} isLightMode={isLightMode} />

                <h2 className="text-2xl font-bold mb-6">Songs</h2>
                {/* Display fallback for no songs */}
                {
                    (!userLoading && filterUser === 'yes' && Object.keys(songsByUser).length === 0) && (
                        <div className="w-full h-[300px] text-gray-400 flex flex-col justify-center items-center">
                            <div className="relative text-9xl h-36 w-full flex justify-center">
                                <IoMusicalNotesSharp className="absolute" />
                                <FaSlash className="absolute" />
                            </div>
                            <span className="text-xl">No Music found</span>
                        </div>
                    )
                }
                {/* Render track by user separation */}
                {
                    filterUser === 'yes' && Object.entries(songsByUser).map(([key, songs]) => (
                        <ul key={`user-${key}`} className="pb-10 list-none min-h-72 audio-grid">
                            <li className="col-span-full text-lg pl-3 font-semibold flex items-center gap-3"><img src={songs?.[0]?.adminId?.profileImage || "/user.png"} className="w-10 aspect-square rounded-full object-cover" alt="" /> {songs?.[0]?.adminId?.username || "Unknown user"}</li>
                            {/* Render songs */}
                            {
                                songs.map((song, i) => (
                                    <li><AudioCard showUser={false} key={`${key}-${i}`} song={song} isLightMode={isLightMode} /></li>
                                ))
                            }
                            {/* Skeleton loader */}
                            {
                                userLoadingMap?.[key] && <AudioSkeleton isLightMode={isLightMode} />
                            }
                            {/* Get more button */}
                            {
                                (songs.length < (userSongCounts[key] || 0) && !userLoadingMap?.[key]) && (
                                    <li className="w-full h-full">
                                        <button type="button" aria-label={`Fetch more songs for this ${songs?.[0]?.adminId?.username || "Unknown user"}`}
                                            onClick={() => { fetchUserSongs(key); }}
                                            className={`py-2 px-4 border ${borderColor} rounded-lg ${activeState} w-full h-full flex flex-col justify-center items-center cursor-pointer hover:saturate-50 hover:opacity-90`}
                                        >
                                            <IoAdd className="text-4xl mb-2" /> Load more for this user
                                        </button>
                                    </li>
                                )
                            }
                        </ul>
                    ))
                }
                {/* Skeleton */}
                {
                    userLoading && Array.from({ length: 2 }).map((_, i) => (
                        <ul key={`loading-user-${i}`} className="pb-24 list-none min-h-72 audio-grid">
                            <li className="col-span-full">
                                <div className={`w-56 h-12 p-2 ${colorPallets} border ${borderColor} rounded-xl`}>
                                    <p className={`${headingSkeleton} w-full h-full rounded-xl`}></p>
                                </div>
                            </li>
                            <AudioSkeleton isLightMode={isLightMode} />
                        </ul>
                    ))
                }
                {/* Button to fetch more users */}
                {
                    hasMoreUsers && !userLoading && <ul className="pb-24 list-none min-h-72 space-y-8">
                        <li className="col-span-full flex justify-center">
                            <button
                                onClick={loadMoreUsers}
                                className={`cursor-pointer py-3 px-5 mt-3 border-[1px] ${borderColor} rounded-xl ${activeState}`}>
                                Load more users
                            </button>
                        </li>
                    </ul>
                }


                {/* Rendering songs in regular manner (without splitting by users) */}
                {
                    filterUser !== 'yes' && <ul className="pb-24 list-none min-h-72 audio-grid">
                        {/* Rendering songs */}
                        {
                            songs?.map((song, i) => (
                                <AudioCard key={`song-${i}`} song={song} isLightMode={isLightMode} />
                            ))
                        }
                        {/* Skeleton loader */}
                        {
                            loading && <AudioSkeleton isLightMode={isLightMode} />
                        }
                        {/* Fallback for no songs */}
                        {
                            (!loading && (error || songs?.length === 0)) && <li className="col-span-full text-gray-400 flex flex-col justify-center items-center">
                                <div className="relative text-9xl h-36 w-full flex justify-center">
                                    <IoMusicalNotesSharp className="absolute" />
                                    <FaSlash className="absolute" />
                                </div>
                                <span className="text-xl">No Music found</span>
                            </li>
                        }
                        {/* Get more button */}
                        {
                            !loading && hasMore && <li className="col-span-full flex justify-center">
                                <button
                                    onClick={() => loadMoreSongs()}
                                    className={`cursor-pointer py-3 px-5 mt-3 border-[1px] ${borderColor} rounded-xl ${activeState}`}>
                                    Get more
                                </button>
                            </li>
                        }
                    </ul>
                }
            </section>
        </main>
    );
}
