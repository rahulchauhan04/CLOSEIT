import React from "react";

const ProductCardAdmin = ({ data }) => {
  return (
    <div className="flex flex-col bg-white rounded-md shadow-sm hover:shadow-md transition-shadow p-4">
      {/* Image Container */}
      <div className="flex items-center justify-center h-40 md:h-48 rounded-md overflow-hidden">
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="object-contain max-h-full"
        />
      </div>

      {/* Text Content */}
      <div className="mt-3">
        <p className="text-sm md:text-base text-gray-800 line-clamp-2">
          {data?.name}
        </p>
        <p className="text-xs md:text-sm text-gray-500 mt-1">{data?.unit}</p>
      </div>
    </div>
  );
};

export default ProductCardAdmin;
