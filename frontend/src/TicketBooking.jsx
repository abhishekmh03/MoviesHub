import { useState, useEffect } from 'react';
import "./TicketBooking.css"
import { useNavigate , useLocation} from 'react-router-dom'; 



export default function TicketBooking() {
   const [arr,setArr] = useState(Array.from({ length: 15 }, () => Array.from({ length: 20 }, (_, i) => i + 1)));
   const[seatData, setSeatData]= useState({row: null, seat:null})
   const [selectedSeats, setSelectedSeats]= useState([]);
   const [totalPrice, setTotalPrice] = useState(0);
   const navigate = useNavigate();
   const location = useLocation();
   const {movie,time,date,theater}  = location.state || {};


   useEffect(()=>{
    if(!movie){
        navigate("/", {state: {error: "Something went wrong. Please try again."}});
    }
    }, [movie, navigate]);

    if(!movie){
    return null;
      }
  


   let onClick = (row,seat) =>{
    const seatIdentifier = `${row+1}${seat}`;

    if(selectedSeats.includes(seatIdentifier)){
      setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seatIdentifier));
      setTotalPrice(totalPrice - (
        row === 13 || row === 14 ? 350:
        row >= 8 && row <= 12 ? 300:
        row >= 0 && row <= 7 ? 250: 
        200));
    }else{
      if(selectedSeats.length >= 5){
        alert("You can only book 5 tickets");
      }else{
        setSelectedSeats([...selectedSeats, seatIdentifier]);
        setTotalPrice(totalPrice + (
          row === 13 || row === 14 ? 350:
          row >= 8 && row <= 12 ? 300:
          row >= 0 && row <= 7 ? 250: 
          200));


      }
      
    }
    

    setSeatData({row:row, seat:seat})

    if(seatData.row === row && seatData.seat === seat){
      setSeatData({row:null, seat:null});
    }else{
      setSeatData({row:row, seat:seat});
    }
   
   }

   let bookTicket = ()=> {
    console.log(selectedSeats);
    if(selectedSeats.length === 0){
      alert("Please select seat")
    }else{
      navigate("/addfood", {state:{seats: selectedSeats, price:totalPrice, movie:movie,time:time,date:date,theater:theater}});
    }
      
      setSeatData({row:null, seat:null})
      setSelectedSeats([]);
   };
   const getSeatClass = (row,seat) =>{
    let seatClass = "economy"
    if(seat === 5 || seat === 17) return 'sideSeat';
    if(row === 8 ) return 'vipSeat';
    if(row === 13) return 'vvipSeat';
    return 'economySeats';
   }

  return (
    <div className='ticketBooking'>
      <div className='seatType'>
        <div className='normalType'>
        <p className='t'>Executive <br></br> Rs.250</p>
        </div>
        <div className='vipType'>
        <p className='t'>Club <br></br> Rs.300</p>
        </div>
        <div className='vvipType'>
          <p className='t'>Royale <br></br> Rs.350</p>
        </div>

      </div>

      <div className='div1'>
    
    <div className='screen'>Screen</div>
    {arr.map((rowData, row)=>{
      return <div key={row}>
      {  rowData.map((seat)=>{
            const seatIdentifier = `${row+1}${seat}`;

      return  <button   key={seat} onClick={() => onClick(row,seat)} className={`generalBtn ${getSeatClass(row,seat)} ${selectedSeats.includes(seatIdentifier) ? 'clicked':'noCLicked'}`}>{seat}</button>
      })}
      </div>
    })}
    {selectedSeats.length > 0 && (
             <p className='price'>Price = {totalPrice}</p>
    )}   
    <button onClick={bookTicket} className='bookBtn'>Book Now!</button>

    <br></br>

    </div>
          
    </div>
  )
}


