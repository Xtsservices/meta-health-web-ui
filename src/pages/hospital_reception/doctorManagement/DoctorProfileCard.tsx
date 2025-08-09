import React, { useState } from "react";
import styles from "./DoctorProfileCard.module.scss";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeFilledSharpIcon from "@mui/icons-material/AccessTimeFilledSharp";
import ClockPopup from "./ClockPopup"; // Import the new component
import ViewProfilePopup from "./ViewProfilePopup";
import doctorCardbackgroundImage from "../../../assets/reception/doctorCardbackgroundImage.png"
type DoctorProfileCardProps = {
  doctorImage?: string;
  name: string;
  qualification: string;
  department: string;
  experience: string;
  designation: string;
};

const DoctorProfileCard: React.FC<DoctorProfileCardProps> = ({
  doctorImage = "https://randomuser.me/api/portraits/men/32.jpg",
  name,
  qualification,
  department,
  experience,
  designation,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [isClockPopupOpen, setIsClockPopupOpen] = useState(false);
  const [isViewProfilePopupOpen, setIsViewProfilePopupOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHide = () => {
    setIsHidden(true);
    handleMenuClose();
  };

  const handleUnhide = () => {
    setIsHidden(false);
    handleMenuClose();
  };

  const handleClockClick = () => {
    setIsClockPopupOpen(true); // Open the popup
  };

  const handleClockPopupClose = () => {
    setIsClockPopupOpen(false); // Close the popup
  };
  const handleViewProfile = () => {
    setIsViewProfilePopupOpen(true);
  };
  const handleViewProfilePopupClose = () => {
    setIsViewProfilePopupOpen(false);
  };

  const handleDelete = ()=>{
    console.log("delete")
  }

  return (
    <Card className={`${styles.card} ${isHidden ? styles.hidden : ""}`} style ={{background:`url(${doctorCardbackgroundImage})`, backgroundRepeat:"no-repeat", backgroundSize:"75% 55%", backgroundPosition:"0px 20px"}} >
      <div className={styles.header}>
        <IconButton className={styles.clockButton} onClick={handleClockClick}>
          <AccessTimeFilledSharpIcon style={{color:'#F59706'}}/>
        </IconButton>

        <Typography style={{fontWeight:'bold', fontSize:"16px"}} variant="h6">{department}</Typography>
        <IconButton className={styles.moreButton} onClick={handleMenuClick}>
          <MoreVertIcon style={{color:'black'}}/>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {isHidden ? (
            <MenuItem onClick={handleUnhide}>Unhide</MenuItem>
          ) : (
            <MenuItem onClick={handleHide}>Hide</MenuItem>
          )}
           <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </div>
   
      <div className={styles.imageContainer} >
        <img src={doctorImage} alt={name} className={styles.doctorImage} />
      </div>
      <CardContent className={styles.cardContent}>
        <Typography className={styles.name}>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" style = {{fontWeight:"600", fontSize:"14px"}}>
          {qualification}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {experience}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {designation}
        </Typography>
      </CardContent>
      <hr style={{ border: '1px solid #ccc',width:'90%' }} />
    
      <CardActions>
        <Button
          variant="contained"
          
          className={styles.button}
          onClick={handleViewProfile}
          disabled={isHidden}
        >
          View profile
        </Button>
      </CardActions>
      <ClockPopup open={isClockPopupOpen} onClose={handleClockPopupClose} />
      <ViewProfilePopup
        open={isViewProfilePopupOpen}
        onClose={handleViewProfilePopupClose}
        doctorImage={doctorImage}
        doctorName={name}
        qualification={qualification}
        department={department}
        experience={experience}
        designation={designation}
      />
    </Card>
  );
};

export default DoctorProfileCard;
