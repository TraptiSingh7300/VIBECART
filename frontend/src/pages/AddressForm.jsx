import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );
  const [showFrom, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.02).toFixed(2));
  const total = subtotal + shipping + tax;
  
  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    // 1. Basic Validation
    if (!accessToken) {
      return toast.error("Please login to continue");
    }

    try {
      // 2. Create Order on Backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!data.success || !data.order) {
        return toast.error("Failed to initialize order with server");
      }

      // 3. Razorpay Configuration
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "vibecart",
        description: "Order payment",
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#ff5252",
        },
        // 4. Success Handler
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              verificationData,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              },
            );

            if (verifyRes.data.success) {
              toast.success("✔ Payment Successful!");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("❌ Payment verification failed");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Error during payment verification");
          }
        },
        modal: {
          ondismiss: async function () {
           
            try {
              await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                {
                  razorpay_order_id: data.order.id,
                  paymentFailed: true,
                },
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                },
              );
            } catch (err) {
              console.error("Failed to update status to Failed", err);
            }
            toast.error("Payment window closed");
          },
        },
      };

      // 5. Initialize and Open
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function (response) {
       
        try {
          await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
            {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
        } catch (err) {
          console.error("Error updating failed payment status", err);
        }
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error("Order Creation Error:", error);
      toast.error("Unable to process payment at this time");
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid place-items-center p-10">
      <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
        <div className="space-y-4 p-6 bg-white">
          {showFrom ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 1234567891"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 street"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="ex-agra"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="ex-uttar pradesh"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zipcode</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="309889"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="ex-india"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Address</h2>
              {addresses.map((addr, index) => {
                return (
                  <div
                    onClick={() => dispatch(setSelectedAddress(index))}
                    key={index}
                    className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-[#ff5252] bg-[#f9d8d8]" : "border-gray-300"}`}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p>{addr.phone}</p>
                    <p>{addr.email}</p>
                    <p>
                      {addr.address},{addr.city},{addr.state},{addr.zip},
                      {addr.country}
                    </p>
                    <button
                      onClick={(e) => dispatch(deleteAddress(index))}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </Button>
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full bg-[#ff5252]"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
        <div>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className="text-sm text-muted-foreground pt-4">
                <p>* Free shipping on orders over 299</p>
                <p>* 30-days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
