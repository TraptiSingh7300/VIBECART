import OrderCard from '@/components/OrderCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ShowUserOrders = () => {
  const {userId}=useParams()
  const [userOrder,setUserOrder]=useState(null)

  const getUserOrders=async()=>{
    const accessToken=localStorage.getItem("accessToken")
    const res=await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/user-order/${userId}`,{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    })
    if(res.data.success){
      setUserOrder(res.data.orders)
    }
  }

  useEffect(()=>{
    getUserOrders()
  },[])
  return (
    <div className="py-20 pl-[350px]">
      <OrderCard userOrder={userOrder} />
    </div>
  )
}

export default ShowUserOrders;