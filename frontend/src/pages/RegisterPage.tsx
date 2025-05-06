export default function RegisterPage() {
    return (
        <div className={'w-full h-screen flex justify-center items-center flex bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-md border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-4'}>
                <p className={'text-2xl'}>Register to Fjell Consultation</p>
                <form className={'w-full flex flex-col justify-center items-center gap-4'}>
                    <input className={'border-1 rounded-md border-brand px-3 py-2 w-full'}
                           placeholder={'Email'}></input>
                    <input className={'border-1 rounded-md border-brand px-3 py-2 w-full'}
                           placeholder={'Password'}></input>
                    <button className={'bg-brand text-white rounded-md px-3 py-2 w-full'} type={'submit'}>Register</button>
                </form>
            </div>
        </div>
    )
}