import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignUpPage() {
    const navi = useNavigate();
    const { signup } = useAuth();
    const fname =  useRef();
    const lname =  useRef();
    const email =  useRef();
    const number =  useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const companyName = useRef();
    const [role, setRole] = useState('employer');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSumbit = async (event) => {
        event.preventDefault();
        setError('');

        if (password.current.value !== confirmPassword.current.value) {
            setError('Passwords do not match');
            return;
        }
        if (password.current.value.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setSubmitting(true);
        try {
            const user = await signup({
                email: email.current.value,
                password: password.current.value,
                firstName: fname.current.value,
                lastName: lname.current.value,
                role,
                companyName: role === 'employer' ? companyName.current?.value : undefined,
            });
            navi(user.role === 'employer' ? '/platform' : '/');
        } catch (err) {
            setError(err.message || 'Sign up failed');
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        const hash = window.location.hash;
        if(hash.includes("access_token")){
            const token = hash.split("access_token")[1].split("&")[0];

            fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {Authorization: `Bearer $token`},
            })
            .then((res) => res.json())
            .then((user) => {
                console.log("Name:", user.name);
            });
        }
    }, []);

    return (
        <div className="relative min-h-screen">
        <img src="https://i.pinimg.com/736x/52/d8/d1/52d8d1745e37b41307692ddeea8f8a0e.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-md w-full bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Create an Account</h2>

            <form onSubmit={handleSumbit}>
                <div className="flex flex-row gap-3 mb-4">
                    <input
                    type="text"
                    placeholder="First Name"
                    ref={fname}
                    className="w-1/2 p-2 rounded-md bg-transparent border border-neutral-700 text-white placeholder-neutral-500 shadow-xl"
                    />
                    <input
                    type="text"
                    placeholder="Last Name"
                    ref={lname}
                    className="w-1/2 p-2 rounded-md bg-transparent border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 "
                    />
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    ref={email}
                    className="w-full p-2 rounded-md bg-transparent border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 mb-4"
                />

                <input
                    type="text"
                    placeholder="(xxx) xxx-xxxx"
                    ref={number}
                    className="w-full p-2 rounded-md bg-transparent border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2  mb-6"
                />

                <input
                    type="password"
                    placeholder="Password"
                    ref={password}
                    className="w-full p-2 rounded-md bg-transparent border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 mb-4"
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    ref={confirmPassword}
                    className="w-full p-2 rounded-md bg-transparent border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 mb-6"
                />

                <div className="flex flex-row w-full mb-4">
                    <div className="ps-4 border border-gray-200 rounded-sm dark:border-neutral-700 flex items-center w-1/2">
                        <input
                        id="bordered-radio-1" type="radio" value="employer" name="bordered-radio"
                        checked={role === 'employer'}
                        onChange={() => setRole('employer')}
                        className="w-4 h-4  bg-gray-100 border-gray-300"
                        />
                        <label htmlFor="bordered-radio-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Employer
                        </label>
                    </div>

                    <div className="ps-4 border border-gray-200 rounded-sm dark:border-neutral-700 flex items-center mx-30">
                        <input
                        id="bordered-radio-2"
                        type="radio"
                        value="employee"
                        name="bordered-radio"
                        checked={role === 'employee'}
                        onChange={() => setRole('employee')}
                        className="w-4 h-4 bg-gray-100 border-gray-300" />
                        <label
                        htmlFor="bordered-radio-2"
                        className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                        Employee
                        </label>
                    </div>
                </div>

                {role === 'employer' && (
                    <input
                        type="text"
                        placeholder="Company Name"
                        ref={companyName}
                        className="w-full p-2 rounded-md bg-transparent border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 mb-4"
                    />
                )}

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white hover:bg-neutral-800 hover:text-white text-black font-semibold py-2 rounded-md shadow-md transition-all duration-200 disabled:opacity-50"
                >
                    {submitting ? 'Creating account...' : 'Create Account'}
                </button>

                
            </form>

            <div className="text-neutral-500 flex mt-4 w-full items-center">
                    <hr className="flex-grow border-t border-neutral-700"/> 
                    <span className="px-2 text-sm"> OR SIGN IN WITH </span>
                    <hr className="flex-grow border-t border-neutral-700"/>
            </div>
                <button
                    type="button"
                    onClick={() => {
                        alert('Google sign-in is a placeholder in this build — use the form above.');
                    }}
                    className="w-full flex bg-neutral-800 text-black py-2 rounded-md shadow-md mt-4 items-center justify-center hover:bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="w-7 h-7" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                </button>


                <p className="text-center text-neutral-500 text-sm mt-4">
                Already have an account?{" "}
                <button type="button" onClick={() => navi('/login')} className="text-neutral-300 hover:text-neutral-100 underline">
                Sign in
                </button>
            </p>
            </div>
        </div>
        </div>
    );
}

export default SignUpPage;
