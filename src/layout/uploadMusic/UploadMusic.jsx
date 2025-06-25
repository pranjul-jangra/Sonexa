// import { useState } from "react";
// import { toast } from 'react-toastify'
// import axiosInterceptor from "../../axiosInterceptor/Interceptor.jsx";
// import Select from "../../components/categorySelect/Select.jsx";


// export default function UploadMusic({ isLightMode }) {
//     const [musicData, setMusicData] = useState({ title: "", artist: "", category: "", image: null, music: null, duration: null });
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploading, setUploading] = useState(false);
//     const [uploadedMusic, setUploadedMusic] = useState([]);  // Preview the uploaded music

//     const axiosInstance = axiosInterceptor();

//     // Getting music duration
//     const getAudioDuration = (file) => {
//         return new Promise((resolve, reject) => {
//             const audio = document.createElement("audio");
//             audio.preload = "metadata";

//             audio.onloadedmetadata = () => {
//                 URL.revokeObjectURL(audio.src);
//                 resolve(audio.duration);
//             };

//             audio.onerror = () => reject("Failed to load audio metadata");
//             audio.src = URL.createObjectURL(file);
//         });
//     };

//     // handle change event
//     const handleChange = async (e) => {
//         const { name, value, files } = e.target;
//         const file = files ? files[0] : null;

//         if (name === "music" && file) {
//             try {
//                 const duration = await getAudioDuration(file);
//                 setMusicData((prev) => ({
//                     ...prev,
//                     [name]: file,
//                     duration: duration.toFixed(2),
//                 }));
//             } catch (err) {
//                 toast.error("Unable to read audio duration");
//             }
//         } else {
//             setMusicData((prev) => ({
//                 ...prev,
//                 [name]: file || value,
//             }));
//         }
//     };

//     // Submit 
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!musicData.title || !musicData.music) return toast.error("Title and music are required");

//         try {
//             setUploading(true);
//             const formData = new FormData();
//             Object.entries(musicData).forEach(([key, value]) => {
//                 formData.append(key, value);
//             });

//             const res = await axiosInstance.post('/api/admin/upload-music', formData, {
//                 onUploadProgress: (e) => {
//                     const percent = Math.round((e.loaded * 100) / e.total);
//                     setUploadProgress(percent);
//                 },
//             });

//             if (!res.data?.newMusic) return toast.error("Failed to upload music.");
//             setMusicData({ title: "", artist: "", category: "", image: null, music: null, duration: null });
//             setUploadedMusic(prev => ([...prev, res.data?.newMusic]));
//             toast.success("Music uploaded successfully");

//         } catch (error) {
//             toast.error(error.response?.data?.error || 'Something went wrong')
//         } finally {
//             setUploading(false);
//         }
//     };

//     // Theme based styling
//     const bgMain = isLightMode ? "bg-neutral-100 text-gray-900" : "bg-[#0a0a0a] text-white";
//     const bgCard = isLightMode ? "bg-white border border-gray-300" : "bg-[#1a1a1a] border border-[#333]";
//     const inputBg = isLightMode ? "bg-neutral-100 border-gray-300 border-[1px]" : "bg-[#2a2a2a] border-[#333]";
//     const buttonColor = isLightMode ? "bg-black/90 text-white hover:bg-black" : "bg-white/80 hover:bg-white text-black";
//     const fileColor = isLightMode ? "file:bg-black/90 file:text-white hover:file:bg-black" : "file:bg-white/80 hover:file:bg-white file:text-black";


//     return (
//         <main className={`min-h-screen flex flex-col items-center justify-center py-12 transition-colors duration-300 ${bgMain}`}>
//             <div className={`w-full max-w-xl p-8 max-sm:p-6 rounded-2xl shadow-lg space-y-6 ${bgCard}`}>
//                 <h2 className="text-3xl font-bold text-center">Upload Music</h2>
//                 <form className="space-y-4">

//                     <label htmlFor="title" className="block text-sm mb-1">Title *</label>
//                     <input disabled={uploading} id="title" type="text" name="title" value={musicData.title} onChange={handleChange} className={`disabled:cursor-not-allowed w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`} required />

//                     <label htmlFor="artist" className="block text-sm mb-1">Artist</label>
//                     <input disabled={uploading} id="artist" type="text" name="artist" value={musicData.artist} onChange={handleChange} className={`disabled:cursor-not-allowed w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`} />

//                     <label htmlFor="image" className="block text-sm mb-1">Image</label>
//                     <input disabled={uploading} id="image" type="file" name="image" accept="image/*" onChange={handleChange} className={`disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${fileColor}`} />

