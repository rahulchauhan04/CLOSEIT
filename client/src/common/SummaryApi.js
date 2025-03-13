export  const baseURL = "http://localhost:8080";

const SummaryApi = {
     register : {
          url : "/api/user/register",
          method : "POST"
     },
     login : {
          url : "/api/user/login",
          method : "POST"
     },
     forgot_password : {
          url : "/api/user/forgot-password",
          method : "PUT"
     },
     forgot_password_otp_verification : {
          url : "/api/user/verify-forgot-password-otp",
          method : "PUT"
     },
     resetPassword :{
          url : "/api/user/reset-password",
          method : "PUT"
     },
     refreshToken : {
          url : "/api/user/refresh-token",
          method : "POST"
     },
     userDetails : {
          url : "/api/user/user-details",
          method : "GET"
     },
     logout : {
          url : "/api/user/logout",
          method : "GET"
     },
     uploadAvatar : {
          url : "/api/user/upload-avatar",
          method : "PUT"
     },
     updateUserDetails : {
          url : "/api/user/update-user",
          method : "PUT"
     },
     addCategory : {
          url : "/api/category/add-category",
          method : "POST"
     },
     uploadImage : {
          url : "/api/file/upload",
          method : "POST"
     },
     getCategory : {
          url : "/api/category/get",
          method : "GET"
     },
     updateCategory : {
          url : "/api/category/update",
          method : "PUT"
     },
     deleteCategory : {
          url : "/api/category/delete",
          method : "DELETE"
     },
     createSubCategory : {
          url : "/api/subcategory/create",
          method : "POST"
     },
     getSubCategory : {
          url : "/api/subcategory/get",
          method : "POST"
     },
     updateSubCategory : {
          url : "/api/subcategory/update",
          method : "PUT"
     },
     deleteSubCategory : {
          url : "/api/subcategory/delete",
          method : "DELETE"
     },
     createProduct : {
          url : "/api/product/create",
          method : "post"
     },
     getProduct : {
          url : "/api/product/get",
          method : "post"
     }
}

export default SummaryApi;