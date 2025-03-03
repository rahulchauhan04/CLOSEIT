import { createSlice } from '@reduxjs/toolkit';


const initialValue = {
     allCategory : [],
     allSubCategory : [],
     product: [],
}


const productSlice = createSlice({
     name : "product",
     initialState : initialValue,
     reducers : {
          setAllcategory : ( state,action ) => {
               state.allCategory = [...action.payload];
          },
          setAllSubCategory : ( state,action ) => {
               state.allSubCategory = [...action.payload];
          }
     }
})

export const  { setAllcategory,setAllSubCategory } = productSlice.actions;

export default productSlice.reducer