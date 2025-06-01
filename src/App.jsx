import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import './App.css'
import Header from './components/Header' // Thêm dòng này
import HomePage from './components/HomePage'
import About from './components/About';
import Footer from "./components/Footer";
import MedicalServices from './components/MedicalServices';
import Doctors from './components/Doctors';
import Contact from './components/Contact';
import Blog from './components/Blog';
import Login from './components/Login';
import Register from './components/Register';

function App() {


  return (
    <>
      <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/medical-services" element={<MedicalServices />} />
        <Route path="/doctors" element={<Doctors />} />
         <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

       <Footer />
    </Router>
     
    </>
  )
}

export default App
