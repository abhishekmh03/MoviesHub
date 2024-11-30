import "./Dashboard.css"
import { Button } from "@mui/material"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import IconButton from '@mui/material/IconButton';

export default function Dashboard(){
    const Navigate = useNavigate();
    const location = useLocation();
    const {userProfile} = location.state || {};
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const email = userProfile?.user?.email;
    const [history,setHistory] = useState();
    const [openDetails, setOpenDetails] = useState(null);
    const [activeButton, setActiveButton] = useState("History");

    const handleButtonClick = (buttonName) =>{
        setActiveButton(buttonName);
    };

    const toggleDetails = (index) =>{
        setOpenDetails(openDetails === index ? null: index);
    }

    const fetchHistory = async()=>{
        try{
        const response = await fetch(`${backendUrl}/user/history?email=${encodeURIComponent(email)}`);
         if(!response.ok){
            throw new Error("Failed to fetch history");
         }

        const data = await response.json();
        setHistory(data);
        console.log(data);
        }catch(err){
        console.error("Error fetching history:", err);
       }
     }

     useEffect(()=>{
        fetchHistory();
     }, []);

    useEffect(()=>{
        console.log(userProfile);
    })


    const logout = ( ) =>{
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        
        console.log("Backend URL:", backendUrl);
        window.location.href = `${backendUrl}/logout`;
    }
    return(
        <div className="Dashboard ">         
                <div className="dashboardOptions ">
                    <div className="userProfile">
                    <img src={userProfile?.user?.profilePicture} className="dashboardImg"></img>
                    <p>{userProfile?.user?.email}</p>
                    </div>
                    <hr></hr>
                    <Button
                    className={`dashboardButton ${activeButton === "History"? "active" : ""}`}
                    onClick={()=> handleButtonClick("History")}
                    >History</Button>
                    <hr></hr>
                    <Button
                     className={`dashboardButton ${activeButton === "Coupons"? "active" : ""}`}
                     onClick={()=> handleButtonClick("Coupons")}
                     >Coupons</Button>
                    <hr></hr>
                    <Button className="dashboardButton" sx={{color:"red"}} onClick={logout}>Logout</Button>
                </div>

                <div className="dashboardData ">
                    {activeButton === "History" &&(
                    <>
                    {history && history.length > 0 ? (
                        history.map((h, index)=>(
                            <div key={index} className="data">
                                <div className="summary " onClick={()=> toggleDetails(index)}>
                                   
                                    <div className="col-4">
                                 <p>Movie : {h.movie.Title}</p>
                                 <p>Theater : {h.theater.name}</p>   
                                 </div>

                                 <div className="col-4">
                                    <p>Date: {`${h.date.day}/${h.date.month}/${h.date.year}`} </p>
                                 <p>Total Price : Rs.{h.totalAmount}</p>
                                 </div>

                                 <div className="col-4">
                                 <IconButton aria-label="DropDown">
                                     {openDetails === index ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/> }
                                 </IconButton>
                                 </div>

                                 </div>
                                 {openDetails === index && (
                                    <div className="details">
                                    
                                    <div>
                                        <p>
                                        Movie Name : {h.movie.Title} <br></br>
                                        Theater : {h.theater.name}<br></br>
                                        Ticket : Qt.{h.seats.length}
                                        
                                        </p>
                                    </div>

                                    <div>
                                        <p>
                                        Date :   {`${h.date.day}/${h.date.month}/${h.date.year}`}<br></br>
                                        Time :  {h.time}<br></br>
                                        Ticket Price : Rs.{h.seatPrice}

                                        </p>
                                    </div>

                                    <div>
                                        <p>        
                                       Convenience fees : Rs.45<br></br>
                                       Food & Beverages : Rs.{h.totalFoodPrice}<br></br>
                                       Total :  Rs.{h.totalAmount}

                                        </p>
                                        </div>

                                    </div>
                                 )}
                            </div>
                    )) 
                    ):(
                        <div className="noData">
                            <p>No Data Available</p>
                        </div>
                        
                    )}
                    </>
                    )}
                    {activeButton === "Coupons" && 
                    <div className="noData"><p>No Data Available</p></div>}
                </div>
        </div>
    )
}