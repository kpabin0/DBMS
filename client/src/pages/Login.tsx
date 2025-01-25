import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextInputField from '../components/TextInputField';
import { backendBaseURL } from '../data/utils';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isAdminChecked, setIsAdminChecked] = useState(false); 
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  
    if (name === 'email' && value === 'admin@gmail.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleAdminCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdminChecked(e.target.checked);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {   const response = await axios.post(backendBaseURL + `/auth/login`, formData);
      
      alert(response.data.message || 'Login successful!');
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); 
    } catch (error: any) {
      console.error('Error during login:', error.response || error.message);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    navigate('/resetpassword');
  };

  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center">
      <img
        src="/assets/bg.png"
        alt="bg"
        className="absolute -z-50 brightness-75 h-full w-full bg-contain top-0 left-0"
      />
      
   
      <div className="rounded-xl shadow-xl w-[25rem] h-[50vh] flex flex-col justify-between items-center bg-theme-w">
        <h2 className="w-full py-8 text-center text-sm font-light bg-theme text-theme-w rounded-t-xl">
          Welcome back to <span className="uppercase text-4xl font-extrabold block">Catchup</span>
        </h2>

        <form className="w-[90%]" onSubmit={handleFormSubmit}>
         
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

       
          <div className="mt-2">
            <TextInputField
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onInputChange={handleInputChange}
              errMsg={!formData.email ? 'Email field is required' : undefined}
              required
            />
          </div>

          <div className="mt-2">
            <TextInputField
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onInputChange={handleInputChange}
              errMsg={!formData.password ? 'Password field is required' : undefined}
              required
            />
          </div>

     
          {isAdmin && (
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="admin-checkbox"
                checked={isAdminChecked}
                onChange={handleAdminCheckboxChange}
                disabled={false} 
              />
              <label htmlFor="admin-checkbox" className="ml-2">
                I am an admin
              </label>
            </div>
          )}

         
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-theme-cont hover:underline"
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className="mt-4 rounded-md bg-theme p-2 w-full text-xl text-theme-w font-bold hover:bg-theme-alt transition-colors duration-200"
          >
            Sign in
          </button>
        </form>

       
        <p className="my-4 text-sm text-theme-t">
          Not a member?&nbsp;
          <Link to="/register" className="font-semibold text-theme hover:text-theme-alt">
            Register your account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
