import { useLocation } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./MovieInfo.css"
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";


export default function MovieInfo(){
    const location = useLocation();
    const{movie} = location.state || {};
    const navigate = useNavigate();

    useEffect(()=>{
        if(!movie){
            navigate("/", {state: {error: "Something went wrong. Please try again."}});
        }
    }, [movie, navigate]);

    if(!movie){
        return null;
    }

    return(
        <div className="movieInfoContent">
            <div className="movie" >
            <Card  className="movieCard">
                <div>
                <CardMedia
                        className="img"
                        component="img"
                        alt="green iguana"
                           image={movie.Poster}
                         />
                </div>
                  <div>
                      
                     <CardContent>
                         <Typography gutterBottom variant="h5" component="div" className="name">
                           { movie.Title}
                        </Typography>
                       <Typography variant="body2" sx={{ color: 'text.secondary', padding:1}}>
                           <div>
                            <p className="movieinfo">Year:- {movie.Year}</p>
                            <p className="movieinfo">Actors:- {movie.Actors}</p>
                            <p className="movieinfo">Director:- {movie.Director}</p>
                            <p className="movieinfo">Language:- {movie.Language}</p>
                            <p className="movieinfo">Plot:- {movie.Plot}</p>
                           </div>
                       </Typography>
                     </CardContent>
                     <CardActions className="btn">
                        <Button size="small" variant="contained" onClick={()=>navigate("/theaterlist", { state: { movie: movie } })}>Book Ticket</Button>
                    </CardActions>
                    </div>
                 </Card>  
            </div>
        </div>
    )
}