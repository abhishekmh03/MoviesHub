import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SouthIcon from '@mui/icons-material/South';
import "./NotFound.css"



export default function NotFound() {
    return(
        <div className="NotFound">
            <div className='notFoundAlert'>
            <Alert severity="info" variant='filled'>This page is not available.</Alert>
            </div>
            <div className='notFoundNavigate'>
                <p>Go to Home Page</p>
                <div className='ArrowIcon'>
                    <SouthIcon/>
                </div>
                <Button sx={{textTransform:'none', fontSize:"19px"}} variant="outlined"> <a className="navbar-brand " href="/">MoviesHub</a></Button>
            </div>


        </div>
    )

}