import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import FirstLayout from "../FirstLayout/FirstLayout";
import SecondLayout from "../SecondLayout/SecondLayout";
import ThirdLayout from "../Third/ThirdLayout";
import FourthLayout from "../Fouth/FourthLayout";
import Migration from "../Migration";
import First from "../first";


const Navigation = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FirstLayout />} />
        <Route path="/second" element={<SecondLayout />} />
        <Route path="/third" element={<ThirdLayout />} />
        <Route path="/fourth" element={<FourthLayout />} />
        <Route path="/migration" element={<Migration />} />
        <Route path="/first" element={<First />} />
      </Routes>
    </div>
  );
};

export default Navigation;
