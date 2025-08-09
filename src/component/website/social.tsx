import "./social.scss";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";

function SocialFollow() {
  return (
    <div className="social-container">
      <a
        href="https://www.facebook.com/Yantram-Medtech-Pvt-Ltd-103689808902053"
        className="social-link"
      >
        <IconButton>
          <FacebookIcon />
        </IconButton>
      </a>

      <a href="https://twitter.com/YantramM" className="social-link">
        <IconButton>
          <TwitterIcon />
        </IconButton>
      </a>

      <a
        href="https://www.instagram.com/yantram.medtech/"
        className="social-link"
      >
        <IconButton>
          <InstagramIcon />
        </IconButton>
      </a>

      <a
        href="https://www.linkedin.com/uas/login?session_redirect=%2Fcompany%2F77618343%2F"
        className="social-link"
      >
        <IconButton>
          <LinkedInIcon />
        </IconButton>
      </a>

      <a
        href="https://www.youtube.com/channel/UClbfjSeVUFHKDzTx0tb6bjg"
        className="social-link"
      >
        <IconButton>
          <YouTubeIcon />
        </IconButton>
      </a>
    </div>
  );
}

export default SocialFollow;
