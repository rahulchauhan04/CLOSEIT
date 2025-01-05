import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const uploadImageController = async (request, response) => {
     try {
          const file = request.file  
          console.log("image Controller",file);
          
          const uploadImage = await uploadImageCloudinary(file);

          return response.status(200).json({
               message : "Uploaded successfully",
               data : uploadImage,
               success : true,
               error : false
          })
     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
}

export default uploadImageController;