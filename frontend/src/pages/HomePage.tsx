export default function HomePage() {
    return (
        <div className={'w-full h-screen flex justify-center items-center flex bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-6xl border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-4'}>
                <p className={'text-2xl'}>Welcome Home!</p>
                <a href={'/create'} className={'text-xl text-link underline'}>New ticket</a>
                <a href={'/mytickets'} className={'text-xl text-link underline'}>View my tickets</a>
                <a href={'/login'} className={'text-xl text-warning underline'}>Log out</a>
            </div>
        </div>
    )
}