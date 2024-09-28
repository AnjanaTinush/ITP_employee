import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/AdminLogin.css';
import Adminsignin from "../../Images/Adminsignin.png"; // Corrected import

export default function ManagerSignin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('api/auth/manager_signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log(response.status);
      if (response.ok) {
        alert(data.message); 
        navigate('/login-manager'); // Redirect to the manager login page
      } else {
        alert(data.message); // Display error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="container flex justify-between items-start mr-20 mb-5">
        {/* Image container */}
        <div className="w-[600px]">
          <img src={Adminsignin} alt="Admin Signin" className="w-full h-auto rounded-xl mt-12 ml-12" />
        </div>
        {/* Form container */}
        <div className="w-[500px] mt-12">
          <form onSubmit={handleSubmit}>
            <h1>Welcome Admin</h1>
            <div className="flex flex-col mt-4">
              <label htmlFor="email" className="text-gray-700 font-bold mb-2 left-0">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={handleOnChange}
                placeholder="Enter your email"
                required
                className="p-2 block w-full rounded-xl bg-gray-100 text-black border-none placeholder-gray-400 placeholder-opacity-50 font-custom text-md"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-700 font-bold mb-2">Password</label>
              <input
                type="text"
                id="password"
                name="password"
                onChange={handleOnChange}
                placeholder="Enter your password"
                required
                className="p-2 block w-full rounded-xl bg-gray-100 text-black border-none placeholder-gray-400 placeholder-opacity-50 font-custom text-md"
              />
            </div>

            <button
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-70 mt-8"
            >
              Login
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600"></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
