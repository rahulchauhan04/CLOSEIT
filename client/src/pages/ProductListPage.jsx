import React, { useState,useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from '../components/Loading';
import CardProduct from "../components/CardProduct";
import { useSelector } from 'react-redux';
import { validUrlConvert } from "../utils/validURLConvert";

const ProductListPage = () => {

  const [data,setData] = useState([]);
  const [page,setPage] = useState(1);
  const [loading,setLoading] = useState(false);
  const [totalPage,setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory); 
  const [DisplaySubCategory, setDisplaySubCategory] = useState([]);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory?.slice(0,subCategory?.length - 1).join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];
  
  const fetchProductsData = async() => {

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryandSubCategory,
        data : { 
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8
         }
      })

      const { data : responseData } = response;
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...data,...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
      
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductsData();
  }
  ,[params])

  useEffect(() => {
    const sub = AllSubCategory.filter( s => {
      const filterData = s.category.some( el => {
        return el._id === categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub);
  }
  ,[params,AllSubCategory])


  return (
     <section className="sticky top-24 lg:top-20">
        <div className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]"> 
          {/* sub category */}
                <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2">
                {
                  [...DisplaySubCategory]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s, index) => {
                    const link = `/${validUrlConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validUrlConvert(s.name)}-${s._id}`;

                    return (
                    <Link 
                      to={link}
                      className={`w-full p-2 lg:flex items-center lg:w-full box-border lg:gap-4 border-b ${subCategoryId === s._id ? "bg-green-100" : ""} hover:bg-green-100 cursor-pointer`} 
                      key={s._id || index}
                    >
                      <div className="w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border">
                      <img 
                        src={s.image} 
                        alt="subCategory" 
                        className="w-14 lg:h-14 lg:w-12 h-full object-scale-down "
                      />
                      </div>
                      <p className="-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base">{s.name}</p>
                    </Link>
                    )
                  })
                }
                </div>

                {/* Product */}
          <div className="sticky top-20">
            <div className="bg-white shadow-md p-4 z-10">
              <h3 className="font-semibold">{subCategoryName}</h3>
            </div>
            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
                {data.length > 0 ? (
                  data.map((p,index) => {
                    return (
                      <CardProduct
                        data={p}
                        key={p._id+"ProductListPage"+index}
                      />
                    )
                  })
                ) : !loading && (
                  <div className="col-span-full flex flex-col justify-center items-center py-16 rounded-b-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-lg text-gray-500 animate-pulse">No products available in this category.</p>
                    <p className="text-sm text-gray-400 mt-2">Try checking other categories.</p>
                  </div>
                )}
              </div>
            </div>

            {
              loading && (
                <Loading />
              )
            }
          </div>
        </div>
     </section>
  )
};

export default ProductListPage;
