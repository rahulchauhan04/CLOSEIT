import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";

const Header = () => {

     const [isMobile] = useMobile();
     const location = useLocation();
     const isSearchPage = location.pathname === ('/search');

  return (
     <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1">
          {
               !(isSearchPage && isMobile ) && (
                    <div className="container flex mx-auto items-center px-2 justify-between">
                         {/* {logo} */}
                         <div className="h-full">
                              <Link to={"/"} className="h-full flex justify-center items-center">
                                   <img 
                                        src={logo} 
                                        width={170}
                                        height={60}
                                        alt="logo" 
                                        className="hidden lg:block"
                                   />
                                   <img 
                                        src={logo} 
                                        width={120}
                                        height={60}
                                        alt="logo" 
                                        className="lg:hidden"
                                   />
                              </Link>
                         </div>

                         {/* Search */}
                         <div className="hidden lg:block ">
                              <Search />
                         </div>

                         {/* login and my cart */}
                         <div>
                              
                              {/* User icon is only display in mobile */}
                              <button className="text-neutral-500 lg:hidden">
                                   <FaRegCircleUser size={26} />
                              </button>

                              {/* Desktop*/}
                              <div className="hidden lg:block">
                                   <Link to={"/login"}>Login</Link>
                                   <button>
                                        <div>

                                        </div>
                                        <div>
                                             <p>1 items</p>
                                             <p>total price</p>
                                        </div>
                                   </button>
                              </div>
                         </div>
                    </div>
               )
          }

          {/* Search for mobile */}
          <div className="container mx-auto lg:hidden">
               <Search />
          </div>
     </header>);

};

export default Header;
