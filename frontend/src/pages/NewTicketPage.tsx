export default function NewTicketPage() {
    return (
        <div className={'w-full h-screen flex justify-center items-center flex bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-6xl border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-2'}>
                <p className={'text-2xl'}>Submit new Ticket</p>
                <form>
                    <select className={'border-1 rounded-md border-brand px-3 py-2 w-full'}>
                        <option>Custom Ticket</option>
                        <option>Option 1</option>
                    </select>
                    <textarea placeholder={'Note'} className={'border-brand rounded-md border-1 w-full h-full my-3 p-2'}></textarea>
                </form>
                <button className={'bg-brand text-white rounded-md px-3 py-2'} type={'submit'}>Submit Ticket</button>
                <button className={'bg-brand text-white rounded-md px-3 py-2'} type={'submit'}>Save Draft</button>

                <a href={'/home'} className={'text-xl text-link underline'}>Cancel</a>
            </div>
        </div>
    )
}