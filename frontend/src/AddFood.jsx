import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import "./AddFood.css";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import Badge from '@mui/material/Badge';
import { private_excludeVariablesFromRoot } from '@mui/material';

export default function AddFood(){
    const location = useLocation();
    const [demo , setdemo] = useState([{name:"Regular Tub Salted Popcor", info:"Regular Tub Salted Popcorn (90g | 281 Kcal)", price:330, i:"https://in.bmscdn.com/fnb/v3/xxhdpi/2000095_09072021113304.png"},{name:"Regular Tub Salted Popcor", info:"Jalapeno Nachos With Cheese & Salsa", price:340, i:"https://in.bmscdn.com/fnb/v3/xxhdpi/1020006_06082018135441.png"}]);
    const [foodData, setFoodData] = useState([]);
    const selectedSeats = location.state?.seats || [];
    const {movie,time,date,theater} = location.state || {};
    const seatPrice = location.state?.price || 0; 
    const Navigate = useNavigate();
    const buttonCategory = ["ALL","POPCORN","SNACKS","COMBOS","BEVERAGES"];
    const [activeCategory, setActiveCategory] = useState(buttonCategory[0]);
    const [foodOrder,setFoodOrder]= useState([]);
    const [totalFoodPrice,setTotalFoodPrice] = useState(0);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;



    
    useEffect(()=>{
      if(!movie || !date){
          Navigate("/", {state: {error: "Something went wrong. Please try again."}});
      }
  }, [movie, Navigate]);

  if(!movie || !date){
      return null;
  }
      
    //All food list
    const fetchFood = async()=>{
      try{
        const response = await fetch(`${backendUrl}/food/all`);
        const data = await response.json();
        setFoodData(data);
        console.log(data);
      }catch(error){
        console.log("Error fetching food data:", error);
      }
    };

    //Category Food list
    const categoryFood = async(category) =>{
      setFoodData([]);
      try{
        const response = await fetch(`${backendUrl}/food/${category.toLowerCase()}`);
        const data = await response.json();
        setFoodData(data);
        console.log(data);
      }catch(error){
        console.log("Error fetching food data:", error);
      }
    };

    //add food
    const addFood = async(name,price) => {
      setFoodOrder(prevOrder =>{
        const existingOrder = prevOrder.find(order => order.orderName === name);
        if(existingOrder){
          return prevOrder.map(order =>
            order.orderName === name
            ? 
            {...order, orderQuantity:order.orderQuantity + 1} : order
          );
        }else{
          return [...prevOrder, {orderName:name, orderPrice:price, orderQuantity:1}];
        }

      })

      console.log(foodOrder);
     
    }

    //remove food
    const removeFood = (name,price) => {
      const target = {orderName:name , orderPrice:price}; 
      const index = foodOrder.findIndex(
        (order) => order.orderName === target.orderName && order.orderPrice === target.orderPrice
      );
      
      if(index !== -1){
        const updatedOrder = [...foodOrder];
        if(updatedOrder[index].orderQuantity > 1){
          updatedOrder[index].orderQuantity -= 1;
        }else{
          updatedOrder.splice(index,1);
        }
        
        setFoodOrder(updatedOrder);
      };
    };

    const calculateTotalFoodPrice = () =>{
      let total = 0;
      foodOrder.forEach((order)=>{
       total += order.orderQuantity*order.orderPrice;
      })
      setTotalFoodPrice(total);
      console.log(total);
    }

    const handelProceed = async()=>{
      try{
        const response = await fetch(`${backendUrl}/proceed`, {
          method:'GET',
          credentials:'include',
        });

        if(response.status === 401){
          const errorData = await response.json();
          alert(errorData.message);
          Navigate('/login');
          return;
        }

        if(response.ok){
          const data = await response.json();
          Navigate('/alert',{state:{seats: selectedSeats,movie:movie,time:time,date:date,theater:theater,seatPrice:seatPrice,totalFoodPrice:totalFoodPrice}});
        }else{
          throw new Error("something went wrong . please try again")
        }
      }catch(err){
        console.log(err);
        alert("An alert occurred. please try again later.")
      }
    };

    useEffect(()=>{
      calculateTotalFoodPrice();
    }, [foodOrder])
    

    useEffect(()=>{
      fetchFood();
    }, []);

    return(
        <div className='AddFood'>
            <div className='food-container'>
              <div className='foodNav'>
              <h5>Grab a bite!</h5>
              <p>Prebook Your Meal and Save More!</p>
              <div className='foodbtn'>

                {buttonCategory.map((category)=>(
                  <button  key={category} onClick={()=>{categoryFood(category); setActiveCategory(category)}} className={activeCategory === category ? "active-btn" : ""}>{category}</button>
                ))}
                

              </div>
              </div>

              <div className='foodCards'>
                {foodData.map((data)=>(
                  <Card className='foodcard'>
                    <div className='wholecard'>
                    <div>
                  <CardMedia
                    className='foodCardMedia'
                    image={data.image}
                    title={data.name}
                  />
                  </div>
                  
                  <div className='cardContent'>
                  <CardContent>
                    <Typography gutterBottom variant="p" component="div" sx={{ color: 'black', fontWeight:550 }}>
                    {data.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {data.info}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'black' ,fontWeight:550 }}>
                    <div className='foodAddbtn'>

                      <div> Rs.{data.price}</div>

                      <div> 
                        <Button variant='contained' size='small' sx={{ textTransform: 'none'}} onClick={()=>addFood(data.name,data.price)} className={foodOrder.map((order)=>order.orderName === data.name ? "hide" : "")}>Add</Button>
                        
                        <div className={foodOrder.some(order => order.orderName === data.name) ? "" : "hide"}>
                      <IconButton aria-label="remove"  size='small' sx={{ color: 'black' }} onClick={()=>removeFood(data.name,data.price)}>
                            <RemoveIcon  fontSize='small'  />
                      </IconButton>
                      <span>{foodOrder.find(order => order.orderName === data.name)?.orderQuantity || 1}</span>
                      <IconButton aria-label="add" size='small' sx={{ color: 'black' }} onClick={()=>addFood(data.name,data.price)}>
                            <AddIcon fontSize='small'/>
                      </IconButton>  
                      </div>                 
                      </div>

                    </div>
                    </Typography>
                  </CardContent>
                  </div>
                  </div>
              
                </Card>

                ))

                }
              </div>

            </div>


            <div className='price-container'>
            <Card className='priceCard'>
             <CardContent>
                 <Typography gutterBottom variant="p" component="div" className='priceHeading'>
                 Booking Summary <br></br>
                 <i>Movie : {movie.Title}</i>
                 </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <div className='priceDistribution1'>
                    <div className='priceName'>
                    {selectedSeats.join(', ')} <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{ ${selectedSeats.length} Tickets }`} <br></br>
                    Convenience fees : <br></br>                
                    </div>
                    <div className='priceValue'>
                    Rs. {seatPrice} <br></br><br></br>
                    Rs. 45.00 <br></br>           
                    </div>
                  </div>
                  
                  <hr></hr>

                  <div className='priceDistribution1'>
                    <div className='priceName'>
                   # Sub Total :               
                    </div>
                    <div className='priceValue'>
                    Rs.{seatPrice + 45}            
                    </div>
                  </div>
                  <hr></hr>
                  {totalFoodPrice !== 0 &&                  
                  <div className='priceDistribution2'>
                    
                    <p># Added Food -</p>
                    {foodOrder.map((order)=>(
                      <div className='foodOrderList'>
                        <Badge badgeContent={order.orderQuantity > 1 ? order.orderQuantity : null} color="dark" sx={{fontWeight:520}}>
                        <p>- {order.orderName}</p>
                        </Badge>
                       
                        <p>Rs.{order.orderPrice*order.orderQuantity}</p>
                        </div>
                    ))}

                     <hr></hr>
                    <div className='priceDistribution1'>
                    <div className='priceName'>
                    # Food & Beverage  :                
                    </div>
                    <div className='priceValue'>
                    Rs.{totalFoodPrice}            
                    </div>
                  </div>
                    <hr></hr>
                    
                  </div>}
                  <div className='totalbtndiv' >
                     <button onClick={handelProceed} className=' btn btn-primary totalbtn'>Total : Rs.{seatPrice + 45 + totalFoodPrice}   &nbsp;&nbsp;&nbsp;&nbsp; &nbsp; Proceed</button>
                  </div>
                </Typography>
            </CardContent>
          </Card>
            
            </div>

        </div>
    )
}