import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';

function NavBar({ className, hideButton, isAuthenticated }) {
  const navi = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navi('/');
  };

  return (
    <nav className= { className}> 
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center">
            <div className="hidden sm:flex space-x-4 ml-6">
              <Link to="/" className="text-white hover:bg-[#CDCDCD] hover:text-white px-3 py-2 rounded-md text-m">Home</Link>
              <Link to="/platform" className="text-white hover:bg-[#CDCDCD] hover:text-white px-3 py-2 rounded-md text-m">Platform</Link>
              <Link to="/resources"className="text-white hover:bg-[#CDCDCD] hover:text-white px-3 py-2 rounded-md text-m">Resources</Link>
              <Link to="/about" className="text-white hover:bg-[#CDCDCD] hover:text-white px-3 py-2 rounded-md text-m">About</Link>

              {!hideButton && !isAuthenticated && (
                <Link to="/login" className="bg-[#CDCDCD] hover:bg-[#CDCDCD] text-black font-bold py-2 px-4 rounded">Login In</Link>
              )}
              {!hideButton && isAuthenticated && (
                <button onClick={handleLogout} className="bg-[#CDCDCD] hover:bg-[#CDCDCD] text-black font-bold py-2 px-4 rounded">Logout</button>
              )}
            </div>
          </div>  
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
