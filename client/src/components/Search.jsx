import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {

     // Redirect to search page
     const navigate = useNavigate();

     // Get the current location   
     const location = useLocation();

     // Check if the current page is search page
     const [ isSearchPage,setIsSearchPage ] = useState(false)

     // Check if the device is mobile
     const [isMobile] = useMobile();

     useEffect(() => {
          const isSearch = location.pathname === "/search"
          setIsSearchPage(isSearch)

     },[location])

     const redirectToSearchPage = () => {
          navigate('/search');
     }

     console.log("search", isSearchPage);
     

  return (
     <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-md 
                    border overflow-hidden flex items-center h-full bg-slate-50 
                     text-neutral-600 group focus-within:border-primary-200">
          <div>
          {
               ( isMobile && isSearchPage) ? (
                    // {/* Back button */}
                    <Link to={"/"} className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md">
                         <FaArrowLeft size={20} />
                    </Link>
               ) : (
                    // {/* Search button */}
                    <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
                         <IoSearchSharp size={22} />
                    </button>
               )
          }
          </div>
          
          
          {/* Search */}
          <div className="w-full h-full">
               {
                    !isSearchPage ? (
                         //not on search page
                         <div onClick={redirectToSearchPage} className="w-full h-full flex items-center">
                              <TypeAnimation
                                   sequence={[
                                        // Same substring at the start will only be typed out once, initially
                                        'Search "milk"',1000, // wait 1s before replacing "Mice" with "Hamsters"
                                        'Search "bread"',1000,
                                        'Search "sugar"',1000,
                                        'Search "paneer"',1000,
                                        'Search "atta"',1000,
                                        'Search "biscuits"',1000,
                                        'Search "choclate"',1000,
                                        'Search "icecream"',1000,
                                        'Search "rice"',1000,
                                        'Search "egg"',1000
                                   ]}
                                        wrapper="span"
                                        speed={50}
                                        repeat={Infinity}
                              />
                         </div>
                    ) : (
                         //on search page
                         <div className="w-full h-full">
                              <input 
                                   type="text"
                                   placeholder="Search for atta rice dal and more"
                                   autoFocus
                                   className="w-full h-full bg-transparent outline-none"
                              />
                         </div>
                    )
               }
          </div>
          
     </div>
);
};

export default Search;
