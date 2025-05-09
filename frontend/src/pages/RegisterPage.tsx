import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router";

export default function RegisterPage() {
    const navigate = useNavigate()

    const [registerForm, setRegisterForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        setRegisterForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const authServerUrl = import.meta.env.VITE_AUTH_SERVER_URL;

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegisterForm({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        })
        axios
            .post(`${authServerUrl}/register`, {
                email: registerForm.email,
                password: registerForm.password,
                first_name: registerForm.firstName,
                last_name: registerForm.lastName,
            })
            .then(function (response) {
                console.log(response);
                navigate('/login')
            })
            .catch(function (error) {
                console.log(error);
                alert('Something went wrong');
            });
    };

    return (
        <div
            className={
                'w-full h-screen justify-center items-center flex bg-brand/20 p-4'
            }
        >
            <div
                className={
                    'max-w-full w-md border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-4'
                }
            >
                <p className={'text-2xl'}>Register to Fjell Consultation</p>
                <form
                    onSubmit={handleSubmit}
                    className={
                        'w-full flex flex-col justify-center items-center gap-4'
                    }
                >
                    <input
                        name={'email'}
                        required
                        type={'email'}
                        onChange={handleChange}
                        value={registerForm.email}
                        className={
                            'border-1 rounded-md border-brand px-3 py-2 w-full'
                        }
                        placeholder={'Email'}
                    ></input>
                    <input
                        name={'firstName'}
                        type={'text'}
                        required
                        onChange={handleChange}
                        value={registerForm.firstName}
                        className={
                            'border-1 rounded-md border-brand px-3 py-2 w-full'
                        }
                        placeholder={'First Name'}
                    ></input>
                    <input
                        type={'text'}
                        name={'lastName'}
                        required
                        onChange={handleChange}
                        value={registerForm.lastName}
                        className={
                            'border-1 rounded-md border-brand px-3 py-2 w-full'
                        }
                        placeholder={'Last Name'}
                    ></input>
                    <input
                        name={'password'}
                        required
                        type={'password'}
                        onChange={handleChange}
                        value={registerForm.password}
                        className={
                            'border-1 rounded-md border-brand px-3 py-2 w-full'
                        }
                        placeholder={'Password'}
                    ></input>
                    <button
                        className={
                            'bg-brand text-white rounded-md px-3 py-2 w-full'
                        }
                        type={'submit'}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
