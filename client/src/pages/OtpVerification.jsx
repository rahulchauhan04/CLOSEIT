import React, { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OtpVerification = () => {

  //state for the input fields
  const [data,setData] = useState(["","","","","","",])
  const navigate = useNavigate()

  //ref for the input fields
  const inputRef = useRef([])
  const location = useLocation();


  //check if all the input fields are filled
  const valideValue = data.every(el => el)

  //effects
  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password")
    }
  })

  //event handler for the form
  const handleSubmit = async(e) => {
    e.preventDefault();

    const requestData = {
        otp: data.join(""), // Change 'data' to 'otp' if the server expects 'otp'
        email: location?.state?.email
    };

    console.log("Request Data:", requestData);

    try {
        const response = await Axios({
            ...SummaryApi.forgot_password_otp_verification,
            data: requestData
        });

        if (response.data.error) {
            toast.error(response.data.message);
        }

        if (response.data.success) {
            toast.success(response.data.message);
            setData(["", "", "", "", "", ""]);
            navigate("/reset-password",{
              state: {
                data: response.data,
                email: location?.state?.email
              }
            });
        }

        console.log("response", response);

    } catch (error) {
        AxiosToastError(error);
    }
  }


  return (
    
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className="font-semibold text-lg">Enter Otp</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>

          {/* OTP */}
          <div className="grid gap-1">
            <label htmlFor="otp">Enter Your OTP:</label>

            <div className="flex items-center gap-2 justify-between">
              {
                //create 6 input fields
                data.map((element,index) => {
                  return (
                    <input 
                      key={"otp" + index}
                      type="text" 
                      maxLength={1}
                      value={data[index]}
                      ref={(ref) => {
                        inputRef.current[index] = ref
                        return ref
                      }}
                      onChange={(e) => {
                        const { value } = e.target

                        const newData = [...data]
                        newData[index] = value
                        setData(newData)

                        if(value && index < 5){
                          inputRef.current[index+1].focus()
                        }
                      }}
                      id="otp" 
                      className="bg-blue-50 w-full max-w-16 p-2 
                        border outline-none focus-within:border-primary-200
                        text-center font-semibold"
                    />
                  )
                })
              }
            </div>

          </div>

          <button disabled={!valideValue} className={`${ valideValue ? "bg-green-800" : "bg-gray-500" } hover:bg-green-700 text-white py-2 rounded font-semibold my-3 tracking-wide`}>Verify Otp</button>
          
        </form>

        <p>
          Already have account ? <Link to={"/login"}
          className="font-semibold text-green-700 hover:text-green-800">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
