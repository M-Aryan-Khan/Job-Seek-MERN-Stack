import React from "react";
import google from "../../assests/google.png"
import meta from "../../assests/meta.png"
import amazon from "../../assests/amazon.png"
import nvidia from "../../assests/nvidia.png"
import microsoft from "../../assests/microsoft.png"

export default function Companies() {
  return (
    <div className="flex justify-center items-center mt-20 ">
      <div className=" bg-[#dee0e2] h-20 w-[75%] self-center flex justify-between items-center px-4 shadow-2xl">
        <img src={google} alt="" className="h-10"/>
        <img src={meta} alt="" className="h-8"/>
        <img src={amazon} alt="" className="h-10 mt-3"/>
        <img src={nvidia} alt="" className="h-10"/>
        <img src={microsoft} alt="" className="h-10"/>
      </div>
    </div>
  );
}
