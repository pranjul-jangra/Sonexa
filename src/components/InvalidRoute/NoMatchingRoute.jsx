import { MdErrorOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const NoMatchingRoute = ({ isLightMode }) => {
  const navigate = useNavigate();

  const bgColor = isLightMode ? 'bg-neutral-100 text-gray-900' : 'bg-[#0a0a0a] text-white';
  const borderColor = isLightMode ? 'border-gray-200 bg-white' : 'border-[#444] bg-[#1a1a1a]';
  const activeState = isLightMode ? 'active:bg-gray-200' : 'active:bg-zinc-800';

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 py-12 ${bgColor}`}>
      <div className={`rounded-xl border shadow-xl p-8 max-w-md w-full text-center ${borderColor}`}>
        <MdErrorOutline className="text-red-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-sm opacity-80 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className={`px-4 py-2 rounded-md font-semibold ${activeState}`}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NoMatchingRoute;
