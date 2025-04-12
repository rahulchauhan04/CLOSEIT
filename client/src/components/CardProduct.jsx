import React from "react";
import { DisplayPriceinRupees } from "../utils/DisplayPriceinRupees";
import { Link } from "react-router-dom";
import { validUrlConvert } from "../utils/validURLConvert";

const CardProduct = ({data}) => {

     const url = `/product/${validUrlConvert(data.name)}-${data._id}`;

  return (
     <Link to={url} className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded hover:shadow-md cursor-pointer bg-white">
          <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
               <img 
                    src={data.image[0]}
                    className="w-full h-full object-scale-down lg:scale-125" 
                    alt="" 
               
               />
          </div>

          <div className="p-[1px] px-2 rounded text-green-600 bg-green-50 text-xs w-fit">
               10 mins
          </div>

          <div className=" px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2 ">
               {data.name}
          </div>

          <div className=" px-2 lg:px-0 text-sm lg:text-base w-fit text-ellipsis line-clamp-1 ">
               {data.unit}
          </div>


          <div className=" px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
               <div className="font-semibold">
                    {DisplayPriceinRupees(data.price)}
               </div>
               <div className=" ">
                    <button className="bg-green-600 text-white px-2 lg:px-4 py-1 rounded hover:bg-green-700">
                         Add
                    </button>
               </div>
          </div>
     </Link>
  )
};

export default CardProduct;
