import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronUp, BsChevronDown, BsPauseFill, BsRepeat1, BsPlayFill, BsSkipStartFill, BsSkipEndFill, BsPlay } from "react-icons/bs";
import { IoMdVolumeHigh } from "react-icons/io";
import { RxLoop } from "react-icons/rx";
import { FaVolumeXmark } from "react-icons/fa6";
import { MusicContext } from "../../context/MusicContext";
import { CgClose, CgDetailsMore } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";


export default function Player({ isLightMode }) {
  const navigate = useNavigate();
  const { currentSong, setCurrentSong, songs } = useContext(MusicContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // Add duration state
  const [progress, setProgress] = useState(0);
  const [isUserSeeking, setIsUserSeeking] = useState(false); // Prevent conflicts during seeking
  const [showDetails, setShowDetails] = useState(false);
  const audioRef = useRef(null);

  // Seconds to minutes
  function SecToMinutes(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Loop the song using "loop" attribute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, [loop]);

  // Reset and load new song when song changes
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    // Reset states
    setCurrentTime(0);
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);

    // Load new song
    audioRef.current.src = currentSong.filePath;
    audioRef.current.load();

    // Wait for metadata to load before playing
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);

      // Auto-play the new song
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            setIsPlaying(false);
          });
      }
    };

    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [currentSong]);

  // Sync isPlaying state with actual audio state
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // Handle when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Play/Pause song
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => { setIsPlaying(false); });
      }
    }
  };

  // Update progress time
  const handleTimeUpdate = () => {
    if (!audioRef.current || isUserSeeking) return;

    const currentTime = audioRef.current.currentTime || 0;
    const duration = audioRef.current.duration || 0;
    setCurrentTime(currentTime);

    // Calculate and update progress percentage
    if (duration > 0) {
      const progressPercentage = (currentTime / duration) * 100;
      setProgress(progressPercentage);
    }
  };

  // Update current time on interaction
  const handleSeek = (e) => {
    if (!audioRef.current) return;

    const duration = audioRef.current.duration || 0;
    if (duration === 0) return;

    const progressValue = parseFloat(e.target.value);
    const newTime = (progressValue / 100) * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(progressValue);
  };

  // Handle seeking start/end to prevent conflicts
  const handleSeekStart = () => {
    setIsUserSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsUserSeeking(false);
  };

  // Update volume
  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  // Mute/unmute volume
  const handleMute = () => {
    if (!audioRef.current) return;

    if (volume > 0) {
      setVolume(0);
      audioRef.current.volume = 0;
    } else {
      setVolume(0.5);
      audioRef.current.volume = 0.5;
    }
  };

  // Switch to next song
  const playNext = () => {
    if (!songs || !currentSong) return;
    const index = songs.findIndex(song => song.musicId === currentSong.musicId);
    const next = (index + 1) % songs.length;
    setCurrentSong(songs[next]);
  };

  // Switch to prev song
  const playPrevious = () => {
    if (!songs || !currentSong) return;
    const index = songs.findIndex(song => song.musicId === currentSong.musicId);
    const prev = (index - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prev]);
  };

  // Handle audio end - automatically play next song
  const handleEnded = () => { if (!loop) { playNext(); } };

  // Handle audio error
  const handleError = (e) => { setIsPlaying(false); };

  // Theme style
  const bgColor = isLightMode ? "bg-white text-black" : "bg-[#181818] text-white";
  const buttonColor = isLightMode ? "bg-black/85 hover:bg-black text-white" : "bg-white/70 hover:bg-white/90 text-black";
  const progressBarColor = isLightMode ? "accent-black/60" : "accent-white/70";


  return currentSong ? (
    <>
      <div className={`fixed bottom-0 left-0 flex flex-col justify-between w-full z-50 ${bgColor} transition-all duration-150 shadow-2xl ${isOpen ? "h-full" : "h-16"}`}>
        {/* Header - Minimized */}
        <div className="flex items-center justify-between max-sm:px-2 px-4 h-16 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onPlay={handlePlay} onPause={handlePause} onEnded={handleEnded} onLoadedMetadata={handleLoadedMetadata} onError={handleError} preload="metadata" />

          <div className="flex items-center gap-3">
            <img src={currentSong?.imagePath || "/template.png"} alt={currentSong?.title} className="h-12 w-12 rounded-md object-cover" />
            <div>
              <h4 className="text-sm font-medium line-clamp-1">{currentSong?.title}</h4>
              <p className="text-xs text-gray-400 line-clamp-1">{currentSong?.artist || "Choose a song to play"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" aria-label={isPlaying ? "Pause" : "Play"} onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
              {isPlaying ? <BsPauseFill className="text-2xl" /> : <BsPlayFill className="text-2xl" />}
            </button>
            {isOpen && <CgDetailsMore onClick={() => setShowDetails(true)} />}
            {isOpen ? <BsChevronDown /> : <BsChevronUp />}
          </div>
        </div>

        {/* Expanded View */}
        {isOpen && (
          <div className="flex flex-col items-center justify-center max-sm:px-2 px-6 pb-2 gap-3">
            {/* template + title + artist */}
            <div className="text-center">
              <div className="relative rounded-xl overflow-hidden group flex flex-col items-center justify-center">
                <img src={currentSong?.imagePath || "/template.png"} alt={currentSong?.title} className="w-48 h-48 object-cover shadow-md" />

                {/* Song uploader */}
                <div className="gap-2 items-center justify-center w-full h-full backdrop-blur-[1.5px] bg-black/20 absolute inset-0 hidden group-hover:flex">
                  <div className="cursor-pointer flex flex-col items-center" onClick={() => { setIsOpen(!isOpen); navigate(`/user/${currentSong?.adminId?._id}`) }}>
                    <img className="w-10 aspect-square rounded-lg object-cover" src={currentSong?.adminId?.profileImage || "/user.png"} alt="" />
                    <span className="text-white">{currentSong?.adminId?.username || "Unknown user"}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-semibold truncate">{currentSong?.title}</h2>
              <p className="text-sm text-gray-400">{currentSong?.artist || "Choose a song to play"}</p>
            </div>

            {/* Progress bar */}
            <input aria-label="music track" name="music track" type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} onMouseDown={handleSeekStart} onMouseUp={handleSeekEnd} onTouchStart={handleSeekStart} onTouchEnd={handleSeekEnd} className={`w-full ${progressBarColor}`} />
            <div className="w-full flex justify-between">
              <span>{SecToMinutes(currentTime) || "0:00"}</span>
              <span>{duration ? SecToMinutes(duration) : (currentSong?.duration ? SecToMinutes(currentSong?.duration) : "0:00")}</span>
            </div>

            {/* Play/Pause or switch song */}
            <div className="flex items-center justify-center gap-6">
              <button type="button" aria-label="Previous song" onClick={playPrevious}><BsSkipStartFill className="text-3xl" /></button>
              <button type="button" aria-label={isPlaying ? "Pause" : "Play"} className={`text-4xl ${buttonColor} p-3 rounded-full cursor-pointer`} onClick={togglePlay} >
                {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
              </button>
              <button type="button" aria-label="Next song" onClick={playNext}><BsSkipEndFill className="text-3xl" /></button>
            </div>

            {/* Volume + loop */}
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-2">
                <button type="button" aria-label={volume === 0 ? "Unmute" : "Mute"} className="text-xl" onClick={handleMute}>
                  {volume === 0 ? <FaVolumeXmark /> : <IoMdVolumeHigh />}
                </button>
                <input type="range" min="0" max="1" step="0.01" value={volume} name="volume" onChange={handleVolume} className={`${progressBarColor}`} aria-label="Change volume" />
              </div>

              <button type="button" aria-label={loop ? "Repeat all" : "Repeat one"} onClick={() => setLoop(!loop)} className={`cursor-pointer text-2xl`} >
                {loop ? <BsRepeat1 /> : <RxLoop />}
              </button>
            </div>
          </div>
        )}
      </div>


      <AnimatePresence>
        {/* Song deyails */}
        {
          showDetails && <motion.section
            initial={{ background: 'rgba(0, 0, 0, 0.02)' }}
            animate={{ background: 'rgba(0, 0, 0, 0.17)' }}
            exit={{ background: 'rgba(0, 0, 0, 0.02)', transition: { duration: 0.3, ease: 'easeOut' } }}
            transition={{ duration: 0.24, ease: 'easeIn' }}
            className="w-screen h-screen flex justify-center items-center fixed inset-0 z-60"
            onClick={e => { e.stopPropagation(); setShowDetails(false); }}>

            <motion.article
              initial={{ y: 40, opacity: 0.7 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className={`p-8 relative rounded-3xl w-full max-w-xl h-full max-h-[400px] overflow-hidden ${bgColor}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 text-2xl focus-visible:outline-purple-500 focus-visible:outline-2 rounded-sm cursor-pointer" aria-label="Close" onClick={() => setShowDetails(false)}><CgClose /></button>

              <p className="h-full w-full tracking-wide overflow-auto whitespace-pre-wrap flex flex-col items-start">
                <img src={currentSong?.imagePath || "/user.png"} className="w-28 aspect-square mb-2 object-cover rounded-lg" alt="" />
                <span className="font-bold text-shadow-2xs">Title: {currentSong?.title}</span>
                <span className="text-shadow-2xs">Artist: {currentSong?.artist || "Unknown artist"}</span>
                <span className="text-shadow-2xs">Type: {currentSong?.category || "Not defined"}</span>
                <span className="text-shadow-2xs">Duration: {SecToMinutes(currentSong?.duration)} min</span>
                <span className="text-shadow-2xs">File extension: {(() => {
                  const splittedArray = currentSong?.filePath.split('.');
                  const extension = splittedArray[splittedArray?.length - 1];
                  return extension.toUpperCase();
                })()}</span>
                <span className="text-shadow-2xs">MIME type: audio/</span>
                <span className="text-sm flex items-center mt-1"><BsPlay className="mb-[1px]" />{currentSong?.playCount || 0} Plays</span>
                {currentSong?.createdAt && <span className="text-sm">Uploaded on: {new Date(currentSong?.createdAt).toLocaleDateString()}</span>}
              </p>
            </motion.article>
          </motion.section>
        }
      </AnimatePresence>
    </>
  ) : null;
}