import Card from '@mui/material/Card';

import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import "./MovieCards.css"
import { useNavigate, useLocation } from 'react-router-dom';

export default function MovieCards(){
    const [ movieData, setMovieData] = useState([]);
    const [loading,setLoading] = useState(true);
    const Navigate = useNavigate();
    const location = useLocation();
    const error =location.state?.error;
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchMovies = async()=>{
      try{
        setLoading(true);
        const response = await fetch(`${backendUrl}/movies`);
        const data = await response.json();
        setMovieData(data);
        setLoading(false);
      }catch(error){
        console.log("Error fetching movie data:", error);
        setLoading(false);
      }
    };

    useEffect(()=>{
      fetchMovies();
    }, []);

    return(
        <div>
           {error && <div className='error'>
            <Alert severity="warning" onClose={() => Navigate("/", {state:{}})}>
                {error}
            </Alert>    
            </div>}
            <div className='movie-container'>
              {loading? (<CircularProgress className='loading' />):(
            movieData.map((data)=>(
                  <div className='movie' >
                    <Button className='movieBtn' onClick={()=>Navigate("/movie", { state: { movie: data } })} >
                    <Card  className='Card'>
                      <CardMedia
                        component="img"
                        alt="green iguana"
                        className='CardMedia'
                           image={data.Poster}
                         />
                 </Card>   
                 <span className="tooltip">{data.Title}</span>

                 </Button>
                
                 </div>  
                       

                ))
            )}
         
              </div>
            
             

        </div>
    )
}