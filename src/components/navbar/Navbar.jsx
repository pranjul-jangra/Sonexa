import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { IoSunnySharp } from "react-icons/io5";
import { BsMoonStars } from "react-icons/bs";
import { CgLogIn, CgProfile } from "react-icons/cg";
import { FiUpload } from "react-icons/fi";
import { CgLogOut } from "react-icons/cg";
import { UserContext } from "../../context/UserContext";
import axiosInterceptor from "../../axiosInterceptor/Interceptor";



export default function Navbar({ isLightMode, setIsLightMode }) {
    const navigate = useNavigate();
    const { user, setUser, setProfileData, setToken, setLoader } = useContext(UserContext);
    const [showList, setShowList] = useState(false);
    let listTimeout;

    // Show and hide the list on hover event
    const handleMouseEnter = () => {
        clearTimeout(listTimeout);
        setShowList(true);
    };

    const handleMouseLeave = () => {
        listTimeout = setTimeout(() => {
            setShowList(false);
        }, 300);
    };

    // Fetch user
    const axiosIntance = axiosInterceptor();
    useEffect(() => {
        if (user?.username && user?._id) return;
        async function fetchUser() {
            try {
                const res = await axiosIntance.get(`/api/admin/user/${user?._id}`);
                setProfileData(res.data?.user);
            } catch (error) {
                return;
            }
        }
        fetchUser();
    }, []);

    // Logout function
    async function logout() {
        try {
            setLoader(true);
            await axiosIntance.post('/api/admin/logout');
            setUser({});
            setProfileData({});
            setToken('')

        } catch (error) {
            return;
        } finally {
            setLoader(false);
        }
    }

    // Theme based styling
    const navColorPallete = isLightMode ? 'bg-neutral-100 border-b-gray-300' : 'bg-[#141414] border-b-[#333]';
    const navButtonColor = isLightMode ? 'bg-white border-gray-300' : 'bg-[#1e1e1e] border-[#444]';
    const navItemsListContainer = isLightMode ? 'bg-white border-gray-300 *:hover:bg-zinc-200/70' : 'bg-[#1e1e1e] border-[#444] *:hover:bg-[#2a2a2a]';


    return (
        <nav className={`w-full h-14 flex justify-between items-center px-5 max-sm:px-2 border-b-[1px] sticky top-0 left-0 z-50 ${navColorPallete} transition-colors duration-150`}>
            <p className="text-3xl font-bold cursor-default select-none" style={{ fontFamily: 'monospace' }}>Sonexa</p>

            <div className="flex gap-3.5 items-center">
                {/* Theme button */}
                <button className={`p-1 border-[1px] rounded-md cursor-pointer ${navButtonColor} bg-gray-200 text-black focus-visible:outline-2 focus-visible:outline-purple-500`} aria-label="Change theme"
                    onClick={() => { setIsLightMode(prev => (!prev)); localStorage.setItem('sonexa-light-theme', !isLightMode) }}
                >
                    {isLightMode ? <IoSunnySharp className="text-2xl" /> : <BsMoonStars className="text-2xl" />}
                </button>

                {/* Profile */}
                <div className={`py-2 px-3 max-sm:px-2 border-[1px] rounded-md flex gap-2.5 cursor-pointer relative ${navButtonColor}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img className="w-6 aspect-square rounded-full object-cover" src={user?.profileImage || '/user.png'} alt="" />
                    <p className="max-sm:hidden">{user?.username || 'user'}</p>

                    {/* Navigation items list */}
                    <AnimatePresence>
                        {showList && (
                            <motion.div
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                initial={{ y: 20, opacity: 0.3 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                className={`absolute top-[120%] right-0 min-w-44 py-5 px-4 max-sm:py-4 max-sm:px-3 max-sm:min-w-fit *:text-nowrap *:py-2 border-[1px] rounded-2xl *:flex *:gap-2.5 *:items-center *:cursor-pointer *:w-full *:px-1.5 *:rounded-xs ${navItemsListContainer}`}
                                onClick={e => e.stopPropagation()}
                            >
                                <button type="button" aria-label="Profile" onClick={() => navigate('/user/me')}><CgProfile /> Profile</button>
                                {
                                    user?.username && <button type="button" aria-label="Upload music" onClick={() => navigate('/upload')}><FiUpload /> Upload music</button>
                                }
                                {
                                    user?.username
                                        ?
                                        <button type="button" aria-label="Logout" onClick={logout} className="text-orange-700"><CgLogOut /> Logout</button>
                                        :
                                        <button type="button" aria-label="Login" onClick={() => navigate('/signup')} className="text-green-700"><CgLogIn /> Login</button>
                                }
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    )
}
