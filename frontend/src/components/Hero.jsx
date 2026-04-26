import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="bg-white  py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#ff5252]">
              Latest Electronics at Best Prices
            </h1>
            <p className="text-xl mb-6 text-[#f89a9a]">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptops and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline"
              className="bg-[#ff5252] text-amber-50 hover:bg-[#ff5252]/80 cursor-pointer">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="bg-[#ff5252] text-amber-50 hover:bg-[#ff5252]/80 cursor-pointer"
              >
                View Deals
              </Button>
            </div>
          </div>
          <div className="relative mt-10">
            <img src="main_img.png" alt="" width={500} height={400} className="rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
