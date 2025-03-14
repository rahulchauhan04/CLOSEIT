import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllcategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';

function App() {

    const dispatch = useDispatch();

    const fetchUser = async () => {
        const userData = await fetchUserDetails();
        if (userData && userData.data) {
            dispatch(setUserDetails(userData.data));
        }
    };

    const fetchCategory = async() => {
        try {
            dispatch(setLoadingCategory(true));
            const response = await Axios({...SummaryApi.getCategory })
            const { data : responseData } = response;

            if(responseData.success) {
                dispatch(setAllcategory(responseData.data));
            }
            
        } catch (error) {   
            AxiosToastError(error);
        } finally {
            dispatch(setLoadingCategory(false));
        }
    }

    const fetchSubCategory = async() => {
        try {
            const response = await Axios({...SummaryApi.getSubCategory })
            const { data : responseData } = response;

            if(responseData.success) {
                dispatch(setAllSubCategory(responseData.data));
            }
            
        } catch (error) {   
            AxiosToastError(error);
        } finally {
        }
    }

    useEffect(() => {
        fetchUser();
        fetchCategory();
        fetchSubCategory();
    }, []);

    return (
        <>
            <Header />
            <main className='min-h-[78vh]'>
                <Outlet />
            </main>
            <Footer />
            <Toaster />
        </>
    );
}

export default App;
