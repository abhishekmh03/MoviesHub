import TicketBooking from './TicketBooking';
import MovieCards from './MovieCards';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookingAlert from './BookingAlert';
import MovieInfo from './MovieInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Layout from './Layout';
import AddFood from './AddFood';
import Login from './Login';
import Dashboard from './Dashboard';
import Theater from './Theater';
import NotFound from './NotFound';

function App() {
  return (
   
    <Router>
      <Routes>
      <Route path="/" element={<Layout />}>
                    <Route index element={<MovieCards />} />
                    <Route path="booking" element={<TicketBooking />} />
                    <Route path="movie" element={<MovieInfo />} />
                    <Route path="alert" element={<BookingAlert />} />
                    <Route path="addfood" element={<AddFood />} />
                    <Route path="login" element={<Login />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="theaterlist" element={<Theater />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
      </Routes>
    </Router>
  );
}

export default App;
