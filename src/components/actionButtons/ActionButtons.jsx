import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { MusicContext } from "../../context/MusicContext";
import { GiDuration } from "react-icons/gi";
import { MdAccessTime } from "react-icons/md";
import { AiOutlineSortAscending } from "react-icons/ai";
import { TbSortDescendingLetters, TbArrowBack } from "react-icons/tb";
import { VscSortPrecedence } from "react-icons/vsc";
import { categories } from "../../musicCategories";
import axiosInterceptor from "../../axiosInterceptor/Interceptor";

export default function ActionButtons({ borderColor, activeState, isLightMode }) {
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [showSortList, setShowSortList] = useState(false);
    const [modalSearch, setModalSearch] = useState('');
    const [searchModal, setSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ songs: [], accounts: [] });
    const [activeSearchTab, setActiveSearchTab] = useState('songs');
    const [isSearching, setIsSearching] = useState(false);
    const [searchPage, setSearchPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(true);

    const searchSongTypes = categories.filter((obj) => obj?.name?.toLowerCase()?.includes(modalSearch.toLowerCase()));
    const { filter, setFilter, fetchMusic, filterUser, setFilterUser, songTypes, setSongTypes, setCurrentSong } = useContext(MusicContext);
    const axiosIntance = axiosInterceptor();
    const navigate = useNavigate();

    useEffect(() => { fetchMusic(true) }, []);

    // Function to select song types
    function selectSongTypes(type) {
        if (songTypes.includes(type)) {
            setSongTypes(prev => prev.filter((prevType) => prevType !== type));
        } else {
            setSongTypes(prev => ([...prev, type]))
        }
    }

    // Handle filter user change
    const handleFilterUserChange = (newFilter) => {
        if (newFilter !== filterUser) {
            setFilterUser(newFilter);
        }
    };

    // Handle song type search with reset
    const handleSongTypeSearch = () => {
        fetchMusic();
        setShowTypeModal(false);
    };

    // Handle song type reset
    const handleSongTypeReset = () => {
        setShowTypeModal(false);
        fetchMusic(true);
    };

    // Stop body scrolling when modal is open
    let listTimeout;
    useEffect(() => {
        if (showSortList || showTypeModal || searchModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [showSortList, showTypeModal, searchModal]);

    // Show and hide the list on hover event
    const handleMouseEnter = () => {
        clearTimeout(listTimeout);
        setShowSortList(true);
    };

    const handleMouseLeave = () => {
        listTimeout = setTimeout(() => {
            setShowSortList(false);
        }, 300);
    };

    // Handle search input change
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        setSearchPage(1);
        setHasMoreResults(true);
    };

    // Perform search
    const performSearch = async (query = searchQuery, page = 1, append = false) => {
        if (!query.trim()) return setSearchResults({ songs: [], accounts: [] });
        setIsSearching(true);

        try {
            const res = await axiosIntance.post('/api/admin/search', { query: query.trim(), page, limit: 25 });

            if (append) {
                setSearchResults(prev => ({
                    songs: [...prev.songs, ...res.data?.songs],
                    accounts: [...prev.accounts, ...res.data?.accounts]
                }));
            } else {
                setSearchResults(res?.data);
            }

            setHasMoreResults(res.data?.songs?.length === 25 || res.data?.accounts?.length === 25);
        } catch (error) {
            setSearchResults({ songs: [], accounts: [] });
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search button click
    const handleSearch = () => {
        performSearch();
    };

    // Handle load more results
    const loadMoreResults = () => {
        if (!isSearching && hasMoreResults) {
            const nextPage = searchPage + 1;
            setSearchPage(nextPage);
            performSearch(searchQuery, nextPage, true);
        }
    };

    // Handle search modal open
    const openSearchModal = () => {
        setSearchModal(true);
        setSearchQuery("");
        setSearchResults({ songs: [], accounts: [] });
        setSearchPage(1);
        setActiveSearchTab('songs');
    };

    // Handle search modal close
    const closeSearchModal = () => {
        setSearchModal(false);
        setSearchQuery("");
        setSearchResults({ songs: [], accounts: [] });
        setSearchPage(1);
    };

    // Theme Style
    const itemsList = isLightMode ? 'bg-white border-gray-300 *:hover:bg-zinc-200/70' : 'bg-[#1e1e1e] border-[#444] *:hover:bg-[#2a2a2a]';
    const typeModalColor = isLightMode ? 'bg-white/90 border-gray-300 text-black' : 'bg-[#1e1e1e] border-[#444] text-white';
    const hoverBg = isLightMode ? 'hover:bg-zinc-200/70' : 'hover:bg-[#2a2a2a]';
    const SearchButtonBorder = isLightMode ? 'border-gray-300' : 'border-[#444]';
    const leftBorderColor = isLightMode ? 'border-gray-300' : 'border-[#444]';
    const searchModalBg = isLightMode ? 'bg-neutral-100 text-gray-900' : 'bg-[#0a0a0a] text-white';
    const activeTabStyle = isLightMode ? 'bg-gray-200 text-black' : 'bg-[#2a2a2a] text-white';
    const selectedSongTypeBorderColor = isLightMode ? 'outline outline-gray-700 -outline-offset-1' : 'outline outline-gray-200 -outline-offset-1'

    return (
        <>
            <article className={`w-full py-2.5 my-2 flex justify-between items-center`}>
                {/* Filter by user */}
                <div className={`flex items-center *:cursor-pointer max-sm:*:text-sm *:py-2 *:px-3 max-sm:*:py-1.5 max-sm:*:px-2 *:whitespace-nowrap overflow-hidden border-[1px] rounded-lg ${borderColor} w-56 max-sm:w-28 *:w-full *:focus-visible:outline-purple-500 *:focus-visible:outline-2 *:focus-visible:-outline-offset-2`}>
                    <button className={`rounded-l-lg ${activeState} ${filterUser === 'no' ? 'bg-gray-200 text-black' : undefined}`} aria-label="All musics" onClick={() => handleFilterUserChange('no')} >
                        <span>All</span> <span className="max-sm:hidden">Tracks</span>
                    </button>

                    <button className={`rounded-r-lg border-l-[1px] ${leftBorderColor} ${activeState} ${filterUser === 'yes' ? 'bg-gray-200 text-black' : undefined}`} aria-label="User Tracks" onClick={() => handleFilterUserChange('yes')}>
                        <span>User</span> <span className="max-sm:hidden">Tracks</span>
                    </button>
                </div>

                {/* Song type */}
                <button
                    className={`cursor-pointer whitespace-nowrap py-2 px-3 max-sm:py-1.5 max-sm:px-2 max-sm:text-sm border-[1px] rounded-lg focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 ${borderColor} ${activeState}`}
                    aria-label="Song type"
                    onClick={() => setShowTypeModal(true)}
                >
                    <span className="max-sm:hidden">Song</span> Types {songTypes.length > 0 && `(${songTypes.length})`}
                </button>

                {/* Sort button */}
                <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <button aria-label="Sort" className={`flex gap-1.5 items-center cursor-pointer py-2 px-3 max-sm:text-sm max-sm:py-1.5 max-sm:px-2 border-[1px] rounded-lg focus-visible:outline-purple-500 focus-visible:outline-2  ${borderColor} ${activeState}`}>
                        Sort <FaChevronDown className="text-sm max-sm:text-[10px]" />
                    </button>
                    <AnimatePresence>
                        {showSortList && (
                            <motion.div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                initial={{ y: 20, opacity: 0.3 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className={`absolute top-[120%] right-0 py-5 px-4 max-sm:py-4 max-sm:px-3 z-50 *:text-nowrap *:py-2 max-sm:*:py-1.5 border-[1px] rounded-2xl *:flex *:gap-2.5 *:items-center *:cursor-pointer *:w-full *:px-1.5 *:rounded-xs ${itemsList}`}
                                onClick={e => e.stopPropagation()}
                            >
                                <button aria-label="Unsorted" onClick={() => setFilter('unsorted')} className={`${filter === 'unsorted' ? (isLightMode ? 'bg-zinc-200/70' : 'bg-[#2a2a2a]') : undefined}`} >
                                    <VscSortPrecedence /> Unsorted
                                </button>
                                <button aria-label="Sort in ascending order" onClick={() => setFilter('asending')} className={`${filter === 'asending' ? (isLightMode ? 'bg-zinc-200/70' : 'bg-[#2a2a2a]') : undefined}`} >
                                    <AiOutlineSortAscending /> Ascending order
                                </button>
                                <button aria-label="Sort in descending order" onClick={() => setFilter('descending')} className={`${filter === 'descending' ? (isLightMode ? 'bg-zinc-200/70' : 'bg-[#2a2a2a]') : undefined}`} >
                                    <TbSortDescendingLetters /> Descending order
                                </button>
                                <button aria-label="Sort by time" onClick={() => setFilter('time')} className={`${filter === 'time' ? (isLightMode ? 'bg-zinc-200/70' : 'bg-[#2a2a2a]') : undefined}`} >
                                    <MdAccessTime /> By time
                                </button>
                                <button aria-label="Sort by duration" onClick={() => setFilter('duration')} className={`${filter === 'duration' ? (isLightMode ? 'bg-zinc-200/70' : 'bg-[#2a2a2a]') : undefined}`}>
                                    <GiDuration /> By duration
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search */}
                <button type="button" aria-label="Search" onClick={openSearchModal} className={`flex gap-1.5 items-center max-sm:text-sm cursor-pointer py-2 px-3 max-sm:py-[9px] max-sm:px-2.5 border-[1px] rounded-lg focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 ${borderColor} ${activeState}`}>
                    <span className="max-sm:hidden">Search</span><FaSearch />
                </button>
            </article>

            <AnimatePresence>
                {/* Song type modal */}
                {
                    showTypeModal && <motion.section
                        initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
                        animate={{ background: 'rgba(0, 0, 0, 0.17)' }}
                        exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
                        transition={{ duration: 0.24, ease: 'easeIn' }}
                        className="w-screen h-screen flex justify-center items-center fixed inset-0 z-60"
                        onClick={e => { e.stopPropagation(); setShowTypeModal(false); }}>

                        <motion.article
                            initial={{ y: 40, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                            transition={{ duration: 0.24, ease: 'easeIn' }}
                            className={`px-8 pb-8 pt-6 max-sm:px-4 max-sm:pb-4 flex flex-col relative rounded-3xl overflow-hidden backdrop-blur-md ${typeModalColor} w-full max-w-3xl h-full max-h-4/5`}
                            onClick={(e) => e.stopPropagation()}>

                            <input type="search" name="Search song" value={modalSearch} onChange={(e) => setModalSearch(e.target.value)}
                                placeholder="Search type..." aria-label="Search song type"
                                className={`border-[1px] ${SearchButtonBorder} py-2 px-3 text-sm rounded-lg focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 mb-2`}
                            />

                            <ul className="grid song-type-grid gap-3 *:py-2 *:px-3 *:cursor-pointer h-full overflow-scroll">
                                {
                                    searchSongTypes?.map((obj, i) => (
                                        <li key={`song-type-${i}`} className={`${hoverBg} h-fit rounded-sm ${songTypes.includes(obj?.name) ? selectedSongTypeBorderColor : undefined}`}
                                            onClick={() => selectSongTypes(obj?.name)}
                                            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { selectSongTypes(obj?.name) } }}>
                                            {obj?.name}
                                        </li>
                                    ))
                                }
                            </ul>

                            <div className="w-full flex gap-1 *:py-1 *:cursor-pointer *:w-full">
                                <button type="button" aria-label="Reset" className={`${hoverBg}`}
                                    onClick={handleSongTypeReset}
                                >
                                    Reset
                                </button>
                                <button type="button" aria-label="Continue" className={`${hoverBg}`}
                                    onClick={handleSongTypeSearch}
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.article>
                    </motion.section>
                }

                {/* Search modal */}
                {
                    searchModal && <motion.article
                        initial={{ y: 40, opacity: 0.7 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
                        transition={{ duration: 0.2, ease: 'easeIn' }}
                        className={`px-8 py-8 max-sm:px-4 max-sm:py-4 flex flex-col fixed inset-0 w-screen h-dvh overflow-hidden z-70 ${searchModalBg}`}
                        onClick={(e) => e.stopPropagation()}>

                        {/* Input */}
                        <div className={`flex items-center *:py-2.5 *:px-3 border-[1px] ${borderColor} rounded-lg gap-2`}>
                            <input
                                type="search" aria-label="Search" placeholder="Search songs or accounts..."
                                value={searchQuery} onChange={handleSearchInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="rounded-l-lg focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:outline-offset-1 h-full border-none bg-transparent w-full text-sm"
                            />
                            <button
                                onClick={handleSearch} disabled={isSearching}
                                className={`text-xl border-l-[1px] ${SearchButtonBorder} h-full rounded-r-lg focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 ${activeState} cursor-pointer disabled:opacity-50`}
                            >
                                <BsSearch />
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="w-full max-sm:text-sm py-2.5 flex items-center justify-start *:focus-visible:outline-purple-500 *:focus-visible:outline-2 *:focus-visible:-outline-offset-1">
                            <button type="button" aria-label="Back" onClick={closeSearchModal} className={`flex gap-1.5 items-center py-1.5 px-2 border ${borderColor} rounded-lg cursor-pointer`}>
                                <TbArrowBack /> Back
                            </button>

                            <p className={`h-full border-r ${borderColor} ml-2 mr-3 max-sm:mr-2 w-0`}></p>

                            <button type="button" aria-label="Songs" onClick={() => setActiveSearchTab('songs')} className={`py-1.5 rounded-lg text-md cursor-pointer px-4 ${activeSearchTab === 'songs' ? activeTabStyle : hoverBg}`}>
                                Songs ({searchResults.songs.length})
                            </button>

                            <button type="button" aria-label="Accounts" onClick={() => setActiveSearchTab('accounts')} className={`py-1.5 rounded-lg text-md cursor-pointer px-4 ${activeSearchTab === 'accounts' ? activeTabStyle : hoverBg}`}>
                                Accounts ({searchResults.accounts.length})
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto mt-4">
                            {isSearching && searchResults.songs.length === 0 && searchResults.accounts.length === 0 && (
                                <div className="flex justify-center items-center h-32 text-gray-500">Searching...</div>
                            )}

                            {!isSearching && searchQuery.trim() && searchResults.songs.length === 0 && searchResults.accounts.length === 0 && (
                                <div className="flex justify-center items-center h-32 text-gray-500">No results found</div>
                            )}

                            {/* Songs Tab */}
                            {activeSearchTab === 'songs' && (
                                <div className="space-y-2">
                                    {searchResults?.songs?.map((song) => (
                                        <div key={song?._id} onClick={() => setCurrentSong(song)} className={`p-3 rounded-lg border ${borderColor} ${hoverBg} cursor-pointer`}>
                                            <div className="flex items-center gap-3">
                                                <img src={song?.imagePath || "/template.png"} alt="" className="w-12 h-12 rounded object-cover" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium truncate">{song?.title || ""}</h3>
                                                    <p className="text-sm text-gray-500 truncate">{song?.artist || "Unknown artist"}</p>
                                                    {song?.category && <p className="text-xs text-gray-400">{song?.category || ""}</p>}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {Math.floor(song?.duration / 60)}:{Math.floor(song?.duration % 60).toString().padStart(2, '0')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Accounts Tab */}
                            {activeSearchTab === 'accounts' && (
                                <div className="space-y-2">
                                    {searchResults?.accounts?.map((account) => (
                                        <div key={account?._id} onClick={() => navigate(`/user/${account?._id}`)} className={`p-3 rounded-lg border ${borderColor} ${hoverBg} cursor-pointer`}>
                                            <div className="flex items-center gap-3">
                                                <img src={account?.profileImage || "/user.png"} alt="" className="w-12 h-12 rounded-full object-cover" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium truncate">@{account?.username}</h3>
                                                    {account?.nickname && <p className="text-sm text-gray-500 truncate">{account.nickname}</p>}
                                                    {account?.bio && <p className="text-xs text-gray-400 truncate">{account.bio.length > 140 ? account.bio.slice(0, 140) + "..." : account.bio}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Load More Button */}
                            {hasMoreResults && (searchResults?.songs?.length > 0 || searchResults?.accounts?.length > 0) && (
                                <div className="flex justify-center mt-4">
                                    <button onClick={loadMoreResults} disabled={isSearching} className={`py-2 px-4 rounded-lg border ${borderColor} ${hoverBg} disabled:opacity-50`}>
                                        {isSearching ? 'Loading...' : 'Load More'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.article>
                }
            </AnimatePresence>
        </>
    )
}
