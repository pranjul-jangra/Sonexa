import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FirstSVG from "../../components/sigupPageSVGs/FirstSVG";
import SecondSVG from "../../components/sigupPageSVGs/SecondSVG";
import axios from 'axios';
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import axiosInterceptor from "../../axiosInterceptor/Interceptor";
import { CgClose } from "react-icons/cg";

export default function Signup({ isLightMode }) {
    const { setUser, setToken, setLoader } = useContext(UserContext);
    const navigate = useNavigate();

    const [form, setForm] = useState('Login');
    const [data, setData] = useState({ username: '', email: '', password: '' });
    const [isValid, setIsValid] = useState({ username: false, email: false, password: false });  // tracks only fields emptiness
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const [forgotPasswordLinkSent, setForgotPasswordLinkSent] = useState(false);

    // Stop body scrolling when modal is open
    useEffect(() => {
        if (forgotPasswordLinkSent) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [forgotPasswordLinkSent])

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    // Functions to track valid input data type
    const getEmailError = () => {
        if (!data.email.trim()) return null;
        if (!emailRegex.test(data.email)) return "Enter a valid email address.";
        return null;
    };

    const getPasswordError = () => {
        if (!data.password.trim()) return null;
        if (!passwordRegex.test(data.password)) return "Password must be 8+ chars, 1 uppercase, 1 symbol.";
        return null;
    };

    const getUsernameError = () => {
        if (!data.username.trim()) return null;
        return null;
    };

    // Check if form is valid
    const isFormValid = () => {
        const emailValid = data.email.trim() && !getEmailError();
        const passwordValid = data.password.trim() && !getPasswordError();
        const usernameValid = form === 'Login' || (data.username.trim() && !getUsernameError());

        return emailValid && passwordValid && usernameValid;
    };

    const validateForm = () => {
        if (form === 'Signup' && !data.username.trim()) {
            toast.error("Username is required.");
            return false;
        }
        if (!data.email.trim()) {
            toast.error("Email is required.");
            return false;
        }
        if (getEmailError()) {
            toast.error(getEmailError());
            return false;
        }
        if (!data.password.trim()) {
            toast.error("Password is required.");
            return false;
        }
        if (getPasswordError()) {
            toast.error(getPasswordError());
            return false;
        }
        return true;
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/admin/${form === 'Login' ? 'login' : 'register'}`, data, { withCredentials: true });
            setUser(res.data?.user || null);
            setToken(res.data?.accessToken || null);
            navigate('/home', { replace: true });

        } catch (error) {
            toast.error(error?.response?.data?.error || "An error occurred");
        }
    };

    // Switch between login/signup form
    const formSwitcher = (e) => {
        e.preventDefault();
        setForm(form === 'Login' ? 'Signup' : 'Login');
        setIsValid({ username: false, email: false, password: false });
        setData({ username: '', email: '', password: '' });
    };

    // Forgot password
    const axiosIntance = axiosInterceptor();
    const sendResetToken = async () => {
        if(!data.email.trim()) return toast.error("Email is required");
        try {
            setLoader(true);
            await axiosIntance.post('/api/admin/send-password-reset-token', { email: data.email });
            setForgotPasswordLinkSent(true);

        } catch (error) {
            toast.error("Error generating password reset token.");
        } finally {
            setLoader(false);
        }
    };

    // Theme based styling
    const bgMain = isLightMode ? "bg-neutral-100 text-gray-900" : "bg-[#0a0a0a] text-white";
    const color = isLightMode ? 'text-black' : 'text-white';
    const inputBg = isLightMode ? "bg-neutral-100 border-gray-300 border-[1px]" : "bg-[#2a2a2a] border-[#333]";
    const BorderColor = isLightMode ? 'border-gray-300' : 'border-[#333]';
    const modalBg = isLightMode ? "bg-white text-gray-900 shadow-zinc-400/70 border border-gray-200 text-black/90" : "bg-[#1a1a1a] text-white shadow-black/80 border border-[#222] text-zinc-200";
    const buttonColor = isLightMode ? "bg-black/80 text-white hover:bg-black" : "bg-white/80 text-black hover:bg-white/90";

    return (
        <>
            <main className={`w-full h-full overflow-y-auto font-bold flex justify-center items-center ${bgMain}`}>
                <section className="w-11/12 h-[97dvh] flex gap-18 overflow-hidden">

                    {/* Side */}
                    <article className={`w-full max-lg:w-2/5 max-md:hidden h-full flex flex-col justify-center items-center ${color}`}>
                        <FirstSVG isLightMode={isLightMode} />
                        <p className={`text-3xl font-bold mb-3`}>Stream music your way</p>
                        <p>Your music. Your vibe. Your control. Explore audio with no boundaries.</p>
                        <SecondSVG isLightMode={isLightMode} />
                    </article>

                    {/* Form */}
                    <form className="w-full h-full flex flex-col justify-center items-start lg:pr-10 max-md:pl-6 max-md:pr-6" onSubmit={handleSubmit}>
                        <h1 className={`font-bold text-3xl text-gray-900 mb-5 ${color}`}>{form === 'Login' ? 'Log In' : 'Sign Up'}</h1>

                        {/* Username */}
                        {form === 'Signup' && (
                            <>
                                <label className="block text-sm mb-1 font-normal" htmlFor="username">Username</label>
                                <input
                                    id="username" name="username" type="text" required
                                    value={data.username}
                                    onChange={(e) => { setData(prev => ({ ...prev, username: e.target.value })); setIsValid(prev => ({ ...prev, username: true })) }}
                                    className={`w-full mb-1 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`}
                                />
                                {isValid.username && data.username.trim() && getUsernameError() && <p className="text-sm text-red-600 mb-3">{getUsernameError()}</p>}
                            </>
                        )}

                        {/* Email */}
                        <label className="block text-sm mb-1 mt-2 font-normal" htmlFor="email">Email</label>
                        <input
                            id="email" name="email" type="email" required
                            value={data.email}
                            onChange={(e) => { setData(prev => ({ ...prev, email: e.target.value })); setIsValid(prev => ({ ...prev, email: true })) }}
                            className={`w-full mb-1 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`}
                        />
                        {isValid.email && data.email.trim() && getEmailError() && <p className="text-sm font-light text-red-600 mb-3">{getEmailError()}</p>}

                        {/* Password */}
                        <label className="block text-sm mb-1 mt-2 font-normal" htmlFor="password">Password</label>
                        <input
                            id="password" name="password" type="password" required
                            value={data.password}
                            onChange={(e) => { setData(prev => ({ ...prev, password: e.target.value })); setIsValid(prev => ({ ...prev, password: true })) }}
                            className={`w-full mb-3 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`}
                        />
                        {isValid.password && data.password.trim() && getPasswordError() && <p className="text-sm font-light text-red-600 mb-3">{getPasswordError()}</p>}

                        {/* Forgot Password */}
                        {form === 'Login' && <button type="button" onClick={() => {setForgotPasswordModal(true); setData({ username: '', email: '', password: '' })}} className="text-sm text-red-600 cursor-pointer underline mb-4 self-end focus-visible:outline-2 focus-visible:outline-red-700 py-0.5 px-1.5 rounded-md">
                            Forgot password?
                        </button>}

                        <button disabled={!isFormValid()} type="submit" className="w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded bg-purple-600 hover:bg-purple-700 transition font-semibold text-white cursor-pointer" aria-label={form}>
                            {form === 'Login' ? 'Log In' : 'Sign Up'}
                        </button>

                        <hr className="h-[0.1px] text-gray-600 w-full mt-9" />
                        <p id="mode" className="text-center w-full mt-2">{form === 'Login' ? "Don't have an account?" : "Login with existing account"}</p>

                        <button className="self-center mt-2 font-light text-blue-700 underline cursor-pointer pt-0.5 pb-0.5 pl-2 pr-2 rounded-md focus-visible:outline-2 focus-visible:outline-blue-500" onClick={formSwitcher} aria-labelledby="mode">
                            {form === 'Login' ? 'Sign up' : 'Log in'}
                        </button>
                    </form>
                </section>
            </main>



            <AnimatePresence>
                {/* Link sent message to user */}
                {
                    forgotPasswordModal && <motion.section
                        initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
                        animate={{ background: 'rgba(0, 0, 0, 0.27)' }}
                        exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
                        transition={{ duration: 0.24, ease: 'easeIn' }}
                        className="w-screen h-screen flex justify-center items-center fixed inset-0 z-60 backdrop-blur-[1px]"
                        onClick={(e) => { e.stopPropagation(); setForgotPasswordModal(false); setData({ username: '', email: '', password: '' }) }}
                    >
                        <motion.article
                            initial={{ y: 30, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
                            transition={{ duration: 0.24, ease: 'easeIn' }}
                            className={`px-8 pb-8 pt-6 w-full max-w-xl h-fit min-h-60 relative rounded-3xl ${modalBg} shadow-lg flex flex-col items-center`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button type='button' aria-label='Close' className='absolute top-2.5 right-2.5 text-zinc-900 bg-red-700 text-2xl rounded-full p-0.5 cursor-pointer hover:contrast-125' onClick={() => { setForgotPasswordLinkSent(false); setForgotPasswordModal(false); setData({ username: '', email: '', password: '' }) }}><CgClose /> </button>
                            {
                                !forgotPasswordLinkSent
                                    ?
                                    <div className="flex flex-col justify-center items-center w-full">
                                        <p>Enter your email to get the link.</p>
                                        <input className={`py-2 px-2 mb-5 rounded-md my-2 w-full border focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 ${BorderColor}`} type="email" value={data.email} onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} />
                                        <button type="button" aria-label="Send password reset token" onClick={sendResetToken} className={`${buttonColor} py-2 px-3 rounded-lg my-1.5 cursor-pointer transition-shadow duration-75 focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1`}>Send Reset Link</button>
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
    );
}