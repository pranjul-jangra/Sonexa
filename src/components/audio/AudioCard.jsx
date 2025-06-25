import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillPlayCircleFill, BsPlay } from "react-icons/bs";
import { MusicContext } from "../../context/MusicContext";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

export default function AudioCard({ isLightMode, song, showUser = true }) {
  const navigate = useNavigate();
  const { setCurrentSong, setSongs, setSongsByUser } = useContext(MusicContext);
  const { user } = useContext(UserContext);

  // Increament play count
  const updatePlayCount = async () => {
    try {
      // get the user _id for registered user or else generate UUID for anonymous user
      let visitorId;
      if (user?._id) {
        visitorId = user._id
      } else {
        const storedId = localStorage.getItem('visitorId');
        if (storedId) {
          visitorId = storedId;
        } else {
          visitorId = crypto.randomUUID();
          localStorage.setItem('visitorId', visitorId);
        }
      }

      // Request to backend
      const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/admin/inc-play-count/${song?.musicId}/${visitorId}`);

      // Updating only played music play count
      setSongs(prev => ([...prev?.map((obj) => {
        if (obj?.musicId === song.musicId) {
          obj.playCount = res.data?.playCount || obj.playCount;
          return obj;
        } else {
          return obj;
        }
      })]));

      setSongsByUser(prev => {
        const updated = { ...prev };
        // Find the user whose songs include this song
        for (const userId in updated) {
          const songs = updated[userId];
          const songIndex = songs.findIndex(s => s.musicId === song.musicId);

          if (songIndex !== -1) {
            // Update the play count of the matched song
            songs[songIndex] = {
              ...songs[songIndex],
              playCount: res.data?.playCount || songs[songIndex].playCount
            };
            return { ...updated, [userId]: songs};
          }
        }
        return prev; // if not found, return original
      });

    } catch (error) {
      return;
    }
  }

  // Seconds to minutes
  function SecToMinutes(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Theme styling
  const bgColor = isLightMode ? 'bg-white/94 text-black border-black/10 hover:border-black/20' : 'bg-[#121212] border-white/10 text-white hover:border-white/20';

  return (
    <li className={`group ${bgColor} rounded-xl border p-2.5 cursor-pointer transition-colors duration-150`} onClick={() => { setCurrentSong(song); updatePlayCount() }}>
      <div className="relative">
        <img src={song?.imagePath} alt='' className="rounded-lg aspect-square w-full object-cover" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
          <BsFillPlayCircleFill className="text-white text-5xl" />
        </div>

        {/* Uploader profile tag */}
        {showUser && <div className="flex items-center absolute bottom-1 right-1 rounded-xl p-1 gap-1.5 bg-black/50" onClick={e => { e.stopPropagation(); navigate(`/user/${song?.adminId?._id}`) }}>
          <img src={song?.adminId?.profileImage || "/user.png"} className="w-6 h-6 rounded-full" alt="" />
          <p className="whitespace-nowrap text-sm text-white">{(song?.adminId?.username?.length > 13 ? song?.adminId?.username.slice(0, 13) + "..." : song?.adminId?.username) || "unknown"}</p>
        </div>}
      </div>

      <div className="mt-3">
        <h3 className="text-base font-semibold truncate">{song?.title}</h3>
        <p className="text-sm text-gray-400 truncate mb-0.5">{song?.artist || 'Unknown artist'}</p>
      </div>

      <div className="flex justify-between items-center flex-wrap text-xs text-gray-400">
        <span className="flex items-center gap-0.5 flex-nowrap"><BsPlay className="mb-[1px]" /> {song?.playCount} Plays</span>
        <span className="whitespace-nowrap">{song?.duration ? SecToMinutes(song?.duration) + " min" : "--:--"}</span>
      </div>
    </li>
  );
}
