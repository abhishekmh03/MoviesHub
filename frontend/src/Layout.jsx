import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Layout.css"

export default function Layout(){
    return(
        <div className="app-container">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
};