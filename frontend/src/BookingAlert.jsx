
import Alert from '@mui/material/Alert';
import "./BookingAlert.css"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



export default function BookingAlert(){
    const location = useLocation();
    const selectedSeats = location.state?.seats || []; 
    const {movie,date,time,theater, seatPrice,totalFoodPrice} = location.state || {}; 
    const [email, setEmail] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();


    useEffect(()=>{
      if(!movie || !date){
          navigate("/", {state: {error: "Something went wrong. Please try again."}});
      }
  }, [movie, navigate]);

  if(!movie || !date){
      return null;
  }
    

    const fetchProfile = async()=>{
      try{
      const response = await fetch(`${backendUrl}/profile`,{
        credentials: "include",
      });
      if(response.ok){
        const profile = await response.json();
        setEmail(profile?.user?.email);
        console.log("user:",profile);
      }else{
        console.log("Not authenticated");
      }  
      }catch(error){
      console.log("Error fetching food data:", error);  
       }
     };

     const bookAndSendEmail = async() =>{
      try{
        const response = await fetch(`${backendUrl}/send-booking-email`,{
          method:'POST',
          headers:{
            'content-Type': 'application/json',
          },
          body:JSON.stringify({
            email,
            movie,
            date,
            time,
            theater,
            seats:selectedSeats,
            seatPrice,
            totalFoodPrice,
          }),
       
        });

        const data = await response.json();

        if(response.ok){
          console.log('Email sent succefully');
        }else{
          console.log('Failed to send email')
        }
      }catch(err){
        console.log(err);
      }
     }

     useEffect(()=>{
      fetchProfile();
     }, []);


     useEffect(()=>{
      if(email){
        bookAndSendEmail();
      }
     }, [email]);
     

    return(
        <div className='BookingAlert'>

            <div className='alert'>
            <Alert severity="success" sx={{ maxWidth: 250, textAlign:'center',backgroundColor:" #e7e5c0", justifyContent:'center', boxShadow:"0 0 3px 0.5px black"}}>Your tickets are booked!</Alert>
           </div>

            <div className='summaryCard'>
            <Card className='Card'>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{display:"flex", justifyContent:"center"}}>
                    <b> Summary</b>
                   </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' , fontWeight:"550", borderTop:"1.34px dotted black" }}>
                    <div className='summaryInfo'>

                        <div>
                        Movie Name :<br></br>
                        Date : <br></br>
                        Time : <br></br> 
                        Theater :<br></br>
                        Tickets :<br></br>
                        Ticket_Price :<br></br>
                        Convenience fees :<br></br>
                        Food & Beverages :<br></br>
                        Total :
                        </div>

                        <div>
                        {movie.Title} <br></br>
                        {`${date.day}/${date.month}/${date.year}`}<br></br>
                        {time}<br></br>
                        {theater.name}<br></br>
                        {selectedSeats.join(', ')}<br></br>
                        Rs.{seatPrice}<br></br>
                        Rs.45<br></br>
                        Rs.{totalFoodPrice}<br></br>
                        Rs.{seatPrice + 45 + totalFoodPrice}


                        </div>
                    </div>
                  </Typography>
                 </CardContent>
              </CardActionArea>
            </Card>
            </div>
            </div>
                 
   
    )
}