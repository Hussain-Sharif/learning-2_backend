import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    

const uploadOnCloudinary=async (localFilePath)=> {
    try {
        if(!localFilePath) return null
        const uploadedResponse=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        console.log("File Uploaded Successfully in Cloudinary","& File URL",uploadedResponse.url)
        fs.unlinkSync(localFilePath)
        console.log("Now after the image is being uploaded in cloudinary File in local is removed")
        return uploadedResponse
    } catch (error) {
        fs.unlinkSync(localFilePath) // To remove it when it fail and make sure it should remove the file from the local file structure
        return null
    }
}





export default uploadOnCloudinary


// Below WAS PROVIDED BY CLOUDINARY 
// (async function() {

//     
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log("While Uploading Error==> ",error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();