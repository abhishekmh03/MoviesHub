import "./Footer.css"
import CopyrightIcon from '@mui/icons-material/Copyright';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer(){
    return(
        
            <footer className="footer">
                <div>
                <a  href="https://github.com/abhishekmh03"  target="_blank" className="i"><GitHubIcon/></a>
                <a href="https://x.com/AbhishekMh60854"  target="_blank" className="i"><XIcon /></a>
                <a href="#"  className="i"><LinkedInIcon/></a>
                </div>
                <div>
                    <p><CopyrightIcon />MoviesHub Private Limited.</p>
                </div>
            </footer>
        
    )
}