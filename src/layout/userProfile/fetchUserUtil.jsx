import { useContext, useRef } from 'react'
import { UserContext } from '../../context/UserContext';
import axiosInterceptor from '../../axiosInterceptor/Interceptor';

export default function fetchUserUtil(adminId) {
    if(!adminId) return null;

    const { user, profileData, setProfileData, setProfileMusicLoader } = useContext(UserContext);
    const isLoadingRef = useRef(false);  // prevent multiple calls to backend

    const axiosIntance = axiosInterceptor();
    
    async function fetchUser(forceRefresh = false) {
        if (isLoadingRef.current) return;

        try {
            isLoadingRef.current = true;
            const id = adminId === 'me' ? user?._id : adminId;            
            let res;
            
            if (!forceRefresh && profileData?.currentPage !== undefined) {
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
                
                setProfileData(prev => {
                    const updated = {
                        ...prev,
                        musics: [...(prev.musics || []), ...uniqueNewMusics],
                        currentPage: res.data?.user?.currentPage,
                        totalSongs: res.data?.user?.totalSongs,
                        totalPages: res.data?.user?.totalPages,
                    };
                    return updated;
                });
                
            } else {
                const url = `/api/admin/user/${id}`;
                res = await axiosIntance.get(url);
                setProfileData(res.data?.user);
            }

        } catch (error) {
            return;
        } finally {
            setProfileMusicLoader(false);
            isLoadingRef.current = false;
        }
    }

    return fetchUser;
}

