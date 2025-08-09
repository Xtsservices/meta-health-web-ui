import React, { useState } from 'react';
import { Box, TextField, Typography, Grid, Stack, Button, Dialog } from "@mui/material";
import styles from "./PatientRegistration.module.scss";
import approve_warning_banner from "../../../assets/reception/approve_warning_banner.png"
const VerificationValidation = () => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    address: '',
    insuranceId: '',
    insuranceProvider: '',
    claimingAmount: '',
    claimingAmountLimit: '',
    totalHospitalBill: '',
    reimbursementBill: '',
    totalPayableAmount: ''
  });

  const [openDialog, setDialog] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  return (
    <div className={styles.patientRegistrationContainer}>
      <div className={styles.header}>
        <span style ={{fontWeight:"bold", fontSize:"18px"}}>Patient ID: <span>IDR985678</span></span>
      </div>

      <h3 className={styles.title}>Policyholder Information</h3>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formValues.firstName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formValues.lastName}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Contact Number and Email */}
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            name="contactNumber"
            value={formValues.contactNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="E-mail Address"
            variant="outlined"
            name="email"
            value={formValues.email}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            name="address"
            value={formValues.address}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <div
            style={{ borderTop: "1px solid #ccc", margin: "10px 0" }}
          ></div>
        </Grid>

        <Grid item xs={12}>

        <h3 className={styles.title}>Insurance Provider Details</h3>
       </Grid>
         
         
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Insurance ID"
                variant="outlined"
                name="insuranceId"
                value={formValues.insuranceId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Insurance Provider"
                variant="outlined"
                name="insuranceProvider"
                value={formValues.insuranceProvider}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Claiming Amount"
                variant="outlined"
                name="claimingAmount"
                value={formValues.claimingAmount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Claiming Amount Limit"
                variant="outlined"
                name="claimingAmountLimit"
                value={formValues.claimingAmountLimit}
                onChange={handleInputChange}
              />
            </Grid>
         
       

        <Grid item xs={12}>
          <div
            style={{ borderTop: "1px solid #ccc", margin: "10px 0" }}
          ></div>
        </Grid>

        <Grid item xs={12}>
          <h3 className={styles.title}>Bill  Details</h3>
        </Grid>

      
          <Grid item xs={4}>
            <Typography variant="body1" style ={{marginTop:"20px",color:"#000"}}>Total Billed Amount</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Total bill amount issued by hospital"
              variant="outlined"
              name="totalHospitalBill"
              value={formValues.totalHospitalBill}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1" style ={{marginTop:"20px", color:"#000"}}>Approved Amount</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Approved amount by the insurance..."
              variant="outlined"
              name="reimbursementBill"
              value={formValues.reimbursementBill}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1" style ={{marginTop:"20px",color:"#000"}}>Balance Due from Patient</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Amount due from the patient"
              variant="outlined"
              name="totalPayableAmount"
              value={formValues.totalPayableAmount}
              onChange={handleInputChange}
            />
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              spacing={5}
              sx={{
                justifyContent: "center",
              }}
            >
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  padding: "6px 46px",
                  width: "fit-content",
                  borderRadius: "20px",
                  textTransform: "none",
                  backgroundColor: "green", 
                  "&:hover": {
                    backgroundColor: "darkgreen",  
                  }
                }} 
                onClick={()=> setDialog(true)}
              >
                Approved
              </Button>
              <Button
                variant="outlined"
               color="error"
                sx={{
                  padding: "6px 46px",
                  width: "fit-content",
                  borderRadius: "20px",
                  textTransform: "none",
                }}
              >
               Reject
              </Button>
            </Stack>
          </Box>
      </Grid>

      <Dialog open = {openDialog} onClose={()=> setDialog(false)}
         PaperProps={{ style: { width: "600px", borderRadius:"20px" } }}
        >
        <div style = {{display:"flex",flexDirection:"column",alignItems:"center", padding:"25px"}}>
          <img src= {approve_warning_banner} alt = "approve image banner" style ={{width:"120px"}}/>
          <h2 style ={{color:"#1977F3", alignSelf:"flex-start"}}>Are You Sure You Want To Approve This Claim?</h2>
          <p style ={{color:"#6D6D6D", fontWeight:"400"}}>Are yo usure you want to approve this insurance claim? You can still modifyit later if needed"</p>

          <div style = {{display:"flex", justifyContent:"space-between", width:"100%"}}>
          <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  padding: "6px 46px",
                  width: "fit-content",
                  borderRadius: "20px",
                  textTransform: "none",
                  backgroundColor: "green", 
                  "&:hover": {
                    backgroundColor: "darkgreen",  
                  }
                }} 
               
              >
                Approved
              </Button>
            <Button
              variant ="contained"  onClick={()=>setDialog(false)}
              sx= {{border:"1px solid #ccc", boxShadow:"none", borderRadius:"20px", color :"#000", background:"#ffffff","&:hover": {
                    backgroundColor: "transparent",  
                  } }}
              >
                Cancel
            </Button>
          </div>
        </div>

      </Dialog>

     
    </div>
  );
};

export default VerificationValidation;
