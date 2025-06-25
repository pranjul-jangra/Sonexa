import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ isLightMode }) {
    const navigate = useNavigate();

    // Theme based styling
    const bgColor = isLightMode ? 'bg-white' : 'bg-[#0a0a0a]';
    // Navigate to home
    useEffect(() => { navigate('/home', { replace: true }); }, [navigate])

    return <div className={`h-dvh w-dvw ${bgColor}`}></div>
}
