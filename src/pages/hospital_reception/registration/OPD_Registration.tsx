import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import styles from "./OPD_Registration.module.scss";

const OPDRegistration: React.FC = () => {
  const [patientId, setPatientId] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [test, setTest] = useState<string>("");
  const [referralName, setReferralName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [age, setAge] = useState<number | string>("");
  const [gender, setGender] = useState<number>();
  const [amount, setAmount] = useState<number | string>("");
  const [gst, setGst] = useState<number | string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    const randomId = Math.floor(10000000 + Math.random() * 90000000).toString();
    setPatientId(randomId);
  }, []);

  const calculateTotalAmount = (): string => {
    const amt = parseFloat(amount.toString()) || 0;
    const gstValue = parseFloat(gst.toString()) || 0;
    return (amt + gstValue).toFixed(2);
  };
  const handleClick = (value: string) => {
    let genderValue: number;
    if (value === "Male") {
      genderValue = 1;
    } else if (value === "Female") {
      genderValue = 2;
    } else {
      genderValue = 3;
    }

    setGender(genderValue);
  };

  const genderList = [
    { value: "Male", key: 1 },
    { value: "Female", key: 2 },
    { value: "Others", key: 3 },
  ];
  return (
    <div className={styles.container}>
      <TextField
        label="Patient ID"
        value={patientId}
        InputProps={{ readOnly: true }}
        className={styles.textField}
      />
      <FormControl className={styles.formControl}>
        <InputLabel>Department</InputLabel>
        <Select
          value={department}
          onChange={(e) => setDepartment(e.target.value as string)}
        >
          <MenuItem value="Orthopaedic">Orthopaedic</MenuItem>
          <MenuItem value="Gynaecology">Gynaecology</MenuItem>
        </Select>
      </FormControl>

      <FormControl className={styles.formControl}>
        <InputLabel>Doctors</InputLabel>
        <Select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value as string)}
        >
          <MenuItem value="Dr. Kumar">Dr. Kumar</MenuItem>
          <MenuItem value="Dr. Manoj">Dr. Manoj</MenuItem>
          <MenuItem value="Dr. Hari">Dr. Hari</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        className={styles.textField}
      />

      <div>
        <FormControl className={styles.formControl}>
          <InputLabel>Services</InputLabel>
          <Select
            value={service}
            onChange={(e) => setService(e.target.value as string)}
          >
            <MenuItem value="Lab-Radiology">Lab-Radiology</MenuItem>
          </Select>
        </FormControl>

        {service === "Lab-Radiology" && (
          <FormControl className={styles.formControl__test}>
            <InputLabel>Tests</InputLabel>
            <Select
              value={test}
              onChange={(e) => setTest(e.target.value as string)}
            >
              <MenuItem value="Brain Scan">Brain Scan</MenuItem>
            </Select>
          </FormControl>
        )}
      </div>
      <TextField
        label="Referral Name"
        value={referralName}
        onChange={(e) => setReferralName(e.target.value)}
        className={styles.textField}
      />

      <TextField
        label="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        className={styles.textField}
      />

      <TextField
        label="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className={styles.textField}
      />

      <Stack direction="row" spacing={1} alignItems="center" columnGap={2}>
        Gender*
        {genderList.map((el) => (
          <Chip
            key={el.key}
            label={el.value}
            onClick={() => handleClick(el.value)}
            color={gender === el.key ? "primary" : "default"}
            sx={{ boxSizing: "border-box", padding: "10px 20px" }}
          />
        ))}
      </Stack>

      <TextField
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.textField}
      />

      <FormControl className={styles.formControl}>
        <InputLabel>GST</InputLabel>
        <Select value={gst} onChange={(e) => setGst(e.target.value as string)}>
          {/* Add GST options */}
        </Select>
      </FormControl>

      <TextField
        label="Total Amount"
        value={calculateTotalAmount()}
        InputProps={{ readOnly: true }}
        className={styles.textField}
      />

      <FormControl className={styles.formControl}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as string)}
        >
          <MenuItem value="Card-Credit">Card-Credit</MenuItem>
          {/* Add other payment methods */}
        </Select>
      </FormControl>
      <div className={styles.submitButton__container}>
        <Button
          variant="contained"
          color="primary"
          className={styles.submitButton}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OPDRegistration;
