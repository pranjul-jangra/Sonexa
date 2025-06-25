export default function Loader({ isLightMode }) {
    // Theme based styling
    const color = isLightMode ? 'text-[#3934bc]' : 'text-[#e0dffc]'

    return (
        <div className={`w-dvw h-dvh backdrop-blur-xs flex items-center justify-center fixed inset-0 z-100 overflow-hidden ${color} transition-colors duration-150`}>
            <div className="text-center">
                <div className="mb-3 flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                        <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
                <p className="opacity-70 tracking-wider font-bold">Getting things ready for you...</p>
            </div>

            <div className="particle-background">
                {[...Array(20)].map((_, i) => (
                    <span key={i} className="particle" />
                ))}
            </div>
        </div>
    )
}
