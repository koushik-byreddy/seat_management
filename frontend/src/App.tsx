import Login from "./Login";
import Home from "./Home";
import Library from "./Library";
import Classroom from "./Classroom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
