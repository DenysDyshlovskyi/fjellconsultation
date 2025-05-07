import {ChangeEvent, useState} from 'react';

export default function NewTicketPage() {
    const [ticketForm, setTicketForm] = useState({
        title: '',
        description: '',
        category: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setTicketForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(ticketForm)
    }

    return (
        <div className={'w-full h-screen flex justify-center items-center bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-6xl border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-2'}>
                <p className={'text-2xl'}>Submit new Ticket</p>
                <form onSubmit={handleSubmit}>
                    <input name={'title'} className={'border-1 rounded-md border-brand px-3 py-2 w-full'}
                           placeholder={'Title'} onChange={handleChange}></input>
                    <select name={'category'} className={'border-1 rounded-md border-brand px-3 py-2 w-full mt-3'} onChange={handleChange}>
                        <option selected disabled>Category</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>
                    <textarea name={'description'} placeholder={'Message'} className={'border-brand rounded-md border-1 w-full h-full my-3 p-2'} onChange={handleChange}></textarea>
                    <button className={'bg-brand text-white rounded-md px-3 py-2'} type={'submit'}>Submit Ticket</button>
                </form>
                <button className={'bg-brand text-white rounded-md px-3 py-2'} type={'submit'}>Save Draft</button>

                <a href={'/home'} className={'text-xl text-link underline'}>Cancel</a>
            </div>
        </div>
    )
}