import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";

const UploadSubCategoryModal = ({ close }) => {
     const [subCategoryData, setSubCategoryData] = useState({
          name: "",
          image: "",
          category: [],
     });

     const handleChange = (e) => {
          const {name, value } = e.target;

          setSubCategoryData((prev) => {
               return {
                    ...prev,
                    [name]: value,
               }
          })
     }

     const handleUploadSubCategoryImage = async(e) => {
          const file = e.target.files[0];

          if(!file) return;

          const response = await uploadImage(file);
          const { data : ImageResponse } = response;

          setSubCategoryData((prev) => {
               return {
                    ...prev,
                    image: ImageResponse.data.url,
               }
          })
     }

  return(
     <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-800  bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-white p-4 rounded">
               <div className="flex items-center justify-between">
                    <h1 className="font-semibold">
                         Add Sub Category
                    </h1>
                    <button className="w-fit block ml-auto" onClick={close}>
                         <IoClose size={25}/>
                    </button>
               </div>

               {/* Form */}
               <form className="my-3 grid gap-3">

                         {/* Name */}
                         <div className="grid gap-1">
                              <label htmlFor="name">Name</label>
                              <input 
                                   id="name"
                                   name="name"
                                   value={subCategoryData.name}
                                   onChange={handleChange}
                                   type="text"
                                   className="p-3 bg-blue-50 border outline-none focus-within:border-primary-200"
                              />
                         </div>

                         {/* SubCategory */}
                         <div className="grid gap-1">
                              <p>Image</p>
                              <div className="flex flex-col lg:flex-row items-center gap-3">
                                   <div className="border h-36 lg:w-36 w-full bg-blue-50 flex items-center justify-center">
                                        {
                                             !subCategoryData.image ? (
                                                  <p className="text-sm text-neutral-400 ">No Image</p>
                                             ) : (
                                                  <img 
                                                  alt="subCategory"
                                                  src={subCategoryData.image}
                                                  className="h-full w-full object-scale-down"
                                                  />
                                             )
                                        }
                                        
                                   </div>
                                   <label htmlFor="uploadSubCategoryImage">
                                        <div className="px-4 py-1 border border-primary-100 text-primary-100 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer">Upload Image</div>
                                        <input 
                                             id="uploadSubCategoryImage"
                                             type="file"
                                             className="hidden"
                                             onChange={handleUploadSubCategoryImage}
                                        />
                                   </label>
                              </div>
                         </div>

                         {/* Category */}
                         <div className="grid gap-1">
                              <label>Select Category</label>
                              <div className="border focus-within:border-primary-20 rounded ">
                                   {/* display values */}
                                             

                                   {/* select category */}
                                   {/* <label>Select Category</label>
                                   <select className="bg-blue-50 border p-3">
                                        <option value={""}>Select Category</option>
                                   </select> */}
                                   <select className="w-full p-2 bg-transparent outline-none">
                                        <option value={""} disabled>Select Category</option>
                                   </select>
                              </div>
                         </div>
               </form>
          </div>
     </section>
  );
};

export default UploadSubCategoryModal;
