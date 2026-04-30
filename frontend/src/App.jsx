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
import Dashboard from './pages/Dashboard';
import AdminSales from './pages/admin/AdminSales';
import AddProduct from './pages/admin/AddProduct';
import AdminProduct from './pages/admin/AdminProduct';
import AdminOrders from './pages/admin/AdminOrders';
import ShowUserOrders from './pages/admin/ShowUserOrders';
import AdminUsers from './pages/admin/AdminUsers';
import UserInfo from './pages/admin/UserInfo';
import ProtectedRoute from './components/ProtectedRoute';
import SingleProduct from './pages/SingleProduct';
import AddressForm from './pages/AddressForm';

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
    element:<ProtectedRoute><NavBar/><Profile/></ProtectedRoute>
  },
  {
    path:'/products',
    element:<><NavBar/><Products/></>
  },
  {
    path:'/products/:id',
    element:<ProtectedRoute><NavBar/><SingleProduct/></ProtectedRoute>
  },
  {
    path:'/cart',
    element:<ProtectedRoute><NavBar/><Cart/></ProtectedRoute>
  },
  {
    path:'/address',
    element:<ProtectedRoute><AddressForm/></ProtectedRoute>
  },
  {
    path:'/dashboard',
    element: <ProtectedRoute adminOnly={true}><NavBar/><Dashboard/></ProtectedRoute>,
    children:[
      {
        path:'sales',
        element:<AdminSales/>
      },
      {
        path:'add-product',
        element:<AddProduct/>
      },
      {
        path:'products',
        element:<AdminProduct/>
      },
      {
        path:'user/orders/:userId',
        element:<ShowUserOrders/>
      },
      {
        path:'users',
        element:<AdminUsers/>
      },
      {
        path:'users/:id',
        element:<UserInfo/>
      },
      {
        path:'orders',
        element:<AdminOrders/>
      },
    ]
  }
])

const App = () => {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
};

export default App;
