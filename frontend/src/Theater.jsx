import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import EastIcon from '@mui/icons-material/East';
import "./Theater.css"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function Theater(){
    const [cityName, setCityName] = useState("Mumbai");
    const [theaterList, setTheaterList] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const {movie}  = location.state || {};
    const movieTitle = movie?.Title || "Movie details not available"
    const times = ["5:00 AM","9:00 AM","12:00 PM","4:00 PM","8:00 PM",]
    
    useEffect(()=>{
        if(!movie){
            navigate("/", {state: {error: "Something went wrong. Please try again."}});
        }
    }, [movie, navigate]);

    if(!movie){
        return null;
    }

    const getTheaterList = async() =>{
        const city =  cityName;
        try{
            const response = await fetch(`${backendUrl}/theaters?city=${encodeURIComponent(city)}`);
            const data = await response.json();
            
            console.log(data.theaters.results);
            setTheaterList(data.theaters.results);
        }catch(err){
            console.error(err); 
        }
    }

    const onChange = (event) =>{
        setCityName(event.target.value)
    }

    const onSubmit = (event) =>{
        event.preventDefault();
        getTheaterList();
       
    };

    const getDates = () =>{
        const today = new Date(); 
        const dates = [] ;

        for(let i = 1; i<=7; i++){
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);

        const day = futureDate.getDate();
        const month = futureDate.getMonth() + 1;
        const year = futureDate.getFullYear();

        const formattedDate = {
            day:day,
            month:month,
            year:year
        };
        
        dates.push(formattedDate);
        }
        console.log(dates);
        setDates(dates);

    }


    const getDefaultTheaters = async() =>{
        try{
            const response = await fetch(`${backendUrl}/theaters/default`);
            const data = await response.json();
            setTheaterList(data)
            
            console.log(data);
        }catch(err){
            console.error(err); 
        }
    }

    const addDate = () =>{
        const date = dates[selectedIndex]
        setSelectedDate(date)
    }
    
    useEffect(()=>{
      addDate();
    }, [selectedIndex, []]);

    useEffect(()=>{
        getDefaultTheaters();
        getDates();
    }, []);

    const handelButtonClick = (index) =>{
        setSelectedIndex(index);
    }

    const sendTicketInfo = (time,theater) =>{
        navigate("/booking", {state:{movie:movie, time:time , date:selectedDate, theater:theater}})

    }


    return(
        <div className="Theater">
            <div className="citySearch">
                <input type="text" value={cityName} onChange={onChange} placeholder="Enter City Name"></input>
                  <Button onClick={onSubmit} variant="contained" size="small" sx={{fontSize:15,textTransform: "none"}}>Search</Button>
            </div>
            <div className="city">
               <p style={{fontSize:21}}><b>{movieTitle}</b></p>
                <p style={{fontSize:19}}><b>City <EastIcon/> {cityName.toLocaleUpperCase()}</b></p>
            </div>
            

           <div className="datesdiv">
            <span>Date <EastIcon/></span>
             {dates.map((date, index)=>(
                 <button key={index}  className={selectedIndex === index ? "clicked" : "dateBtn" } onClick={() => setSelectedIndex(index)}>{date.day} / {date.month}</button> 
            ))}
          </div>

            <div className="theaterListdiv">
                {theaterList.map((theater)=>(
                    <div className="theaterList">
                        <div className="theaterName">
                        <p><b># {theater.name}</b><br></br>
                        <i>{theater.location.address}</i><br></br>
                      </p>
                        </div>
                        <div className="showTime"> 
                            {times.map((time)=>(
                                <Button  variant="text" size="small"
                                 sx={{fontWeight:"550", color:"blue",boxShadow: "0 0 2px 1px blue",
                                    "&:hover":{
                                        backgroundColor:"rgba(0, 0, 255, 0.1)",
                                        boxShadow: "0 0 4px 2px blue",
                                        color: "darkblue",

                                    }
                                  }} onClick={()=>sendTicketInfo(time,theater)}>{time}</Button>
                            ))}

                        </div>
                    </div> 
                ))}
            </div>

            

        </div>
    )
}