import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css'
import Header from './components/Header'
import HomePage from './components/HomePage'
import About from './components/About';
import Footer from "./components/Footer";
import MedicalServices from './components/MedicalServices';
import Doctors from './components/Doctors';
import Contact from './components/Contact';
import Blog from './components/Blog';
import Login from './components/Login';
import Register from './components/Register';
import BookingPage from "./components/BookingPage";
import { BookingProvider } from "./components/BookingContext";
import ListBooking from "./components/ListBooking";
import BookingSuccess from "./components/BookingSuccess";
import AdminLayout from "./components/admin/AdminLayout";
import AddSpecialty from "./components/admin/specialties/AddSpecialty";
import ListSpecialty from "./components/admin/specialties/ListSpecialty";
import ListDoctor from "./components/admin/doctors/ListDoctor";
import AddDoctor from "./components/admin/doctors/AddDoctor";
import AddUser from "./components/admin/user/AddUser";
import ListUser from "./components/admin/user/ListUser";


function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/medical-services" element={<MedicalServices />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/list-booking" element={<ListBooking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="specialties/add" element={<AddSpecialty />} />
          <Route path="specialties/list" element={<ListSpecialty />} />
          <Route path="doctors/add" element={<AddDoctor />} />
          <Route path="doctors/list" element={<ListDoctor />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/list" element={<ListUser />} />
          
          {/* Các route con khác */}
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BookingProvider>
      <Router>
        <AppContent />
      </Router>
    </BookingProvider>
  );
}

export default App;
