import { useContext, useState } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axiosInterceptor from '../../axiosInterceptor/Interceptor';
import { UserContext } from '../../context/UserContext';


export default function ResetPassword({ isLightMode }) {
    const axiosIntance = axiosInterceptor();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { setLoader } = useContext(UserContext);

    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [invalidPasswordError, setInvalidPasswordError] = useState(false);
    const [passwordConflictError, setPasswordConflictError] = useState(false);

    // Handle new password inputs
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    function handleNewPasswordChange(e) {
        const value = e.target.value;
        setNewPassword(value);

        if (value === '') setInvalidPasswordError(false);
        else setInvalidPasswordError(!passwordRegex.test(value));
    }

    // submit new email
    async function resetPassword() {
        if (!token) return toast.error("Invalid Or Expired token");
        if (!newPassword.trim()) return toast.error("New password is required");

        try {
            setLoader(true);
            await axiosIntance.post('/api/admin/reset-password', { token, newPassword });
            navigate("/signup", { replace: true });

        } catch (error) {
            console.log("Error updating email:", error);
            if (error?.status === 400) { setError(true); };
            if (error?.status === 409) { setPasswordConflictError(true); };
        } finally {
            setLoader(false);
        }
    }

    // Theme styling
    const pageBg = isLightMode ? "bg-neutral-100 text-gray-900" : "bg-[#0a0a0a] text-white";
    const CardBg = isLightMode ? "bg-white text-gray-900" : "bg-[#1a1a1a] text-white";
    const BorderColor = isLightMode ? 'border-gray-300' : 'border-[#333]';
    const alertColor = isLightMode ? "text-red-700" : "text-red-400";
    const buttonColor = isLightMode ? "bg-gray-200 hover:saturate-150 shadow-md hover:shadow-sm shadow-gray-300" : "bg-black/80 text-white/90"


    return (
        <main className={`${pageBg} px-1 w-screen min-h-dvh flex justify-center items-center`}>

            <form className={`${CardBg} border ${BorderColor} w-full max-w-xl min-h-80 rounded-xl flex flex-col items-center p-4 max-sm:px-3`}>
                <label htmlFor="resetPassword" className='text-2xl mb-3 tracking-wide'>Reset Password</label>
                <p className='text-center mb-2'>We recomment to use a strong password that can't be easily guesed.</p>
                <input type={showPassword ? "text" : "password"} required id='resetPassword' placeholder='New password' className={`py-2 px-2 mb-5 rounded-md my-2 w-full border focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 ${BorderColor}`} value={newPassword} onChange={handleNewPasswordChange} />

                {/* Invalid password validation error */}
                {invalidPasswordError && <p className={`text-sm ${alertColor} leading-4 pl-1 w-full mb-0.5`}>Password must be 8+ chars, 1 uppercase, 1 symbol.</p>}

                {/* Invalid password | show password */}
                <div className='flex justify-end items-center w-full px-1'>
                    <div className='flex gap-1.5 items-center *:cursor-pointer self-end'>
                        <input onChange={(e) => setShowPassword(e.target.checked)} className='w-4 aspect-square accent-black focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1' type="checkbox" aria-label='Show password' id="showPassword" />
                        <label htmlFor="showPassword" className='text-sm text-shadow-2xs'>Show password</label>
                    </div>
                </div>

                <button type='button' aria-label='Update' onClick={resetPassword} className={`${buttonColor} py-2 px-3 rounded-lg my-1.5 cursor-pointer transition-shadow duration-75 focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1`}>Update</button>

                {passwordConflictError && <p className='text-red-600 text-center'>You can't use your current password. Please choose a different one.</p>}

                {error && (
                    <div className="bg-red-900/30 border border-red-600 p-4 rounded-lg mt-4 text-red-400 space-y-3">
                        <p className="font-semibold text-red-300">The link is invalid or has expired.</p>
                    </div>
                )}
            </form>
        </main>
    )
}
