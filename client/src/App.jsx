import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllcategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';

function App() {

    const dispatch = useDispatch();

    const fetchUser = async () => {
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data))
    };

    const fetchCategory = async() => {
        try {
            const response = await Axios({...SummaryApi.getCategory })
            const { data : responseData } = response;

            if(responseData.success) {
                dispatch(setAllcategory(responseData.data));
            }
            
        } catch (error) {   
            AxiosToastError(error);
        } finally {
        }
    }

    useEffect(() => {
        fetchUser();
        fetchCategory();
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