//                     <label htmlFor="audio" className="block text-sm mb-1">Audio *</label>
//                     <input disabled={uploading} id="audio" type="file" name="music" accept="audio/*" onChange={handleChange} className={`disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${fileColor}`} required />

//                     <label className="block text-sm mb-1">Category</label>
//                     <Select value={musicData.category} handleChange={handleChange} isLightMode={isLightMode} />

//                     {/* Progress bar */}
//                     {uploading && (
//                         <div className="w-full bg-gray-300 rounded h-3 overflow-hidden">
//                             <div
//                                 className="bg-green-600 h-full transition-all duration-200 ease-out"
//                                 style={{ width: `${uploadProgress}%` }}
//                             ></div>
//                         </div>
//                     )}

//                     {/* Submit button */}
//                     <button type="submit" className={`disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 w-full py-2 rounded ${buttonColor} transition font-semibold cursor-pointer`}
//                         onClick={handleSubmit} aria-label="Upload"
//                         disabled={uploading}>
//                         {uploading ? 'Uploading...' : `Upload`}
//                     </button>
//                 </form>
//             </div>


//             {/* Preview */}
//             <div className={`w-full max-w-xl p-8 max-sm:px-3 mt-6 rounded-2xl shadow-lg space-y-6 ${bgCard}`}>
//                 {
//                     (!uploadedMusic || uploadedMusic?.length === 0) && <p>No music uploaded at this time.</p>
//                 }
//                 {
//                     uploadedMusic?.map((obj, i) => (
//                         <div className="flex gap-3 items-center">
//                             <img src={obj?.imagePath || "/template.png"} className="w-12 rounded-md aspect-square object-cover" alt="" />
//                             <div className="tracking-wide">
//                                 <p className="font-semibold">{obj?.title?.length > 40 ? obj?.title?.slice(0, 40) + "..." : obj?.title}</p>
//                                 <p className="text-sm">{obj?.artist}</p>
//                             </div>
//                         </div>
//                     ))
//                 }
//             </div>
//         </main>
//     );
// }




import { useState } from "react";
import { toast } from 'react-toastify'
import axiosInterceptor from "../../axiosInterceptor/Interceptor.jsx";
import Select from "../../components/categorySelect/Select.jsx";

