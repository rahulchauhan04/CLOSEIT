import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
})

// Set up cloudinary
const uploadImageCloudinary = async (image) => {

     // Get image buffer
     const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

     // Upload image to cloudinary
     const uploadImage = await new Promise(( resolve, reject ) => {
          cloudinary.uploader.upload_stream({ folder: 'binkeyit'}, (error, uploadResult) => {
               return resolve(uploadResult);
          }).end(buffer);
     })

     return uploadImage; 
}

export default uploadImageCloudinary;