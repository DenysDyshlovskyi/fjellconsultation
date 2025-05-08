import {ChangeEvent, useState} from 'react';
import axios from 'axios';

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
        e.target.reset();
        axios.post('/api/tickets', {
                title: ticketForm.title,
                description: ticketForm.description,
                category: ticketForm.category,
            }
        ).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
            alert('Something went wrong');
        });
    }

    return (
        <div className={'w-full h-screen flex justify-center items-center bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-2xl border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-2'}>
                <p className={'text-2xl'}>Submit new Ticket</p>
                <form onSubmit={handleSubmit} className={'flex flex-col gap-4 w-full'}>
                    <input required name={'title'} className={'border-1 rounded-md border-brand px-3 py-2 w-full'}
                           placeholder={'Title'} onChange={handleChange}/>
                    <select required name={'category'} className={'border-1 rounded-md border-brand px-3 py-2 w-full'}
                            onChange={handleChange}>
                        <option selected disabled>Category</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>
                    <textarea required name={'description'} placeholder={'Message'}
                              className={'border-brand rounded-md border-1 w-full h-full px-4 py-2'}
                              onChange={handleChange}/>
                    <button className={'bg-brand text-white rounded-md px-3 py-2'} type={'submit'}>Submit Ticket
                    </button>
                </form>
                <button className={'bg-brand text-white rounded-md px-3 py-2'} type={'submit'}>Save Draft</button>

                <a href={'/home'} className={'text-xl text-link underline'}>Cancel</a>
            </div>
        </div>
    )
}