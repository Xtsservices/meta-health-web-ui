import React from "react";
import styles from "./ContactUs.module.scss";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ContactUsStaff: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ marginRight: "10px" }}>
          <IconButton aria-label="delete" onClick={() => navigate("..")}>
            <ArrowBackIosIcon />
          </IconButton>
        </h3>
        <h2 style={{ flex: "1", justifyContent: "center" }}>Contact Us</h2>
      </div>
      <div>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" variant="outlined" required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                variant="outlined"
                type="tel"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={1}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* <br /> */}
      <div>
        <h2>Reach Us</h2>
        <p>
          If you have any questions or inquiries, please feel free to get in
          touch with us using the contact information below:
        </p>
        <p>Email: info.yantram@yantrammedtech.com</p>

        <p>Phone: +91-7993648675</p>

        <p>
          Address: #A102, Sai Rasik Residency Image Hospital Lane, Madhapur,
          Hyderabad - 500081, Telangana
        </p>

        <p>
          Alternatively, you can fill out the form, and we'll get back to you as
          soon as possible.
        </p>
      </div>
    </div>
  );
};

export default ContactUsStaff;
