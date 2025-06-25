import './profileSkelton.css'


export default function ProfileSkeleton({ isLightMode, borderColor }) {
    const bgColor = isLightMode ? 'bg-white/94 border-black/10' : 'bg-[#0a0a0a] border-white/10';
    const profileSkeletonBg = isLightMode ? 'profile-light-skeleton' : 'profile-dark-skeleton';
    const colorPallets = isLightMode ? 'bg-white/94' : 'bg-[#0a0a0a]';

    return (
        <section className={`w-screen h-screen flex ${bgColor}`}>
            {/* Sidebar Skeleton */}
            <aside className={`w-64 h-screen px-6 py-3 border-r ${borderColor} flex flex-col justify-between items-start`}>
                <div className="flex flex-col items-start w-full">
                    <h1 className={`w-4/5 py-4.5 mb-7 rounded-md ${profileSkeletonBg}`}></h1>
                    <div className={`w-3/5 py-3.5 mb-7 rounded-md ${profileSkeletonBg}`}></div>
                    <div className={`w-3/5 py-3.5 mb-7 rounded-md ${profileSkeletonBg}`}></div>
                    <div className={`w-3/5 py-3.5 mb-7 rounded-md ${profileSkeletonBg}`}></div>
                </div>
            </aside>

            {/* Profile Skeleton */}
            <section className="h-full w-full overflow-scroll">
                <div className={`mb-4 sticky top-0 ${colorPallets} z-10 px-6 py-3 flex items-center justify-between`}>
                    <h1 className={`w-96 py-4.5 rounded-md ${profileSkeletonBg}`}></h1>
                    <div className={`w-8 aspect-square rounded-md ${profileSkeletonBg}`}></div>
                </div>

                <section className="pb-18 px-6">
                    <article className="flex items-center gap-12 mb-4">
                        <div className={`w-32 aspect-square rounded-full ${profileSkeletonBg}`} />
                        <div className="flex gap-10">
                            <div className={`w-20 h-14 rounded-lg ${profileSkeletonBg}`}></div>
                            <div className={`w-20 h-14 rounded-lg ${profileSkeletonBg}`}></div>
                        </div>
                    </article>

                    <div className={`w-34 py-2.5 mb-2 rounded-md ${profileSkeletonBg}`}></div>
                    <div className={`w-56 py-2.5 mb-2 rounded-md ${profileSkeletonBg}`}></div>
                    <div className={`w-72 py-2.5 mb-2 rounded-md ${profileSkeletonBg}`}></div>
                    <div className={`w-36 py-2.5 mb-2 rounded-md ${profileSkeletonBg}`}></div>
                    <div className={`w-80 py-2.5 mb-2 rounded-md ${profileSkeletonBg}`}></div>
                    <div className={`w-64 py-2.5 mb-4 rounded-md ${profileSkeletonBg}`}></div>

                    <div className={`w-44 h-12 mb-5 rounded-lg ${profileSkeletonBg}`}></div>


                    {/* Posts */}
                    <article className={`w-full border-t ${borderColor}`}>
                        <div className="mt-3 mb-6 w-full flex items-center justify-between">
                            <h3 className={`w-34 h-10 rounded-md ${profileSkeletonBg}`}></h3>
                            <div className={`w-24 h-10 rounded-md ${profileSkeletonBg}`}></div>
                        </div>

                        <ul className="profile-posts-grid *:mb-2">
                            {
                                new Array(10).fill(1).map((_, i) => (
                                    <li key={`song-${i}`}>
                                        <div className={`w-full aspect-square rounded-md ${profileSkeletonBg}`} />

                                        <p className="flex justify-between items-center mt-2">
                                            <div className={`w-28 h-7 rounded-md ${profileSkeletonBg}`}></div>
                                            <div className={`w-3 h-7 rounded-md ${profileSkeletonBg}`}></div>
                                        </p>

                                        <p className={`w-24 h-7 mt-2 rounded-md ${profileSkeletonBg}`}></p>
                                        <p className={`w-22 h-5 mt-2 rounded-md ${profileSkeletonBg}`}></p>
                                    </li>
                                ))
                            }
                        </ul>
                    </article>
                </section>
            </section>
        </section>
    )
}
