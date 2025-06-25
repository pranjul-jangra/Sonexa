import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import axiosInterceptor from "../../axiosInterceptor/Interceptor"
import { motion, AnimatePresence } from "framer-motion";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdAddAPhoto, MdDevices } from "react-icons/md";
import { TbCapture } from "react-icons/tb";
import { toast } from 'react-toastify';
import fetchUserUtil from "../../layout/userProfile/fetchUserUtil";


export default function UpdateProfile({ isLightMode }) {
    const { user, setUser, profileData, setProfileData, setLoader } = useContext(UserContext);
    const imageInputRef = useRef();

    const [formData, setFormData] = useState({ profileImage: '', username: '', nickname: '', bio: '' });
    const [imageOptionModal, setImageOptionModal] = useState(false);

    // set user data if exists else fetch data
    const axiosIntance = axiosInterceptor();
    const fetchUser = fetchUserUtil("me");

    useEffect(() => {
        if (user && user.username) {
            setFormData({
                profileImage: user?.profileImage || '',
                username: user?.username || '',
                nickname: user?.nickname || '',
                bio: user?.bio || '',
            });
            return;
        }
        fetchUser();
    }, [user, profileData])

    // Body lock
    useEffect(() => {
        if (imageOptionModal) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'
    }, [imageOptionModal]);

    // Remove image
    async function removeImage() {
        try {
            setLoader(true);
            await axiosIntance.post('/api/admin/upload-profile-image', { deleteProfileImage: true });
            const fallbackImage = '/user.png';

            setUser(prev => ({ ...prev, profileImage: fallbackImage }));
            setProfileData(prev => ({ ...prev, profileImage: fallbackImage }));
            setFormData(prev => ({ ...prev, profileImage: fallbackImage }));
        } catch (error) {
            toast.error("Failed to remove image");
        }finally{
            setLoader(false);
        }
    }
    
    // Update profile image
    async function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData(prev => ({ ...prev, profileImage: file }));

        try {
            if (!file || !file.type.startsWith("image/")) return;
            setLoader(true);

            const bodyData = new FormData();
            bodyData.append('image', file);
            const res = await axiosIntance.post('/api/admin/upload-profile-image', bodyData);
            const newImage = res.data?.imageUrl;

            setUser(prev => ({ ...prev, profileImage: newImage }));
            setProfileData(prev => ({ ...prev, profileImage: newImage }));
            toast.success('Profile image updated');
        } catch (error) {
            toast.error('Failed to update profile image');
        } finally {
            setLoader(false);
        }
    }

    // Upsert user info
    async function updateInfo(e) {
        e.preventDefault();
        try {
            setLoader(true);
            await axiosIntance.post('/api/admin/update-profile', { username: formData.username, nickname: formData.nickname, bio: formData.bio });
            setUser(prev => ({
                ...prev,
                username: formData.username,
                nickname: formData.nickname,
                bio: formData.bio
            }));

            setProfileData(prev => ({
                ...prev,
                username: formData.username,
                nickname: formData.nickname,
                bio: formData.bio
            }));

            toast.success("Profile updated");
        } catch (error) {
            if(error?.status === 409) return toast.error("Username already in use");
            toast.error("Failed to update profile");
        }finally{
            setLoader(false);
        }
    }

    // These style
    const updateProfileMainBg = isLightMode ? "bg-neutral-100 text-gray-900" : "bg-[#0a0a0a] text-white";
    const updateProfileBg = isLightMode ? "bg-white border border-gray-300" : "bg-[#1a1a1a] border border-[#333]";
    const updateButtonColor = isLightMode ? "bg-black/90 text-white hover:bg-black" : "bg-white/80 hover:bg-white text-black";
    const updateProfileBorderColor = isLightMode ? 'border-gray-300' : 'border-[#444]';


    return (
        <div className={`w-screen h-auto py-12 ${updateProfileMainBg}`}>
            <form onSubmit={updateInfo} className={`w-full max-w-xl mx-auto p-6 rounded-xl border ${updateProfileBorderColor} ${updateProfileBg}`}>
                <h2 className="text-2xl font-semibold mb-4 text-center">Edit Profile</h2>

                <div className="flex flex-col items-center mb-4">
                    <div className="cursor-pointer relative" onClick={() => setImageOptionModal(true)}>
                        <img src={formData?.profileImage || "/user.png"} alt="" className="w-32 h-32 object-cover rounded-full" />
                        <MdAddAPhoto className="absolute bottom-1.5 right-4 text-2xl" />
                    </div>
                    <input type="file" ref={imageInputRef} onChange={handleImageChange} id="profileImage" className="hidden" accept="image/*" />
                </div>

                <label className="block mb-2">Username</label>
                <input type="text" name="username" value={formData.username} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`w-full px-3 py-2 mb-4 border ${updateProfileBorderColor} rounded-md focus-visible:outline-[1.4px] focus-visible:outline-purple-700`} />

                <label className="block mb-2">Nickname</label>
                <input type="text" name="nickname" value={formData.nickname} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`w-full px-3 py-2 mb-4 border ${updateProfileBorderColor} rounded-md focus-visible:outline-[1.4px] focus-visible:outline-purple-700`} />

                <label className="block mb-2">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} rows="3" className={`w-full px-3 py-2 mb-4 border ${updateProfileBorderColor} rounded-md focus-visible:outline-[1.4px] focus-visible:outline-purple-700`} />

                <button type="submit" aria-label="Update profile" className={`${updateButtonColor} ${updateProfileBorderColor} cursor-pointer px-6 py-2 mt-6 rounded-md focus-visible:outline-[1.4px] focus-visible:outline-purple-700`}>Update</button>
            </form>

            {/* Image input - capture or choose fromm device */}
            <AnimatePresence>
                {
                    imageOptionModal && <motion.section
                        initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
                        animate={{ background: 'rgba(0, 0, 0, 0.17)' }}
                        exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
                        transition={{ duration: 0.3, ease: 'easeIn' }}
                        className="w-screen h-screen flex justify-center items-end fixed inset-0 z-60"
                        onClick={e => { e.stopPropagation(); setImageOptionModal(false); }}
                    >
                        <motion.article
                            initial={{ y: 40, opacity: 0.7 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 40, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className={`px-6 py-3 rounded-t-2xl ${updateProfileMainBg} flex flex-col gap-4 items-start *:cursor-pointer *:w-full *:py-1 *:px-2 *:focus-visible:outline-[1.4px] *:focus-visible:outline-purple-700 *:rounded-md`}
                            onClick={(e) => e.stopPropagation()}>

                            <button
                                onClick={() => { removeImage(); setImageOptionModal(false); }}
                                type="button" aria-label="Remove profile image" className="flex items-center gap-3 text-red-800 mt-2"
                            >
                                <RiDeleteBin6Line /> Remove profile image
                            </button>

                            <button
                                onClick={() => { if (imageInputRef.current) { imageInputRef.current.setAttribute("capture", "user"); imageInputRef.current.click(); setImageOptionModal(false); } }}
                                type="button" aria-label="Capture photo" className="flex items-center gap-3"
                            >
                                <TbCapture /> Take photo
                            </button>

                            <button
                                onClick={() => { if (imageInputRef.current) { imageInputRef.current.removeAttribute("capture"); imageInputRef.current.click(); setImageOptionModal(false); } }}
                                type="button" aria-label="Choose image from device" className="flex items-center gap-3"
                            >
                                <MdDevices /> Choose from device
                            </button>
                        </motion.article>
                    </motion.section>
                }
            </AnimatePresence>
        </div>
    );
}
