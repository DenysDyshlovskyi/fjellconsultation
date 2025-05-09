import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router";

export default function LoginPage() {
    const navigate = useNavigate()

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        setLoginForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const authServerUrl = import.meta.env.VITE_AUTH_SERVER_URL;

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.target.reset();
        setLoginForm({
            email: '',
            password: '',
        })
        axios
            .post(`${authServerUrl}/login`, {
                email: loginForm.email,
                password: loginForm.password,
            })
            .then(function (response) {
                console.log(response);
                navigate('/home')
            })
            .catch(function (error) {
                console.log(error);
                alert('Something went wrong');
            });
    };

    return (
        <div className={'w-full h-screen justify-center items-center flex bg-brand/20 p-4'}>
            <div
                className={'max-w-full w-md border-1 border-brand-alt/25 rounded-lg flex flex-col bg-main justify-center items-center p-5 gap-4'}>
                <p className={'text-2xl'}>Welcome back!</p>
                <form onSubmit={handleSubmit} className={'w-full flex flex-col justify-center items-center gap-4'}>
                    <input required name={'email'} type={'email'} onChange={handleChange} className={'border-1 rounded-md border-brand px-3 py-2 w-full'}
                           placeholder={'Email'} value={loginForm.email}
                    ></input>
                    <input required name={'password'} type={'password'} onChange={handleChange} className={'border-1 rounded-md border-brand px-3 py-2 w-full'}
                           placeholder={'Password'}></input>
                    <button className={'bg-brand text-white rounded-md px-3 py-2 w-full'} type={'submit'} value={loginForm.password}>Log In</button>
                </form>
            </div>
        </div>
    )
}