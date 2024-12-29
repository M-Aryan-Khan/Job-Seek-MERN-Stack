import React, { useRef } from "react";
import NavBar from "./NavBar";
import Front from "./Front";
import Companies from "./Companies";
import Category from "./Category";
import Requirements from "./Requirements";
import ClientReviews from "./ClientReviews";
import Footer from "./Footer";

export default function Home() {
  // Create refs for the components you want to scroll to
  const frontRef = useRef(null);
  const categoryRef = useRef(null);
  const reviewsRef = useRef(null);

  return (
    <div className="bg-[#d6d7dd]">
      {/* Pass the refs to the NavBar for scrolling */}
      <NavBar frontRef={frontRef} categoryRef={categoryRef} reviewsRef={reviewsRef} />
      <div ref={frontRef}>
        <Front />
      </div>
      <Companies />
      <div ref={categoryRef}>
        <Category />
      </div>
      <Requirements />
      <div ref={reviewsRef}>
        <ClientReviews />
      </div>
      <Footer/>
    </div>
  );
}
