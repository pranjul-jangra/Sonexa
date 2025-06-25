
export default function AudioSkeleton({ isLightMode }) {
    const bgColor = isLightMode ? 'bg-white/94 text-black border-black/10 hover:border-black/20' : 'bg-[#121212] border-white/10 text-white hover:border-white/20';
    const skeletonBg = isLightMode ? 'light-skeleton' : 'dark-skeleton';


    return (
        <>
            {
                new Array(10).fill(1).map((_, i) => (
                    <li key={`audio-skeleton-${i}`} className={`${bgColor} rounded-xl border p-2.5 cursor-pointer transition-colors duration-150`}>
                        <div className={`rounded-lg aspect-square w-full ${skeletonBg} transition-colors duration-150`} />

                        <div className="mt-3 *:py-2 *:rounded-sm *:transition-colors *:duration-150">
                            <h3 className={`w-11/12 mb-2 ${skeletonBg}`}></h3>
                            <p className={`w-4/5 ${skeletonBg}`}></p>
                        </div>

                        <div className="flex justify-between items-center mt-2 *:rounded-sm *:py-2 *:transition-colors *:duration-150">
                            <span className={`px-12 ${skeletonBg}`}></span>
                            <span className={`px-5 ${skeletonBg}`}></span>
                        </div>
                    </li>
                ))
            }
        </>
    )
}
