import "./Navbar.css"
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar(){
  const URL = "https://www.omdbapi.com/?apikey=1dcd8ae2&t=";
  const [ searchedMovieData, setSearchedMovieData] = useState(null);
  const Navigate = useNavigate();
  const [movieName, setMovieName] = useState("");
  const [movieNotFound, setMovieNotFound] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState()
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const fetchProfile = async()=>{
    try{
    const response = await fetch(`${backendUrl}/profile`,{
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.ok){
      const profile = await response.json();
      setUserProfile(profile);
      console.log("user:",profile);
    }else{
      console.log("Not authenticated");
      setUserLoggedIn(false);
    }  
    }catch(error){
    console.log("Error fetching food data:", error);  
    setUserLoggedIn(false);
     }
   };

   useEffect(()=>{
    if(userLoggedIn){
      fetchProfile();
    }
  },[userLoggedIn]);


  const onChange = (event) =>{
        setMovieName(event.target.value);
  };

  const getMovieData = async()=>{
    if(!movieName) return;
    try{
      const response = await fetch(`${URL}${movieName}`);
      if(!response.ok){
        throw new Error('Network response is not ok');
      }
      const jsonResponse = await response.json();
      if(jsonResponse.Response === "False"){
        setMovieNotFound(true);
        setSearchedMovieData(null);
      }else{
        setSearchedMovieData(jsonResponse);
        setMovieNotFound(false);
      }
    } catch(error){
      console.error('Error fetching movie data:', error);
    };
  };
    
    const NavLogin = ()=>{
      Navigate("/login");

    }
    const NavDashboard = ()=>{
      Navigate("/dashboard", {state: {userProfile:userProfile}});

    }

  const onSubmit = async(event) =>{
    event.preventDefault();
   await getMovieData();
   setMovieName("");
  };

  useEffect(()=>{
    const checkUserStatus = async()=>{
      const response = await fetch(`${backendUrl}/profile`,{
        credentials:"include",
        
      });
      if(response.ok){
        setUserLoggedIn(true);
      }else{
        setUserLoggedIn(false)
      }
    };
    checkUserStatus();
  }, []);

  useEffect(() => {
    if (searchedMovieData) {
      Navigate("/movie", { state: { movie: searchedMovieData } });
    }else if(movieNotFound){
      alert('Movie not found')
    }
  }, [searchedMovieData,movieNotFound]);

  

    return(
        <div>

<nav className="navbar navbar-expand-xxl ">
  <div className="container-fluid">
    <div>
    <a className="navbar-brand " href="/">MoviesHub</a>
    </div>

    <div className="search">
         <input type="text"  value={movieName} placeholder="Search a Movie" onChange={onChange} className="searchInput"/>
         <Button variant="contained" onClick={onSubmit} size="medium" className="searchBtn" >
         <SearchIcon />
      </Button>
     
    </div>

    <div>
    {userProfile === undefined ?(
          <button onClick={NavLogin} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">

      <span className="navbar-toggler-icon" ></span>
      </button>
    ):(
      <button onClick={NavDashboard} className="navbar-toggler imgNavbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">

      <img src={userProfile?.user?.profilePicture} className="navImg"></img>
      </button>
    )}
   
    </div>
  </div>
</nav>

        </div>
    )
}