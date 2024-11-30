import "./Login.css"
import { Button } from "@mui/material"
import GoogleIcon from '@mui/icons-material/Google';

export default function Login(){
    const googleAuthUrl = import.meta.env.VITE_GOOFLE_AUTH_URL;
    return(
        <div className="loginPage">
            <div className="loginCard">
                <div className="googleImg">
                    <Button href={googleAuthUrl} className="googleImgBtn"> <img src="https://pngimg.com/uploads/google/google_PNG102344.png"></img></Button>
                </div>
                <div className="loginDiv">
                   <div className="login">
                     <Button href={googleAuthUrl}  sx={{textTransform:"none", textDecoration:"none", color:"white"}} className="loginbtn" variant="contained" startIcon={<GoogleIcon/>}>SignIn With Google</Button>
                     </div>
                    <div className="login">
                     <Button href={googleAuthUrl}  sx={{textTransform:"none"}} variant="contained" className="loginbtn" startIcon={<GoogleIcon/>}>LogIn With Google</Button>
                    </div>
               </div>
            </div>

        </div>
    )
}