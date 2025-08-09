import React, { useState } from "react";
import styles from "./ContactForm.module.scss";
import Grid from "@mui/material/Grid";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import blue_bed from "../../../../src/assets/addPatient/blue-bed.png";
import { useNavigate } from "react-router-dom";

interface Bed {
  id: number;
  name: string;
}

const beds: Bed[] = [
  { id: 1, name: "GW-01" },
  { id: 2, name: "GW-02" },
  { id: 3, name: "GW-03" },
  { id: 4, name: "GW-04" },
  { id: 5, name: "GW-05" },
  { id: 6, name: "GW-06" },
  { id: 7, name: "GW-07" },
  { id: 8, name: "GW-08" },
  { id: 9, name: "GW-09" },
  { id: 10, name: "GW-10" },
  { id: 11, name: "GW-11" },
  { id: 12, name: "GW-12" },
];

interface BedsSectionProps {
  handleBedSelection: (bedName: string) => void;
}

const BedsSection: React.FC<BedsSectionProps> = ({ handleBedSelection }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  const bedsPerPage: number = 10;

  const handlePrevious = (): void => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = (): void => {
    if ((currentPage + 1) * bedsPerPage < beds.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const displayedBeds: Bed[] = beds.slice(
    currentPage * bedsPerPage,
    (currentPage + 1) * bedsPerPage
  );

  return (
    <div style={{ marginTop: "20px" }}>
      <h4 style={{ textAlign: "left", marginBottom: "20px" }}>Select Bed</h4>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Beds Grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {displayedBeds.map((bed) => (
            <div
              key={bed.id}
              style={{
                textAlign: "center",
                width: "50px",
                cursor: "pointer",
                border: bed.name === selectedBed ? "3px solid #007bff" : "none",
                backgroundColor:
                  bed.name === selectedBed ? "#f0f8ff" : "transparent",
              }}
              onClick={() => {
                handleBedSelection(bed.name);

                setSelectedBed(bed.name);
              }}
            >
              <img
                src={blue_bed}
                alt={bed.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "5px",
                }}
              />
              <p style={{ fontSize: "14px" }}>{bed.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          style={{
            fontSize: "16px",
            padding: "5px 10px",
            margin: "5px",
            backgroundColor: currentPage === 0 ? "#e0e0e0" : "#007bff",
            color: currentPage === 0 ? "#aaa" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {"<"}
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={(currentPage + 1) * bedsPerPage >= beds.length}
          style={{
            fontSize: "16px",
            padding: "4px 10px",
            margin: "5px",
            backgroundColor:
              (currentPage + 1) * bedsPerPage >= beds.length
                ? "#e0e0e0"
                : "#007bff",
            color:
              (currentPage + 1) * bedsPerPage >= beds.length ? "#aaa" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor:
              (currentPage + 1) * bedsPerPage >= beds.length
                ? "not-allowed"
                : "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {" >"}
        </button>
      </div>
    </div>
  );
};

type FormProps = {};

const ContactForm: React.FC<FormProps> = () => {
  const navigate = useNavigate();

  const [wardOptions] = useState<string[]>([
    "General Ward",
    "ICU",
    "Emergency Room",
    "Ward A",
    "Ward B",
    "Ward C",
    "Intensive Care Unit (ICU)",
  ]);

  const [roomOptions] = useState<string[]>([
    "Room A",
    "Room B",
    "Room C",
    "Room D",
    "Private Room",
    "Shared Room",
  ]);

  const [floorOptions] = useState<string[]>([
    "Floor 1",
    "Floor 2",
    "Floor 3",
    "Floor 4",
    "Ground Floor",
  ]);

  const [relationOptions] = useState<string[]>([
    "Parent",
    "Sibling",
    "Spouse",
    "Child",
    "Other",
    "Grandparent",
    "Aunt/Uncle",
    "Friend",
    "Guardian",
  ]);

  const [formData, setFormData] = useState({
    guardianName: "",
    mobileNumber: "",
    relation: "",
    ward: "",
    room: "",
    floor: "",
    insurance: "",
    insuranceType: "",
    insuranceNumber: "",
    insuranceExpireDate: "",
    insuredName: "",
    primaryMobile: "",
    selectedBed: "",
    insuranceClaimType: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to`, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange2 = (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLSelectElement;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check if the 'insuranceType' is 'Claim' and navigate to the specific page
    if (
      (name === "insuranceType" && value === "Reimbursement") ||
      (name === "insuranceClaimType" && (value === "Paper" || value === "Electronic"))
    ) {
      navigate("/hospital-dashboard/reception/insurance", { state: { value } });
    }
    
  };

  const handleBedSelection = (bedName: string): void => {
    setFormData((prevData) => ({
      ...prevData,
      selectedBed: bedName,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  console.log("formdata", formData);
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      {/* Next of Kin Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} >
          <h4 style={{ textAlign: "left"}}>Emergency Contact</h4>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Guardian Name"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleInputChange}
            fullWidth
            placeholder="John Doe"
          />
        </Grid>
        <Grid
          container
          spacing={1}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          <Grid item xs={1}>
            <TextField
              name="countryCode"
              value="+91" // Example country code, can be dynamically set if needed
              disabled
              fullWidth
            />
          </Grid>

          {/* Mobile Number Grid Item */}
          <Grid item xs={11}>
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              fullWidth
              placeholder="Mobile Number"
              inputProps={{
                maxLength: 10, // Limits input to 10 characters
                pattern: "[0-9]{10}", // Ensures input is numeric (only digits)
              }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="relation-label">Relation</InputLabel>
            <Select
              labelId="relation-label"
              name="relation"
              value={formData.relation}
              onChange={handleInputChange2}
              label="Relation"
            >
              <MenuItem value="">Select Relation</MenuItem>
              {relationOptions.map((relation) => (
                <MenuItem key={relation} value={relation}>
                  {relation}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Area of Selection Section */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h4 style={{ textAlign: "left", marginTop: "20px" }}>
            Area of selection
          </h4>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="ward-label">Ward</InputLabel>
            <Select
              labelId="ward-label"
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange2}
              label="Ward"
            >
              <MenuItem value="">Select Ward</MenuItem>
              {wardOptions.map((ward) => (
                <MenuItem key={ward} value={ward}>
                  {ward}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="room-label">Room</InputLabel>
            <Select
              labelId="room-label"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleInputChange2}
              label="Room"
            >
              <MenuItem value="">Select Room</MenuItem>
              {roomOptions.map((room) => (
                <MenuItem key={room} value={room}>
                  {room}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="floor-label">Floor</InputLabel>
            <Select
              labelId="floor-label"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange2}
              label="Floor"
            >
              <MenuItem value="">Select Floor</MenuItem>
              {floorOptions.map((floor) => (
                <MenuItem key={floor} value={floor}>
                  {floor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <BedsSection handleBedSelection={handleBedSelection} />

      {/* Insurance Section */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h4 style={{ textAlign: "left", marginTop: "20px" }}>Insurance</h4>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="insurance-label">Insurance</InputLabel>
            <Select
              labelId="insurance-label"
              id="insurance"
              name="insurance"
              value={formData.insurance}
              onChange={handleInputChange2}
              label="Insurance"
            >
              <MenuItem value="YES">YES</MenuItem>
              <MenuItem value="NO">NO</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {formData.insurance === "YES" && (
          <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="insurance-label">Insurance Type</InputLabel>
            <Select
              labelId="insurance-label"
              id="insuranceType"
              name="insuranceType"
              value={formData.insuranceType}
              onChange={handleInputChange2}
              label="Insurance Type"
            >
              <MenuItem value="Reimbursement">Reimbursement</MenuItem>
              <MenuItem value="Claim">Claim</MenuItem>
            </Select>
            
          </FormControl>
        </Grid>
        )}
       
      </Grid>

      {formData.insuranceType === "Claim" && (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{mt: 2}}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="insuranceClaimType"
                value={formData.insuranceClaimType}
                onChange={handleInputChange2}
              >
                <FormControlLabel
                  value="Paper"
                  control={<Radio />}
                  label="Paper"
                />
                <FormControlLabel
                  value="Electronic"
                  control={<Radio />}
                  label="Electronic"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Insurance Number"
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Insurance Expire Date"
              name="insuranceExpireDate"
              InputLabelProps={{ shrink: true }}
              value={formData.insuranceExpireDate}
              onChange={handleInputChange}
              inputProps={{
                min: new Date().toISOString().split("T")[0], // Sets the minimum date to today
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primary Insured"
              name="insuredName"
              value={formData.insuredName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primary Mobile Number"
              name="primaryMobile"
              value={formData.primaryMobile}
              onChange={handleInputChange}
              inputProps={{
                maxLength: 10, // Limits input to 10 characters
                pattern: "[0-9]{10}", // Ensures input is numeric (only digits)
              }}
            />
          </Grid>
        </Grid>
      )}

     
    </form>
  );
};

export default ContactForm;
