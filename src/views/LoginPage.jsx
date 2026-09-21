import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navi = useNavigate();
  const { login } = useAuth();
  const name =  useRef();
  const password =  useRef();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSumbit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(name.current.value, password.current.value);
      navi(user.role === 'employer' ? '/platform' : '/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const token = hash.split("access_token=")[1].split("&")[0];

      fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          console.log("Name:", user.name);
          
        });
    }
  }, []);

  return (
    <div className="flex">
      <div className="flex w-1/2">
        <img src="https://i.pinimg.com/736x/d9/39/e2/d939e20093652518af872c7f7615e56f.jpg" alt="" className="w-full h-screen" />
      </div>

      <div className="w-1/2 flex flex-col justify-start items-center bg-white mt-25">
        <div className="flex text-6xl font-bold mb-2 mt-20">
          <h1 className="text-gray-300 mr-2">Welcome</h1>
          <h1 className="text-black">Back</h1>
        </div>

        <div className="w-1/2 text-left mb-4">
          <h3 className="text-gray-400 text-xl">Please log into your account.</h3>
        </div>

        <form onSubmit={handleSumbit} className="flex flex-col w-full items-center justify-center">
            <input
              type="email"
              placeholder="Email"
              ref={name}
              required
              className="bg-gray-100 mt-2 border border-gray-300 text-lg w-1/2 p-2"
            />
            <input
              type="password"
              placeholder="Password"
              ref={password}
              required
              className="bg-gray-100 mt-7 border border-gray-300  text-lg w-1/2 p-2"
            />

            {error && (
              <p className="text-red-600 text-sm mt-3 w-1/2 text-left">{error}</p>
            )}

            <div className="flex mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="bg-black hover:bg-[#CDCDCD] text-white font-bold py-3 px-10 mx-5 disabled:opacity-50"
              >
                {submitting ? 'Logging in...' : 'Login'}
              </button>
              <button type="button" onClick={() => navi('/signUp')} className="bg-white hover:bg-[#CDCDCD] border border-black text-black font-bold py-3 px-10 mx-7">
                Sign Up
              </button>
            </div>
        </form>

        <div className="text-neutral-500 flex mt-8 w-1/2 items-center">
          <hr className="flex-grow border-t border-neutral-400" />
          <span className="px-2 text-sm">OR SIGN IN WITH</span>
          <hr className="flex-grow border-t border-neutral-400" />
        </div>

        <button
          type="button"
          onClick={() => {
            alert('Google sign-in is a placeholder in this build — use email + password above.');
          }}
          className="flex items-center justify-center gap-3 w-1/2 bg-black text-white py-2 shadow-md mt-4 hover:bg-[#CDCDCD] hover:text-black border border-neutral-800 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
              c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4
              C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
              c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
              C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
              C29.211,35.091,26.715,36,24,36
              c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
              C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303
              c-0.792,2.237-2.231,4.166-4.087,5.571
              c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238
              C36.971,39.205,44,34,44,24
              C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          <span className="text-sm font-semibold"></span>
        </button>

        <div className="w-1/2 text-left mt-6 text-sm text-gray-500">
          <p>Signing up means you agree to our Terms & Conditions & Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
