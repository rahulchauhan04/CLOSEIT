import  CategoryModel from '../models/category.model.js';


export const AddCategoryController = async(request, response) => {
     try {
          // Get data from request body
          const { name, image } = request.body;

          // Check if all fields are provided
          if (!name || !image) {
               return response.status(400).json({
                    message : "All fields are required",
                    error : true,
                    success : false
               })
          }

          const addCategory = new CategoryModel({
               name,
               image
          })

          const saveCategory = await addCategory.save()

          if (!saveCategory) {
               return response.status(400).json({
                    message : "Not created",
                    error : true,
                    success : false
               })
          }

          return response.json({
               message : "Category added successfully",
               data : saveCategory,
               success: true,
               error : false,
          })
          
     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false,

          })
     }
}

export const getCategoryController = async(request, response) => {
     try {
          const data = await CategoryModel.find()

          if (!data) {
               return response.status(400).json({
                    message : "Not found",
                    error : true,
                    success : false
               })
          }

          return response.json({
               message : "Category found",
               data : data,
               success: true,
               error : false,
          })
          
     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false,

          })
     }
}

export const updateCategoryController = async(request, response) => {
     try {
          const { _id, name, image } = request.body;

          const update = await CategoryModel.updateOne({ _id : _id}, { name, image})

          return response.json({
               message : "Category Updated",
               success: true,
               error : false,
               data : update
          })

     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false,
          })
          
     }
}