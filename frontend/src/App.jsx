// import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Verify from './pages/Verify';
import VerifyEmail from './pages/VerifyEmail';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Products from './pages/Products';
import Cart from './pages/Cart';

const router = createBrowserRouter([
  {
    path:'/',
    element:<><NavBar/><Home/><Footer/></>
  },
  {
    path:'/signup',
    element:<><Signup/></>
  },
  {
    path:'/login',
    element:<><Login/></>
  },
  {
    path:'/verify',
    element:<><Verify/></>
  },
  {
    path:'/verify/:token',
    element:<><VerifyEmail/></>
  },
  {
    path:'/profile/:userId',
    element:<><NavBar/><Profile/></>
  },
  {
    path:'/products',
    element:<><NavBar/><Products/></>
  },
  {
    path:'/cart',
    element:<><NavBar/><Cart/></>
  },
])

const App = () => {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
};

export default App;
