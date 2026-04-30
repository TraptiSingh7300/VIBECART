// import React from 'react';

import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

const NavBar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);
  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin" ? true : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="bg-[#ff5252] fixed w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/* logo section */}
        <div>
          <Link to="/">
            <img src="/logo.jpg" alt="" className="w-50" />
          </Link>
        </div>
        {/* nav section */}
        <nav className="flex gap-10 justify-between items-center">
          <ul className="flex gap-7 items-center text-xl font-semibold">
            <Link to={"/"} className="text-white">
              <li>Home</li>
            </Link>
            <Link to={"/products"} className="text-white">
              <li>Products</li>
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`} className="text-white">
                <li>Hello, {user.firstName}</li>
              </Link>
            )}
            {admin && (
              <Link to={`/dashboard/sales`} className="text-white">
                <li>Dashboard</li>
              </Link>
            )}
          </ul>
          <Link to={"/cart"} className="relative">
            <ShoppingCart color="white" />
            <span className="bg-amber-50 text-[#ff5252] text-[15px] rounded-full absolute -top-3 -right-5 px-2 font-bold">
              {cart?.items?.length || 0}
            </span>
          </Link>
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-amber-50 text-[#ff5252] cursor-pointer"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-amber-50 text-[#ff5252] cursor-pointer"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
