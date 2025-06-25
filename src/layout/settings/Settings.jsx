import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import AccountPrivacy from './AccountPrivacy';
import axiosInterceptor from '../../axiosInterceptor/Interceptor';
import SettingsSkeleton from './SettingsSkeleton';
import fetchUserUtil from '../userProfile/fetchUserUtil';
import { toast } from 'react-toastify';
import { CgClose } from 'react-icons/cg';



export default function Settings({ isLightMode }) {
    const navigate = useNavigate();
    const [modalToOpen, setModalToOpen] = useState('none');
    const [modalToEmptyTrack, setModalToEmptyTrack] = useState(false);
    const [email, setEmail] = useState("");
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [forgotPasswordLinkSent, setForgotPasswordLinkSent] = useState(false);
    const { user, setUser, profileData, setProfileData, profileLoading, setProfileLoading, setToken, setLoader } = useContext(UserContext);

    // Fetch user
    const axiosIntance = axiosInterceptor();
    const fetchUser = fetchUserUtil("me");

    useEffect(() => {
        if (profileData?.username && profileData?.email) return;
        setProfileLoading(true);
        fetchUser();
    }, [user, profileData]);

    // Stop body scrolling when modal is open
    useEffect(() => {
        if (modalToOpen !== 'none' || (!profileData?.username && !profileData?.email && !profileLoading) || isEmailSent || forgotPasswordLinkSent) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [modalToOpen, profileData, isEmailSent, forgotPasswordLinkSent])

    // Logout function
    async function logout() {
        try {
            setLoader(true);
            await axiosIntance.post('/api/admin/logout');
            setUser({});
            setProfileData({});
            setToken('');
            navigate('/home', { replace: true });

        } catch (error) {
            toast.error("Failed to logout")
        } finally {
            setLoader(false);
        }
    }

    // Empty track
    async function emptyTrack() {
        try {
            setLoader(true);
            await axiosIntance.delete(`/api/admin/delete-all-music`);
            setProfileData(prev => ({ ...prev, musics: [], currentPage: 0, totalSongs: 0, totalPages: 0 }));
            setModalToEmptyTrack(false)
            toast.success("All tracks are deleted");
        } catch (error) {
            toast.error("Failed to empty tracks")
        } finally {
            setLoader(false);
        }
    }

    // Send email updation token
    async function sendEmailUpdationLink() {
        try {
            setLoader(true);
            await axiosIntance.get('/api/admin/send-email-updation-token');
            setIsEmailSent(true);

        } catch (error) {
            toast.error("Error generating email reset token.");
        } finally {
            setLoader(false);
        }
    }

    // Send password reset token
    async function sendPasswordResetLink() {
        try {
            setLoader(true);
            await axiosIntance.post('/api/admin/send-password-reset-token', { email });
            setForgotPasswordLinkSent(true);

        } catch (error) {
            toast.error("Error generating password reset token.");
        } finally {
            setLoader(false);
        }
    }

    // Theme style
    const settingsBg = isLightMode ? "bg-neutral-100 text-gray-900" : "bg-[#0a0a0a] text-white";
    const settingCard = isLightMode ? "bg-white" : "bg-[#1a1a1a]";
    const settingsBorderColor = isLightMode ? 'border-gray-300' : 'border-[#333]';
    const modalBg = isLightMode ? "bg-white text-gray-900 shadow-zinc-400/70 border border-gray-200 text-black/90" : "bg-[#1a1a1a] text-white shadow-black/80 border border-[#222] text-zinc-200";
    const settingsButtonBg = isLightMode ? "bg-gray-200 hover:saturate-150 shadow-md hover:shadow-sm shadow-gray-300" : "bg-zinc-800 hover:saturate-200 shadow-md hover:shadow-sm shadow-zinc-950 text-white/90";
    const buttonColor = isLightMode ? "bg-black/80 text-white hover:bg-black" : "bg-white/80 text-black hover:bg-white/90";
    const BorderColor = isLightMode ? 'border-gray-300' : 'border-[#333]';


    return (
        <>
            {profileLoading
                ?
                <SettingsSkeleton isLightMode={isLightMode} settingsBg={settingsBg} settingCard={settingCard} settingsBorderColor={settingsBorderColor} />
                :
                <main className={`min-h-screen flex flex-col items-center justify-center py-12 max-sm:px-1 transition-colors duration-300 ${settingsBg} *:w-full *:max-w-xl *:p-8 *:rounded-2xl *:shadow-lg *:space-y-6 *:my-5`}>

                    {/* User */}
                    <article className={`${settingCard} border ${settingsBorderColor}`}>
                        <h1 className='text-2xl font-bold mb-3 tracking-wider'>You</h1>

                        <span className='font-bold'>Username: <span className='text-[0.9rem] tracking-wide ml-1 font-normal'>{profileData?.username ? profileData?.username : (profileLoading ? 'Getting...' : 'user not found')}</span></span>
                        <p className='font-bold'>Email: <span className='text-[0.9rem] tracking-wide ml-1 font-normal'>{profileData?.email ? profileData?.email : (profileLoading ? "Getting..." : "email not found")}</span></p>
                    </article>

                    {/* Musics */}
                    <article className={`${settingCard} border ${settingsBorderColor}`}>
                        <h1 className='text-2xl font-bold mb-3 tracking-wider'>My Track</h1>

                        <p className='pt-2'>Total uploads: {profileData?.totalSongs || 0}</p>
                        <button onClick={() => setModalToEmptyTrack(true)} className={`py-2 px-3 rounded-lg mb-1 cursor-pointer ${settingsButtonBg} border ${settingsBorderColor} transition-shadow duration-75 focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1`} type='button' aria-label='Empty my track'>Empty my track</button>
                    </article>

                    {/* Metadata */}
                    <article className={`${settingCard} border ${settingsBorderColor}`}>
                        <h1 className='text-2xl font-bold mb-3 tracking-wider'>Metadata</h1>

                        <div className='flex flex-col items-start *:py-2 *:px-3 *:rounded-lg *:my-1.5 *:cursor-pointer *:transition-shadow *:duration-75 *:focus-visible:outline-purple-500 *:focus-visible:outline-2 *:focus-visible:-outline-offset-1'>
                            <button className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Change email' onClick={sendEmailUpdationLink}>Change email</button>
                            <button className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Change password' onClick={() => setModalToOpen("changePassword")}>Change password</button>
                            <button className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Forgot password' onClick={() => { setForgotPasswordModal(true); setEmail("") }}>Forgot password</button>
                        </div>
                    </article>

                    {/* Account & privacy */}
                    <article className={`${settingCard} border ${settingsBorderColor}`}>
                        <h1 className='text-2xl font-bold mb-3 tracking-wider'>Account & Privacy</h1>

                        <div className='flex flex-col items-start *:py-2 *:px-3 *:rounded-lg *:my-1.5 *:cursor-pointer *:transition-shadow *:duration-75 *:focus-visible:outline-purple-500 *:focus-visible:outline-2 *:focus-visible:-outline-offset-1'>
                            <button className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Logout' onClick={logout}>Logout</button>
                            <button className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Logout from all devices' onClick={() => setModalToOpen("logoutAll")}>Logout from all devices</button>
                            <button className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Disable account' onClick={() => setModalToOpen("disableAccount")}>Disable account</button>
                            <button className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Delete account' onClick={() => setModalToOpen("deleteAccount")}>Delete account</button>
                        </div>
                    </article>
                </main>}


            <AnimatePresence>
                {/* Handling account actions */}
                {
                    modalToOpen !== 'none' && <AccountPrivacy key={modalToOpen} modalToOpen={modalToOpen} setModalToOpen={setModalToOpen} isLightMode={isLightMode} />
                }

                {/* Handling user data absence */}
                {(!profileData?.username && !profileData?.email && !profileLoading) && <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeIn' }}
                    onClick={e => e.stopPropagation()}
                    className='fixed inset-0 w-dvw h-dvh backdrop-blur-sm px-1 flex justify-center items-center'
                >
                    <section onClick={e => e.stopPropagation()} className={`${settingCard} w-full shadow-lg max-w-xl h-full max-h-[350px] rounded-2xl p-5 max-sm:px-3 border ${settingsBorderColor} flex flex-col justify-center items-center`}>
                        <h1 className='text-2xl text-red-500 font-bold mb-3 tracking-wider'>Invalid access</h1>
                        <p className='text-center text-red-500'>You are not authorized to access this page. Please make sure that you have loged in or your credentials are correct.</p>

                        <div className='flex justify-center gap-8 *:cursor-pointer px-2 w-full mt-5 *:py-2 *:px-3 *:rounded-md'>
                            <button onClick={() => navigate('/signup', { replace: true })} className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Login'>Login</button>
                            <button onClick={() => navigate('/home', { replace: true })} className={`${settingsButtonBg} border ${settingsBorderColor}`} type='button' aria-label='Home'>Home</button>
                        </div>
                    </section>
                </motion.section>}

                {/* Confirmation modal to emptying track */}
                {modalToEmptyTrack && <motion.section
                    initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
                    animate={{ background: 'rgba(0, 0, 0, 0.27)' }}
                    exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
                    transition={{ duration: 0.24, ease: 'easeIn' }}
                    className="w-screen h-screen flex justify-center items-center fixed px-1 inset-0 z-60 backdrop-blur-[1px]"
                    onClick={(e) => { e.stopPropagation(); setModalToEmptyTrack(false) }}
                >
                    <motion.article
                        initial={{ y: 30, opacity: 0.7 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 30, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
                        transition={{ duration: 0.24, ease: 'easeIn' }}
                        className={`px-8 max-sm:px-3 pb-8 pt-6 w-full max-w-xl h-fit min-h-60 relative rounded-3xl ${modalBg} shadow-lg flex flex-col items-center`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h1 className='text-xl tracking-wide font-bold leading-4 mb-4 text-red-500'>Delete All Tracks</h1>
                        <p className='text-center leading-relaxed'>This action will permanently delete all your tracks and cannot be undone. Once deleted, your tracks cannot be recovered.</p>
                        <p>Are you sure you want to proceed?</p>

                        <div className='w-full flex justify-center gap-14 mt-3 items-center *:px-5 *:py-2 *:mt-2 *:tracking-wide *:text-shadow-2xs *:rounded-lg *:cursor-pointer *:bg-black/90 *:hover:bg-black *:text-white *:focus-visible:outline-purple-500 *:focus-visible:outline-2 *:focus-visible:-outline-offset-1'>
                            <button type='button' aria-label='Cancel' onClick={() => setModalToEmptyTrack(false)}>Cancel</button>
                            <button type='button' aria-label='Confirm' onClick={emptyTrack}>Confirm</button>
                        </div>

                    </motion.article>
                </motion.section>}

                {/* Link sent message to user */}
                {
                    isEmailSent && <motion.section
                        initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
                        animate={{ background: 'rgba(0, 0, 0, 0.27)' }}
                        exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
                        transition={{ duration: 0.24, ease: 'easeIn' }}
                        className="w-screen h-screen flex justify-center items-center fixed px-1 inset-0 z-60 backdrop-blur-[1px]"
                        onClick={(e) => { e.stopPropagation(); setIsEmailSent(false) }}
                    >
                        <motion.article
                            initial={{ y: 30, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
                            transition={{ duration: 0.24, ease: 'easeIn' }}
                            className={`px-8 max-sm:px-3 pb-8 pt-6 w-full max-w-xl h-fit min-h-60 relative rounded-3xl ${modalBg} shadow-lg flex flex-col items-center`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button type='button' aria-label='Close' className='absolute top-2.5 right-2.5 text-zinc-900 bg-red-700 text-2xl rounded-full p-0.5 cursor-pointer hover:contrast-125' onClick={() => { setIsEmailSent(false) }}><CgClose /> </button>

                            <h1 className='w-full text-center text-xl tracking-wide font-bold leading-4 mb-4'>Email Update Request</h1>
                            <img src="/success-img.png" className='w-28 aspect-square object-cover mb-2' alt="" />

                            <div className='w-full *:w-full *:text-center *:leading-relaxed'>
                                <p>An email update link has been sent to your email address: <span className='italic'>{profileData?.email}</span>.</p>
                                <p>Please check your inbox (and spam folder, just in case) to proceed.</p>
                                <p className='text-sm mt-2'>Do not share this email with anyone.</p>
                                <p className='text-sm'>The link will remain valid for 15 minutes only.</p>
                            </div>
                        </motion.article>
                    </motion.section>
                }

                {/* Forgot password modal */}
                {
                    forgotPasswordModal && <motion.section
                        initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
                        animate={{ background: 'rgba(0, 0, 0, 0.27)' }}
                        exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
                        transition={{ duration: 0.24, ease: 'easeIn' }}
                        className="w-screen h-screen flex justify-center items-center fixed px-1 inset-0 z-60 backdrop-blur-[1px]"
                        onClick={(e) => { e.stopPropagation(); setForgotPasswordModal(false) }}
                    >
                        <motion.article
                            initial={{ y: 30, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
                            transition={{ duration: 0.24, ease: 'easeIn' }}
                            className={`px-8 max-sm:px-3 pb-8 pt-6 w-full max-w-xl h-fit min-h-60 relative rounded-3xl ${modalBg} shadow-lg flex flex-col items-center`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button type='button' aria-label='Close' className='absolute top-2.5 right-2.5 text-zinc-900 bg-red-700 text-2xl rounded-full p-0.5 cursor-pointer hover:contrast-125' onClick={() => { setForgotPasswordLinkSent(false); setForgotPasswordModal(false); setEmail("") }}><CgClose /> </button>
                            {
                                !forgotPasswordLinkSent
                                    ?
                                    <div className="flex flex-col justify-center items-center w-full">
                                        <p>Enter your email to get the link.</p>
                                        <input className={`py-2 px-2 mb-5 rounded-md my-2 w-full border focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 ${BorderColor}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <button type="button" aria-label="Send password reset token" onClick={sendPasswordResetLink} className={`${buttonColor} py-2 px-3 rounded-lg my-1.5 cursor-pointer transition-shadow duration-75 focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1`}>Send Reset Link</button>
                                    </div>
                                    :
                                    <div className="flex flex-col justify-center items-center w-full">
                                        <h1 className='w-full text-center text-xl tracking-wide font-bold leading-4 mb-4'>Link sent</h1>
                                        <img src="/success-img.png" className='w-28 aspect-square object-cover mb-2' alt="" />

                                        <div className='w-full *:w-full *:text-center *:leading-relaxed'>
                                            <p>An Password reset link has been sent to your email address.</p>
                                            <p>Please check your inbox (and spam folder, just in case) to proceed.</p>
                                            <p className='text-sm mt-2'>Do not share this email with anyone.</p>
                                            <p className='text-sm'>The link will remain valid for 15 minutes only.</p>
                                        </div>
                                    </div>
                            }
                        </motion.article>
                    </motion.section>
                }
            </AnimatePresence>
        </>
    )
}

