import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';

export default function NewTicketPage() {
    const [ticketForm, setTicketForm] = useState({
        title: '',
        description: '',
        categoryId: '',
    });
    const [ticketCategories, setTicketCategories] = useState([]);

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        setTicketForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const apiServerURL = import.meta.env.VITE_API_SERVER_URL;

    useEffect(() => {
        const fetchTicketCategories = async () => {
            try {
                const response = await axios.get(
                    `${apiServerURL}/tickets/categories`,
                );
                setTicketCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching ticket categories:', error);
            }
        };

        fetchTicketCategories();
    }, []); // Empty dependency array means this runs once when component mounts

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.target.reset();
        axios
            .post(`${apiServerURL}/tickets`, {
                title: ticketForm.title,
                description: ticketForm.description,
                category_id: ticketForm.categoryId,
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
                alert('Something went wrong');
            });
    };

    return (
        <div
            className={
                'w-full h-screen flex justify-center items-center bg-brand/20 p-4'
            }
        >
            <div
                className={
                    'max-w-full w-2xl border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-2'
                }
            >
                <p className={'text-2xl'}>Submit new Ticket</p>
                <form
                    onSubmit={handleSubmit}
                    className={'flex flex-col gap-4 w-full'}
                >
                    <input
                        required
                        name={'title'}
                        className={
                            'border-1 rounded-md border-brand px-3 py-2 w-full'
                        }
                        placeholder={'Title'}
                        onChange={handleChange}
                    />
                    <select
                        required
                        name={'categoryId'}
                        className={
                            'border-1 rounded-md border-brand px-3 py-2 w-full'
                        }
                        onChange={handleChange}
                        value={ticketForm.categoryId}
                    >
                        <option value="" disabled>
                            Category
                        </option>
                        {ticketCategories.length > 0 ? (
                            ticketCategories.map((category) => (
                                <option
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.categoryName}
                                </option>
                            ))
                        ) : (
                            <option value="">Loading categories...</option>
                        )}
                    </select>
                    <textarea
                        required
                        name={'description'}
                        placeholder={'Message'}
                        className={
                            'border-brand rounded-md border-1 w-full h-full px-4 py-2'
                        }
                        onChange={handleChange}
                    />
                    <button
                        className={'bg-brand text-white rounded-md px-3 py-2'}
                        type={'submit'}
                    >
                        Submit Ticket
                    </button>
                </form>
                <button
                    className={'bg-brand text-white rounded-md px-3 py-2'}
                    type={'submit'}
                >
                    Save Draft
                </button>

                <a href={'/home'} className={'text-xl text-link underline'}>
                    Cancel
                </a>
            </div>
        </div>
    );
}
