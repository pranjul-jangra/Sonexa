import { memo, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { CgClose } from 'react-icons/cg';
import { toast } from 'react-toastify';
import axiosInterceptor from '../../axiosInterceptor/Interceptor';
import { UserContext } from '../../context/UserContext';
import { MusicContext } from '../../context/MusicContext';


// delete account

const AccountPrivacy = memo(({ modalToOpen, setModalToOpen, isLightMode }) => {
  const navigate = useNavigate();
  const axiosInstance = axiosInterceptor();
  const { setUser, setProfileData, setToken, setLoader } = useContext(UserContext);
  const { fetchMusic, setSongs, setSongsByUser } = useContext(MusicContext);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [invalidPasswordError, setInvalidPasswordError] = useState(false);
  const [error, setError] = useState(false);

  // Handle new password inputs
  const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  function handleNewPasswordChange(e) {
    const value = e.target.value;
    setNewPassword(value);

    if (value === '') setInvalidPasswordError(false);
    else setInvalidPasswordError(!passwordRegex.test(value));
  }

  // State cleanup function
  const resetUserState = () => {
    setUser({});
    setProfileData({});
    setToken('');
    setSongs([]);
    setSongsByUser({});
  };

  // Logout from all devices
  async function handleSubmit() {
    if (!password.trim()) return toast.error("Password is required")
    setError(false);
    try {
      setLoader(true);
      if (modalToOpen === 'logoutAll') {
        // Logout handler
        await axiosInstance.post('/api/admin/logout-all', { password });
        setUser({});
        setProfileData({});
        setToken('');
        navigate('/home', { replace: true });

      } else if (modalToOpen === "changePassword") {
        // Change password handler
        if (!newPassword.trim()) {toast.error("New password is required"); return setLoader(false)}
        await axiosInstance.post('/api/admin/update-password', { password, newPassword });
        toast.success("Password updated");

      } else if (modalToOpen === 'disableAccount') {
        // Disable account handler
        await axiosInstance.post('/api/admin/disable-account', { password });
        resetUserState();
        setTimeout(() => { fetchMusic() }, 100);
        navigate('/home', { replace: true });

      } else if (modalToOpen === 'deleteAccount') {
        // Delete account handler
        await axiosInstance.post('/api/admin/delete-account', { password });
        resetUserState();
        setTimeout(() => { fetchMusic() }, 100);
        navigate('/home', { replace: true });
      }

      setModalToOpen("none");
    } catch (error) {
      if (error?.response?.status === 400) return setError(true);
      toast.error("Something went wrong")
    } finally{
      setLoader(false);
    }
  }

  // Theme styles
  const accountCardBg = isLightMode ? "bg-white text-gray-900 shadow-zinc-400/70 border border-gray-200" : "bg-[#1a1a1a] text-white shadow-black/80 border border-[#222]";
  const SearchBorder = isLightMode ? 'border-gray-300' : 'border-[#444]';
  const alertColor = isLightMode ? "text-red-700" : "text-red-400";

  return (
    <motion.section
      initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
      animate={{ background: 'rgba(0, 0, 0, 0.17)' }}
      exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
      transition={{ duration: 0.24, ease: 'easeIn' }}
      className="w-screen h-screen flex justify-center items-center fixed px-1 inset-0 z-60 backdrop-blur-[1px]"
      onClick={(e) => { e.stopPropagation(); setModalToOpen('none') }}
    >

      <motion.article
        initial={{ y: 40, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className={`px-8 max-sm:px-3 pb-8 pt-6 w-full max-w-xl h-fit min-h-60 relative rounded-3xl ${accountCardBg} shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type='button' aria-label='Close' className='absolute top-2.5 right-2.5 text-zinc-900 bg-red-700 text-2xl rounded-full p-0.5 cursor-pointer hover:contrast-125' onClick={() => setModalToOpen('none')}><CgClose /> </button>

        {/* Headings */}
        <div className='*:w-full *:text-center *:text-xl *:tracking-wide *:font-bold *:leading-4'>
          {modalToOpen === 'logoutAll' && <h1>Logout All</h1>}
          {modalToOpen === "changePassword" && <h1>Change Password</h1>}
          {modalToOpen === 'disableAccount' && <h1 className='text-red-500'>Disable Account</h1>}
          {modalToOpen === 'deleteAccount' && <h1 className='text-red-500'>Delete Account</h1>}
        </div>

        <form className='w-full flex flex-col items-center mt-3'>
          {modalToOpen === 'disableAccount' && <p className='leading-relaxed mt-1 text-center w-full'>Your account will be activated when you login again.</p>}
          {modalToOpen === 'deleteAccount' && <p className={`text-center leading-relaxed mt-1`}>Note: This action can't be undone in the future. All your tracks will be deleted along with your account</p>}
         
          {/* Inputs */}
          <label htmlFor='password' className='mb-2 text-center'>Enter your password to continue.</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className={`py-2 px-2 rounded-md my-2 w-full border focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 ${SearchBorder}`} type={showPassword ? "text" : "password"} id='password' required />
          {modalToOpen === "changePassword" && <input value={newPassword} onChange={handleNewPasswordChange} placeholder='New Password' className={`py-2 px-2 rounded-md my-2 w-full border focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1 ${SearchBorder}`} type={showPassword ? "text" : "password"} aria-label='New password' required />}

          {/* Invalid password validation error */}
          {invalidPasswordError && <p className={`text-sm ${alertColor} leading-4 pl-1 w-full mb-0.5`}>Password must be 8+ chars, 1 uppercase, 1 symbol.</p>}

          {/* Invalid password | show password */}
          <div className='flex justify-end items-center w-full px-1'>
            {error && <span className={`text-sm ${alertColor} mr-auto`}>Invalid password</span>}

            <div className='flex gap-1.5 items-center *:cursor-pointer self-end'>
              <input onChange={(e) => setShowPassword(e.target.checked)} className='w-4 aspect-square accent-black focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1' type="checkbox" aria-label='Show password' id="showPassword" />
              <label htmlFor="showPassword" className='text-sm text-shadow-2xs'>Show password</label>
            </div>
          </div>

          {/* Submit button */}
          <button type='button' aria-label='Confirm' onClick={handleSubmit} className={`px-5 py-2 mt-2 tracking-wide text-shadow-2xs rounded-lg cursor-pointer bg-black/90 hover:bg-black text-white focus-visible:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-1`}>Confirm</button>
        </form>

      </motion.article>
    </motion.section>
  )
})

export default AccountPrivacy;
