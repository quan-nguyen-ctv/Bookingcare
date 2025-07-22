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
import AddBooking from "./components/admin/bookings/AddBooking";
import AdminDashboard from "./components/admin/AdminDashboard";

import ListBookings from "./components/admin/bookings/ListBookings";
import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import PatientBookingList from "./components/doctor/patient/PatientBookingList";
import ProfileUpdate from "./components/ProfileUpdate";
import ProfileView from "./components/ProfileView";
import AdminLogin from "./components/AdminLogin";
import PaymentPage from "./components/PaymentPage";
import DetailSpecialty from "./components/admin/specialties/DetailSpecialty";
import DetailDoctor from "./components/admin/doctors/DetailDoctor";
import DoctorDetail from "./components/DoctorDetail";
import SpecialtyDetail from "./components/SpecialtyDetail";
import ListClinic from "./components/admin/clinics/ListClinic";
import AddClinic from "./components/admin/clinics/AddClinic";
import MedicalServiceDetail from "./components/MedicalServiceDetail";
import BookingDetail from "./components/BookingDetail";


function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDoctorRoute = location.pathname.startsWith("/doctor");


  return (
    <>
      {!isAdminRoute && !isDoctorRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/medical-services" element={<MedicalServices />} />
        <Route path="/MedicalServices/:idNameSpecialty" element={<MedicalServiceDetail />} />
        <Route path="/list-doctor" element={<Doctors />} />
         <Route path="/Doctors-detail/:id" element={<DoctorDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/list-booking" element={<ListBooking />} />
        <Route path="/account/bookings/:id" element={<BookingDetail />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/profile/update" element={<ProfileUpdate />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="specialties/add" element={<AddSpecialty />} />
          <Route path="specialties/list" element={<ListSpecialty />} />
          <Route path="specialties/:id" element={<DetailSpecialty />} /> 
          <Route path="doctors/add" element={<AddDoctor />} />
          <Route path="doctors/list" element={<ListDoctor />} />
          <Route path="doctors/:id" element={<DetailDoctor />} />
          <Route path="clinics/list" element={<ListClinic />} />
<Route path="clinics/add" element={<AddClinic />} />
            
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/list" element={<ListUser />} />
          <Route path="bookings/list" element={<ListBookings />} />
          <Route path="bookings/add" element={<AddBooking />} />

          
          {/* Các route con khác */}
        </Route>
          <Route path="/doctor/*" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientBookingList />} />


          
          {/* Các route con khác */}
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
      {!isAdminRoute && !isDoctorRoute && <Footer />}
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
