import jwt from "jsonwebtoken";

const auth = async(request, response, next) => {
     try {
          //get token from cookies or header
          const token = request.cookies.accessToken || request?.header?.authorization?.split(" ")[1];

          //check if token is provided
          if (!token) {
               return response.status(401).json({
                    message : "Provide token"
               })
          }

          //verify token
          const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

          if (!decode) {
               return response.status(401).json({
                    message : "unauthorized access",
                    error : true,
                    success : false
               })
          }
          
          //set user id in request
          request.userId = decode.id

          next()

     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
}

export default auth;