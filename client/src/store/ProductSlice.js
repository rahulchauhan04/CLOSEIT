import { createSlice } from '@reduxjs/toolkit';


const initialValue = {
     allCategory : [],
     subCategory : [],
     product: [],
}


const productSlice = createSlice({
     name : "product",
     initialState : initialValue,
     reducers : {
          setAllcategory : ( state,action ) => {
               state.allCategory = [...action.payload];
          }
     }
})

export const  { setAllcategory } = productSlice.actions;

export default productSlice.reducer