export default function UploadMusic({ isLightMode }) {
    const [musicData, setMusicData] = useState({ title: "", artist: "", category: "", image: null, music: null, duration: null });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedMusic, setUploadedMusic] = useState([]);
    const [progressStatus, setProgressStatus] = useState("");

    const axiosInstance = axiosInterceptor();

    // Getting music duration with progress feedback
    const getAudioDuration = (file) => {
        return new Promise((resolve, reject) => {
            setProgressStatus("Processing audio file...");
            setUploadProgress(10);
            
            const audio = document.createElement("audio");
            audio.preload = "metadata";

            audio.onloadedmetadata = () => {
                setUploadProgress(20);
                URL.revokeObjectURL(audio.src);
                resolve(audio.duration);
            };

            audio.onerror = () => {
                setProgressStatus("");
                setUploadProgress(0);
                reject("Failed to load audio metadata");
            };
            
            audio.src = URL.createObjectURL(file);
        });
    };

    // Handle change event with better progress tracking
    const handleChange = async (e) => {
        const { name, value, files } = e.target;
        const file = files ? files[0] : null;

        if (name === "music" && file) {
            try {
                setUploading(true);
                setProgressStatus("Analyzing audio file...");
                setUploadProgress(5);
                
                const duration = await getAudioDuration(file);
                
                setMusicData((prev) => ({
                    ...prev,
                    [name]: file,
                    duration: duration.toFixed(2),
                }));
                
                setProgressStatus("Audio file ready");
                setUploadProgress(25);
                
                // Reset progress after a short delay
                setTimeout(() => {
                    setUploading(false);
                    setUploadProgress(0);
                    setProgressStatus("");
                }, 1000);
                
            } catch (err) {
                setUploading(false);
                setUploadProgress(0);
                setProgressStatus("");
                toast.error("Unable to read audio duration");
            }
        } else if (name === "image" && file) {
            // Add progress feedback for image processing
            setUploading(true);
            setProgressStatus("Processing image...");
            setUploadProgress(10);
            
            setMusicData((prev) => ({
                ...prev,
                [name]: file,
            }));
            
            setProgressStatus("Image ready");
            setUploadProgress(15);
            
            // Reset progress after a short delay
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                setProgressStatus("");
            }, 500);
        } else {
            setMusicData((prev) => ({
                ...prev,
                [name]: file || value,
            }));
        }
    };

    // Submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!musicData.title || !musicData.music) return toast.error("Title and music are required");

        try {
            setUploading(true);
            setProgressStatus("Preparing upload...");
            setUploadProgress(0);
            
            const formData = new FormData();
            Object.entries(musicData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            setProgressStatus("Uploading to server...");
            
            const res = await axiosInstance.post('/api/admin/upload-music', formData, {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(Math.max(30, percent));
                    
                    if (percent < 50) {
                        setProgressStatus("Uploading files...");
                    } else if (percent < 80) {
                        setProgressStatus("Processing on server...");
                    } else {
                        setProgressStatus("Finalizing upload...");
                    }
                },
            });

            if (!res.data?.newMusic) return toast.error("Failed to upload music.");
            
            setProgressStatus("Upload completed!");
            setUploadProgress(100);
            
            setMusicData({ title: "", artist: "", category: "", image: null, music: null, duration: null });

            const imageInput = document.getElementById('image');
            const audioInput = document.getElementById('audio');
            if (imageInput) imageInput.value = '';
            if (audioInput) audioInput.value = '';

            setUploadedMusic(prev => ([...prev, res.data?.newMusic]));
            toast.success("Music uploaded successfully");

        } catch (error) {
            setProgressStatus("Upload failed");
            toast.error(error.response?.data?.error || 'Something went wrong')
        } finally {
            // Reset progress after a delay
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                setProgressStatus("");
            }, 2000);
        }
    };

    // Theme based styling
    const bgMain = isLightMode ? "bg-neutral-100 text-gray-900" : "bg-[#0a0a0a] text-white";
    const bgCard = isLightMode ? "bg-white border border-gray-300" : "bg-[#1a1a1a] border border-[#333]";
    const inputBg = isLightMode ? "bg-neutral-100 border-gray-300 border-[1px]" : "bg-[#2a2a2a] border-[#333]";
    const buttonColor = isLightMode ? "bg-black/90 text-white hover:bg-black" : "bg-white/80 hover:bg-white text-black";
    const fileColor = isLightMode ? "file:bg-black/90 file:text-white hover:file:bg-black" : "file:bg-white/80 hover:file:bg-white file:text-black";

    return (
        <main className={`min-h-screen flex flex-col items-center justify-center py-12 transition-colors duration-300 ${bgMain}`}>
            <div className={`w-full max-w-xl p-8 max-sm:p-6 rounded-2xl shadow-lg space-y-6 ${bgCard}`}>
                <h2 className="text-3xl font-bold text-center">Upload Music</h2>
                <form className="space-y-4">

                    <label htmlFor="title" className="block text-sm mb-1">Title *</label>
                    <input disabled={uploading} id="title" type="text" name="title" value={musicData.title} onChange={handleChange} className={`disabled:cursor-not-allowed w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`} required />

                    <label htmlFor="artist" className="block text-sm mb-1">Artist</label>
                    <input disabled={uploading} id="artist" type="text" name="artist" value={musicData.artist} onChange={handleChange} className={`disabled:cursor-not-allowed w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`} />

                    <label htmlFor="image" className="block text-sm mb-1">Image</label>
                    <input disabled={uploading} id="image" type="file" name="image" accept="image/*" onChange={handleChange} className={`disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${fileColor}`} />

                    <label htmlFor="audio" className="block text-sm mb-1">Audio *</label>
                    <input disabled={uploading} id="audio" type="file" name="music" accept="audio/*" onChange={handleChange} className={`disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${fileColor}`} required />

                    <label className="block text-sm mb-1">Category</label>
                    <Select value={musicData.category} handleChange={handleChange} isLightMode={isLightMode} />

                    {/* Enhanced Progress bar with status */}
                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{progressStatus}</span>
                                <span className="text-sm">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Submit button */}
                    <button type="submit" className={`disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 w-full py-2 rounded ${buttonColor} transition font-semibold cursor-pointer`}
                        onClick={handleSubmit} aria-label="Upload"
                        disabled={uploading}>
                        {uploading ? 'Processing...' : `Upload`}
                    </button>
                </form>
            </div>

            {/* Preview */}
            <div className={`w-full max-w-xl p-8 max-sm:px-3 mt-6 rounded-2xl shadow-lg space-y-6 ${bgCard}`}>
                {
                    (!uploadedMusic || uploadedMusic?.length === 0) && <p>No music uploaded at this time.</p>
                }
                {
                    uploadedMusic?.map((obj, i) => (
                        <div key={i} className="flex gap-3 items-center">
                            <img src={obj?.imagePath || "/template.png"} className="w-12 rounded-md aspect-square object-cover" alt="" />
                            <div className="tracking-wide">
                                <p className="font-semibold">{obj?.title?.length > 40 ? obj?.title?.slice(0, 40) + "..." : obj?.title}</p>
                                <p className="text-sm">{obj?.artist}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </main>
    );
}