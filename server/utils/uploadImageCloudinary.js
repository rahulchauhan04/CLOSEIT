import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
     
})

// Set up cloudinary
const uploadImageCloudinary = async (image) => {

     const buffer = Buffer.from(await image.arrayBuffer());

     // Upload image to cloudinary
     const uploadImage = await new Promise(( resolve, reject ) => {
          cloudinary.uploader.upload_stream({ folder: 'binkeyit'}, (error, uploadResult) => {
               return resolve(uploadResult);
          }).end(buffer);
     })

     return uploadImage; 
}

export default uploadImageCloudinary;