export default function ViewTicketsPage() {
    return (
        <div className={'w-full h-screen flex justify-center items-center bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-6xl border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-10 gap-4'}>
                <p className={'text-2xl'}>Your tickets</p>
                <table className={'w-full table-auto overflow-y-scroll'}>
                    <thead className={'w-full h-16 border-1'}>
                        <tr className={'w-full h-16 bg-brand/20 flex flex-row items-center justify-center px-5'}>
                            <td className={'w-full text-xl font-bold m-auto'}>Ticket ID</td>
                            <td className={'w-full text-xl font-bold m-auto'}>Title</td>
                            <td className={'w-full text-xl font-bold m-auto'}>Category</td>
                            <td className={'w-full text-xl font-bold m-auto'}>Description</td>
                        </tr>
                    </thead>
                    <tbody className={'w-full'}>
                        <tr className={'w-full h-16 bg-brand/20 flex flex-row items-center justify-center px-5'}>
                            <td className={'w-full text-2xl font-bold m-auto'}># 123456</td>
                            <td className={'w-full text-md m-auto'}>My Big Problem</td>
                            <td className={'w-full text-md m-auto'}>Option 1</td>
                            <td className={'w-full text-md m-auto'}>I need help please</td>
                        </tr>
                        <tr className={'w-full h-16 bg-brand/20 flex flex-row items-center justify-center px-5'}>
                            <td className={'w-full text-2xl font-bold m-auto'}># 123456</td>
                            <td className={'w-full text-md m-auto'}>My Big Problem</td>
                            <td className={'w-full text-md m-auto'}>Option 1</td>
                            <td className={'w-full text-md m-auto'}>I need help please</td>
                        </tr>
                        <tr className={'w-full h-16 bg-brand/20 flex flex-row items-center justify-center px-5'}>
                            <td className={'w-full text-2xl font-bold m-auto'}># 123456</td>
                            <td className={'w-full text-md m-auto'}>My Big Problem</td>
                            <td className={'w-full text-md m-auto'}>Option 1</td>
                            <td className={'w-full text-md m-auto'}>I need help please</td>
                        </tr>
                        <tr className={'w-full h-16 bg-brand/20 flex flex-row items-center justify-center px-5'}>
                            <td className={'w-full text-2xl font-bold m-auto'}># 123456</td>
                            <td className={'w-full text-md m-auto'}>My Big Problem</td>
                            <td className={'w-full text-md m-auto'}>Option 1</td>
                            <td className={'w-full text-md m-auto'}>I need help please</td>
                        </tr>
                        <tr className={'w-full h-16 bg-brand/20 flex flex-row items-center justify-center px-5'}>
                            <td className={'w-full text-2xl font-bold m-auto'}># 123456</td>
                            <td className={'w-full text-md m-auto'}>My Big Problem</td>
                            <td className={'w-full text-md m-auto'}>Option 1</td>
                            <td className={'w-full text-md m-auto'}>I need help please</td>
                        </tr>
                        <tr className={'w-full h-16 bg-brand/20 flex flex-row items-center justify-center px-5'}>
                            <td className={'w-full text-2xl font-bold m-auto'}># 123456</td>
                            <td className={'w-full text-md m-auto'}>My Big Problem</td>
                            <td className={'w-full text-md m-auto'}>Option 1</td>
                            <td className={'w-full text-md m-auto'}>I need help please</td>
                        </tr>

                    </tbody>
                </table>
                <a href={'/home'} className={'text-xl text-link underline'}>Back to Home</a>
            </div>
        </div>
    )
}