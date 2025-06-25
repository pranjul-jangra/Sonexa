import { useContext, useState } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import axiosInterceptor from '../../axiosInterceptor/Interceptor';
import { UserContext } from '../../context/UserContext';
import { CgClose } from 'react-icons/cg';


export default function UpdateEmail({ isLightMode }) {
    const axiosIntance = axiosInterceptor();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { setLoader, setToken, setUser } = useContext(UserContext);

    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [emailConflictError, setEmailConflictError] = useState(false);

    // submit new email
    async function updateEmail() {
        if (!token) return toast.error("Invalid Or Expired token");
        if (!newEmail.trim()) return toast.error("New email is required");

        try {
            setLoader(true);
            const res = await axiosIntance.post('/api/admin/update-email', { token, newEmail });
            setToken(res.data?.accessToken || "");
            setUser(res.data?.user || {});
            navigate("/home", { replace: true });

        } catch (error) {
            console.log("Error updating email:", error);
            if (error?.status === 400) { setError(true); };
            if (error?.status === 409) { setEmailConflictError(true); };
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
            setError(false);

        } catch (error) {
            console.log("Error sending email updation token:", error);
            toast.error("Error generating email reset token.");
        } finally {
            setLoader(false);
        }
    }

    // Theme styling
    const pageBg = isLightMode ? "bg-neutral-100 text-gray-900" : "bg-[#0a0a0a] text-white";
    const CardBg = isLightMode ? "bg-white text-gray-900" : "bg-[#1a1a1a] text-white";
    const BorderColor = isLightMode ? 'border-gray-300' : 'border-[#333]';
    const buttonColor = isLightMode ? "bg-gray-200 hover:saturate-150 shadow-md hover:shadow-sm shadow-gray-300" : "bg-black/80 text-white/90";


    return (
        <>
            <main className={`${pageBg} w-screen min-h-dvh flex justify-center items-center px-1`}>

                <form className={`${CardBg} border ${BorderColor} w-full max-w-xl min-h-80 rounded-xl flex flex-col items-center p-4 max-sm:px-3`}>
                    <label htmlFor="newEmail" className='text-2xl mb-3 tracking-wide'>Update Email</label>
                    <p className='text-center mb-2'>Use a professional email address to maintain better control over your account and enhance its security.</p>
                    <input type="email" required id='newEmail' placeholder='New email' className={`py-2 px-2 mb-5 rounded-md my-2 w-full border focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 ${BorderColor}`} value={newEmail} onChange={e => { setNewEmail(e.target.value) }} />

                    <button type='button' aria-label='Update' onClick={updateEmail} className={`${buttonColor} py-2 px-3 rounded-lg my-1.5 cursor-pointer transition-shadow duration-75 focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1`}>Update</button>

                    {emailConflictError && <p className='text-red-600 text-center'>This email is already in use. Please choose a different one.</p>}

                    {error && (
                        <div className="bg-red-900/30 border border-red-600 p-4 rounded-lg mt-4 text-red-400 space-y-3">
                            <p className="font-semibold text-red-300">The link is invalid or has expired.</p>
                            <p className="text-sm">For your security, the email update link is only valid for 15 minutes. You can request a new one below.</p>
                            <button type='button' aria-label='Resend link' className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer" onClick={sendEmailUpdationLink}>Resend Link</button>
                        </div>
                    )}
                </form>
            </main>


            <AnimatePresence>
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
                            className={`px-8 max-sm:px-3 pb-8 pt-6 w-full max-w-xl h-fit min-h-60 relative rounded-3xl ${CardBg} shadow-lg flex flex-col items-center`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button type='button' aria-label='Close' className='absolute top-2.5 right-2.5 text-zinc-900 bg-red-700 text-2xl rounded-full p-0.5 cursor-pointer hover:contrast-125' onClick={() => setIsEmailSent(false)}><CgClose /> </button>

                            <h1 className='w-full text-center text-xl tracking-wide font-bold leading-4 mb-4'>New Link Generation</h1>

                            <img src="/success-img.png" className='w-28 aspect-square object-cover mb-2' alt="" />

                            <div className='w-full *:w-full *:text-center *:leading-relaxed'>
                                <p>An new email update link has been sent to your email address.</p>
                                <p>Please check your inbox (and spam folder, just in case) to proceed.</p>
                                <p className='text-sm mt-2'>Do not share this email with anyone.</p>
                                <p className='text-sm'>The link will remain valid for 15 minutes only.</p>
                            </div>
                        </motion.article>
                    </motion.section>
                }
            </AnimatePresence>
        </>
    )
}
