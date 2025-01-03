import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice.js";

const Login = () => {

  const [data,setData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }
  
  const valideValue = Object.values(data).every(el => el)

  const handleSubmit = async(e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data : data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.setItem("accesstoken", response.data.data.accesstoken)
        localStorage.setItem("refreshtoken", response.data.data.refreshtoken)

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data))

        setData({
          email: "",
          password: "",
        })

        navigate("/")
      }

      console.log("response", response);
      
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="grid gap-1">
            <label htmlFor="name">Email:</label>
            <input 
              type="email" 
              id="email" 
              className="bg-blue-50 p-2 border outline-none focus-within:border-primary-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <label htmlFor="name">Password:</label>
            <div className="bg-blue-50 p-2 border flex items-center focus-within:border-primary-200">
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                className="w-full outline-none"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <div onClick={ () => setShowPassword(preve => !preve) } className="cursor-pointer">
                {
                  showPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )
                }
              </div>
            </div>
            <Link to={"/forgot-password"} className="block ml-auto hover:text-primary-200">Forgot Password ?</Link>
          </div>

          <button disabled={!valideValue} className={`${ valideValue ? "bg-green-800" : "bg-gray-500" } hover:bg-green-700 text-white py-2 rounded font-semibold my-3 tracking-wide`}>Login</button>
          
        </form>

        <p>
          Don't have account ? <Link to={"/register"}
          className="font-semibold text-green-700 hover:text-green-800">Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
