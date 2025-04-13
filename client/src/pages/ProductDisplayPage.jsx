import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { DisplayPriceinRupees } from "../utils/DisplayPriceinRupees";
import Divider from '../components/Divider';
import image1 from "../assets/minute_delivery.png"
import image2 from "../assets/Best_Prices_Offers.png"
import image3 from "../assets/Wide_Assortment.png"

const ProductDisplayPage = () => {

  const params = useParams();
  let productId = params?.product?.split("-").slice(-1)[0];
  const [data, setData] = useState({ name:"", image: [] });
  const [image, setImage] = useState([0]);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId: productId }
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch product details when the component mounts
  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  }
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  }

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2">
      {/* left content */}
      <div>
        {/* Main product image display */}
        <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
          <img 
            src={data.image[image]} 
            className="w-full h-full object-scale-down "
            alt={data.name}
          />
        </div>

        {/* Image navigation dots */}
        <div className="flex items-center justify-center gap-3 my-2">
          {
            data.image.map((img, index) => {
              return (
                <div 
                key={img+index+"point"}
                  className={`bg-slate-200 w-5 h-5 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}
                />
              )
            })
          }
        </div>

        {/* Thumbnail carousel with navigation controls */}
        <div className="grid relative">
          <div ref={imageContainer} className="flex gap-4 z-10 relative overflow-x-auto scrollbar-none">
            {
              data.image.map((img, index) => {
                return (
                  <div className="w-20 h-20 min-h-20 min-w-20 shadow-md cursor-pointer" key={img+index}>
                    <img 
                      src={img}
                      alt={`${data.name} thumbnail ${index+1}`}
                      onClick={() => setImage(index)}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                )
              })
            }
          </div>

          {/* Left/Right navigation buttons */}
          <div className="w-full -ml-3 h-full flex justify-between absolute items-center">
            <button onClick={handleScrollLeft} className="z-10 relative bg-white p-1 rounded-full shadow-lg">
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className="z-10 relative bg-white p-1 rounded-full shadow-lg">
              <FaAngleRight/>
            </button>
          </div>
        </div>
      </div>

      {/* right content */}
      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <p className="bg-green-300 w-fit px-2 rounded-full">10 min</p>
        <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
        <p>{data.unit}</p>

        <Divider />
        <div>
          <p>Price</p>
          <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
            <p className="font-semibold text-lg lg:text-xl">{DisplayPriceinRupees(data.price)}</p>
          </div>
        </div>

        {
          data.stock === 0 ? (
            <div className="bg-red-100 text-red-600 my-4 px-4 py-2 rounded">
              <p>Out of stock</p>
            </div>
          ) : (
            <button className="my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded">Add</button>
          )
        }

        <Divider />

        <h2 className="font-semibold">Why shop from binkeyit </h2>
        <div>
          {/* image1 */}
          <div className="flex items-center gap-4 my-4">
            <img 
              src={image1} 
              alt="superfast delievery"
              className="w-20 h-20" 
            />
            <div className="text-sm">
              <div className="font-semibold">SuperFast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          {/* image2 */}
          <div className="flex items-center gap-4 my-4">
            <img 
              src={image2} 
              alt="best prices and offers"
              className="w-20 h-20" 
            />
            <div className="text-sm">
              <div className="font-semibold">Best Prices & Offers</div>
              <p>Discover unbeatable prices and exclusive deals on our products.</p>
            </div>
          </div>
          {/* image3 */}
          <div className="flex items-center gap-4 my-4">
            <img 
              src={image3} 
              alt="Wide Assortment"
              className="w-20 h-20" 
            />
            <div className="text-sm">
              <div className="font-semibold">Wide Assortment</div>
              <p>Choose from 5000+ products across food, personal care, household & other categories.</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ProductDisplayPage;
