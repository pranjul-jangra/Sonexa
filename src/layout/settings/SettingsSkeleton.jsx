import './settingsSkeleton.css';



export default function SettingsSkeleton({ isLightMode, settingCard, settingsBg, settingsBorderColor }) {

    const skeletonTheme = isLightMode ? "settings-light-skeleton" : "settings-dark-skeleton";


    return (
        <main className={`min-h-screen flex flex-col items-center justify-center py-12 max-sm:px-1 transition-colors duration-300 ${settingsBg} *:w-full *:max-w-xl *:p-8 *:rounded-2xl *:shadow-lg *:space-y-6 *:my-5`}>
            <article className={`${settingCard} border ${settingsBorderColor}`}>
                <h1 className={`w-24 h-8 rounded-md ${skeletonTheme}`}></h1>

                <span className={`h-6 rounded-sm w-32 block ${skeletonTheme}`}></span>
                <p className={`h-6 rounded-sm w-40 ${skeletonTheme}`}></p>
            </article>

            <article className={`${settingCard} border ${settingsBorderColor}`}>
                <h1 className={`w-32 h-8 rounded-md ${skeletonTheme}`}></h1>

                <p className={`h-6 rounded-sm w-48 ${skeletonTheme}`}></p>
                <div className={`h-10 rounded-md w-44 ${skeletonTheme}`}></div>
            </article>

            <article className={`${settingCard} border ${settingsBorderColor}`}>
                <h1 className={`w-28 h-8 rounded-md ${skeletonTheme}`}></h1>

                <div className='flex flex-col items-start *:my-1.5'>
                    <div className={`h-10 rounded-md w-36 ${skeletonTheme}`}></div>
                    <div className={`h-10 rounded-md w-44 ${skeletonTheme}`}></div>
                    <div className={`h-10 rounded-md w-44 ${skeletonTheme}`}></div>
                </div>
            </article>

            <article className={`${settingCard} border ${settingsBorderColor}`}>
                <h1 className={`w-36 h-8 rounded-md ${skeletonTheme}`}></h1>

                <div className='flex flex-col items-start *:my-1.5'>
                    <div className={`h-10 rounded-md w-20 ${skeletonTheme}`}></div>
                    <div className={`h-10 rounded-md w-48 ${skeletonTheme}`}></div>
                    <div className={`h-10 rounded-md w-36 ${skeletonTheme}`}></div>
                    <div className={`h-10 rounded-md w-36 ${skeletonTheme}`}></div>
                </div>
            </article>
        </main>
    )
}
