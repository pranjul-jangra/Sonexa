import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Own user data
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');
  // Profile user data
  const [profileData, setProfileData] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);  // shows loader on profile page when interceptor is retrying
  // Loading state
  const [loader, setLoader] = useState(false);
  const [profileMusicLoader, setProfileMusicLoader] = useState(false);


  return (
    <UserContext.Provider
      value={{
        user, setUser,
        token, setToken,
        profileData, setProfileData,
        profileLoading, setProfileLoading,
        loader, setLoader,
        profileMusicLoader, setProfileMusicLoader
      }}>
      {children}
    </UserContext.Provider>
  );
};
