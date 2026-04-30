import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "@/assets/user.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { setUser } from "@/redux/userSlice";

const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    role: "user",
  });
  const [file, setFile] = useState(null);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName || "");
      formData.append("lastName", updateUser.lastName || "");
      formData.append("email", updateUser.email || "");
      formData.append("phoneNo", updateUser.phoneNo || "");
      formData.append("address", updateUser.address || "");
      formData.append("city", updateUser.city || "");
      formData.append("state", updateUser.state || "");
      formData.append("zipcode", updateUser.zipcode || "");
      formData.append("role", updateUser.role || "");

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (user?._id === userId) {
          dispatch(setUser(res.data.user));
        } else {
          // If editing someone else, just refresh their data on the page
          setUpdateUser(res.data.user);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  const getUserDetails = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/getUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Required to avoid 403
          },
        },
      );
      if (res.data.success) {
        setUpdateUser((prev) => ({ ...prev, ...res.data.user }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="pt-5 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex flex-col items-center justify-center gap-10 ml-[40vh]">
            <div className="flex mt-20 w-full mt-3">
              <Button onClick={() => navigate(-1)} className="cursor-pointer">
                <ArrowLeft />
              </Button>
              <div className="flex w-full justify-center">
                <h1 className="font-bold mb-7 text-2xl text-gray-800">
                  Update Profile
                </h1>
              </div>
            </div>
            <div className="w-full flex gap-5 justify-between items-start px-7 max-w-5xl">
              {/* profile section */}
              <div className="flex flex-col items-center">
                <img
                  src={updateUser?.profilePic || userLogo}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#ff5252]"
                />
                <Label className="mt-4 cursor-pointer bg-[#ff5252] text-white px-4 py-2 rounded-lg hover:bg-[#f42d2d]">
                  Change Picture
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
              {/* profile form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={updateUser?.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={updateUser?.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    disabled
                    value={updateUser?.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-pointer"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter your Contact No"
                    value={updateUser?.phoneNo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 "
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter your Address"
                    value={updateUser?.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={updateUser?.city}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">State</Label>
                    <Input
                      type="text"
                      name="state"
                      placeholder="Enter your state"
                      value={updateUser?.state}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">ZipCode</Label>
                    <Input
                      type="text"
                      name="zipcode"
                      placeholder="Enter your ZipCode"
                      value={updateUser?.zipcode}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Label className="block text-sm font-medium">Role </Label>
                  <RadioGroup
                    value={updateUser?.role}
                    onValueChange={(value) =>
                      setUpdateUser({ ...updateUser, role: value })
                    }
                    className="flex items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user">User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 text-white bg-[#ff5252] hover:bg-[#f42d2d] font-semibold py-2 rounded-lg"
                >
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
