export default function ViewTicketsPage() {
    return (
        <div className={'w-full h-screen flex justify-center items-center flex bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-6xl border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-4'}>
                <p className={'text-2xl'}>Your tickets</p>
                <a href={'/home'} className={'text-xl text-link underline'}>Back to Home</a>
            </div>
        </div>
    )
}