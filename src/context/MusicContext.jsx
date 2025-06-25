import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [songsByUser, setSongsByUser] = useState({});
    const [userSongCounts, setUserSongCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(false);
    const [userLoadingMap, setUserLoadingMap] = useState({});
    const [error, setError] = useState(null);
    // Pagination
    const [hasMore, setHasMore] = useState(false);
    const [hasMoreUsers, setHasMoreUsers] = useState(false);
    const [page, setPage] = useState(1);
    const [userPages, setUserPages] = useState({}); // Track page for each user { user1: 1st page, user2: 3rd page, user3: 7th page, ...}
    // Filtering states
    const [filter, setFilter] = useState('unsorted');
    const [filterUser, setFilterUser] = useState('no');
    const [songTypes, setSongTypes] = useState([]);
    // Song to play
    const [currentSong, setCurrentSong] = useState({});

    // Fetch musics
    const fetchMusic = async (resetData = false) => {
        try {
                if (resetData) {
                setSongs([]);
                setSongTypes([]);
                setSongsByUser({});
                setUserSongCounts({});
                setPage(1);
                setError(null);
                setUserPages({});
            }

            if (filterUser === 'yes') {
                setUserLoading(true);
                // Build query with category
                let url = `${import.meta.env.VITE_SERVER_URL}/api/admin/grouped-musics?page=${page}`;
                if (songTypes.length > 0 && !resetData) {
                    const category = songTypes.join(',');
                    url += `&category=${category}`;
                }

                const res = await axios.get(url);

                if (resetData || page === 1) {
                    setSongsByUser(res.data?.musicsByUser || {});
                    setUserSongCounts(res.data?.userSongCounts || {});
                } else {
                    setSongsByUser(prev => ({ ...prev, ...res.data?.musicsByUser }));
                    setUserSongCounts(prev => ({ ...prev, ...res.data?.userSongCounts }));
                }

                setHasMoreUsers(res.data?.hasMoreUsers || false);
                setHasMore(false); // only used to fetch more musics in regular mode
            }
            else {
                setLoading(true);
                // Fetch all music with optional category filter
                let url = `${import.meta.env.VITE_SERVER_URL}/api/admin/musics?page=${page}`;
                if (songTypes.length > 0 && !resetData) {
                    const category = songTypes.join(',');
                    url += `&category=${category}`;
                }

                const res = await axios.get(url);

                if (resetData || page === 1) {
                    setSongs(res.data?.musics || []);
                } else {
                    setSongs(prev => [...prev, ...res.data?.musics]);
                }

                setHasMore(res.data?.hasMore || false);
                setHasMoreUsers(false); // Only used in grouped mode to fetch more musics
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setUserLoading(false);
            setLoading(false);
        }
    };

    // Fetch more songs for a specific user
    const fetchUserSongs = async (userId) => {
        try {
            const currentPage = userPages[userId] || 1;
            const nextPage = currentPage + 1;
            setUserLoadingMap(prev => ({ ...prev, [userId]: true }));

            let url = `${import.meta.env.VITE_SERVER_URL}/api/admin/user-songs/${userId}?page=${nextPage}`;
            if (songTypes.length > 0) {
                const category = songTypes.join(',');
                url += `&category=${category}`;
            }

            const res = await axios.get(url);

            if (res.data?.songs?.length > 0) {
                setSongsByUser(prev => ({ ...prev, [userId]: [...(prev[userId] || []), ...res.data.songs] }));
                setUserPages(prev => ({ ...prev, [userId]: nextPage }));

                if (res.data.total) setUserSongCounts(prev => ({ ...prev, [userId]: res.data.total }));
                return res.data.hasMore;
            }
            return false;
        } catch (err) {
            return false;
        }finally{
            setUserLoadingMap(prev => ({ ...prev, [userId]: false }));
        }
    };

    // Load more users (next page of users)
    const loadMoreUsers = async () => {
        if (hasMoreUsers && !loading) setPage(prev => prev + 1);
    };

    // Load more songs in normal mode
    const loadMoreSongs = async () => {
        if (hasMore && !loading) setPage(prev => prev + 1);
    };
    
    // Fetch more data when page changes (but not on initial mount or filter change)
    useEffect(() => {
        if (page > 1) fetchMusic(false);
    }, [page]);

    // Fetch data when switches between regular mode and fetch by user mode
    useEffect(() => {
        setPage(1);
        setUserPages({});
        fetchMusic(true);
    }, [filterUser]);

    // Client-side sorting to songs
    const getSortedSongs = () => {
        if (!songs.length) return [];
        let sortedSongs = [...songs];

        switch (filter) {
            case 'asending':
                return sortedSongs.sort((a, b) => a.title?.localeCompare(b.title));
            case 'descending':
                return sortedSongs.sort((a, b) => b.title?.localeCompare(a.title));
            case 'time':
                return sortedSongs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'duration':
                return sortedSongs.sort((a, b) => (b.duration || 0) - (a.duration || 0));
            case 'unsorted':
            default:
                return sortedSongs;
        }
    };

    // Client-side sorting to grouped songs
    const getSortedSongsByUser = () => {
        if (!Object.keys(songsByUser).length) return {};
        const sortedByUser = {};

        Object.keys(songsByUser).forEach(userId => {
            let userSongs = [...songsByUser[userId]];

            switch (filter) {
                case 'asending':
                    userSongs.sort((a, b) => a.title?.localeCompare(b.title));
                    break;
                case 'descending':
                    userSongs.sort((a, b) => b.title?.localeCompare(a.title));
                    break;
                case 'time':
                    userSongs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'duration':
                    userSongs.sort((a, b) => (b.duration || 0) - (a.duration || 0));
                    break;
                case 'unsorted':
                default:
                    break;
            }

            sortedByUser[userId] = userSongs;
        });
        return sortedByUser;
    };

    return (
        <MusicContext.Provider value={{
            // Data
            songs: getSortedSongs(), setSongs, songsByUser: getSortedSongsByUser(), setSongsByUser, userSongCounts,

            // Loading states
            loading, error, userLoading, userLoadingMap,

            // Pagination
            hasMore, hasMoreUsers, loadMoreSongs, loadMoreUsers, fetchUserSongs,

            // Functions
            fetchMusic,

            // Filters
            filter, setFilter, filterUser, setFilterUser, songTypes, setSongTypes,

            // Current song
            currentSong, setCurrentSong
        }}>
            {children}
        </MusicContext.Provider>
    );
};