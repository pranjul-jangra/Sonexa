import { lazy, useState, Suspense, useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from './context/UserContext';
import './App.css';
import UpdateEmail from './layout/settings/UpdateEmail';
import ResetPassword from './layout/settings/ResetPassword';
import ErrorBoundary from './middleware/ErrorBoundary';
import NoMatchingRoute from './components/InvalidRoute/NoMatchingRoute';

const LandingPage = lazy(() => import('./layout/landingPage/LandingPage'));
const Signup = lazy(() => import('./layout/signup/Signup'));
const Home = lazy(() => import('./layout/home/Home'));
const UploadMusic = lazy(() => import('./layout/uploadMusic/UploadMusic'));
const Profile = lazy(() => import('./layout/userProfile/Profile'));
const Player = lazy(() => import('./components/audioPlayer/Player'));
const UpdateProfile = lazy(() => import('./components/updateProfile/UpdateProfile'));
const Settings = lazy(() => import('./layout/settings/Settings'));
const Loader = lazy(() => import('./components/loader/Loader'));


function AppContent({ isLightMode, setIsLightMode }) {
  const location = useLocation();

  const showPlayerRoutes = ['/home', '/user/:adminId'];
  const shouldShowPlayer = showPlayerRoutes.some(route =>
    matchPath({ path: route, end: true }, location.pathname)  // params: Path to check for , Browser path to be checked
  );


  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage isLightMode={isLightMode} />} />
        <Route path='/signup' element={<Signup isLightMode={isLightMode} />} />
        <Route path='/home' element={<Home isLightMode={isLightMode} setIsLightMode={setIsLightMode} />} />
        <Route path='/upload' element={<UploadMusic isLightMode={isLightMode} />} />
        <Route path='/user/:adminId' element={<Profile isLightMode={isLightMode} setIsLightMode={setIsLightMode} />} />
        <Route path='/user/me/edit' element={<UpdateProfile isLightMode={isLightMode} />} />
        <Route path='/user/me/settings' element={<Settings isLightMode={isLightMode} setIsLightMode={setIsLightMode} />} />
        <Route path='/update-email' element={<UpdateEmail isLightMode={isLightMode} />} />
        <Route path='/reset-password' element={<ResetPassword isLightMode={isLightMode} />} />
        <Route path='*' element={<NoMatchingRoute isLightMode={isLightMode} />} />
      </Routes>


      {shouldShowPlayer && <Player isLightMode={isLightMode} />}
    </>
  );
}

// Main component
export default function App() {
  const [isLightMode, setIsLightMode] = useState(localStorage.getItem('sonexa-light-theme') === 'true');
  const { loader } = useContext(UserContext);

  return (
    <div className='w-dvw h-dvh bg-white'>
      <Router>
        <ErrorBoundary isLightMode={isLightMode}>
          <Suspense fallback={null}>
            <AppContent isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
          </Suspense>
        </ErrorBoundary>
      </Router>

      {/* Loader */}
      {loader && <Loader isLightMode={isLightMode} />}


      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#1e1e1e',
          color: '#fff',
          borderRadius: '0.5rem',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 0 10px #0f0f0f',
        }}
        bodyStyle={{
          fontSize: '0.95rem',
          lineHeight: '1.4',
        }}
        progressStyle={{
          background: '#1DB954',
        }}
      />
    </div>
  );
}
