import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { Routes, Route, Link } from "react-router-dom";
import FirstLayout from "./components/FirstLayout/FirstLayout";
import SecondLayout from "./components/SecondLayout/SecondLayout";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div>
      {/* <Routes>
        <Route path="/fisrt" element={<FirstLayout />} />
        <Route path="/second" element={<SecondLayout />} />
      </Routes> */}
      <Navigation />
    </div>
  );
}

export default App;
