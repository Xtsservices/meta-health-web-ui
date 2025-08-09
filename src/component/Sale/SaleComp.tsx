import { useEffect, useRef, useState } from "react";
import styles from "../../pages/hospital_pharmacy/PharmacySale/Sale.module.scss";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Autocomplete,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PaymentMethodDialog from "../../component/PaymentMethodDialog";
import pdfIcon from "./../../../src/assets/pdf.png";
import { CloudUpload, Add } from "@mui/icons-material";
import { authFetch } from "../../axios/useAuthFetch";
import { authPost } from "../../axios/useAuthPost";
import { useLocation } from "react-router-dom";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../store/error/error.action";
import { formatDate2 } from "../../utility/global";
import upload from '../../assets/pharmacy/material-symbols-light_upload.png'

interface ItemType {
  id: number | null;
  name: string;
  category: string;
  hsn: string;
  quantity: number | null;
  costPrice: number | null;
  sellingPrice: number | null;
  manufacturer: string;
  location: string;
  expiryDate: string;
  addedOn?: string;
  gst?: number | string;
  isActive?:number;
}

type selectedListType = {
  loinc_num_: string;
  name: string;
  department: string;
  testPrice: number;
  gst: number;
};

interface SaleComponentProps {
  type: "medicine" | "test";
}

type PaymentMethod = "cards" | "online" | "cash";

const generateID = () => {
  const now = new Date();
  return (
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0")
  );
};

const SaleComponent = ({ type }: SaleComponentProps) => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;
  const department = path.includes("radiology")
    ? "Radiology"
    : path.includes("pathology")
    ? "Pathology"
    : "";
  const [itemList, setItemList] = useState<ItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [newSelectedList, setNewSelectedList] = useState<ItemType[]>([]);
  const [testList, setTestsList] = useState<selectedListType[]>([]);
  const [selectedTest, setSelectedTest] = useState<selectedListType | null>(
    null
  );
  const [newSelectedTestList, setNewSelectedTestList] = useState<
    selectedListType[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    mobileNumber: "",
    patientID: generateID(),
    quantity: 0,
  });

  const [isPayment, setIsPayment] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>("");
  const [discountReasonID, setDiscountReasonID] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileURLs, setFileURLs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFiles((prevFiles) => [...prevFiles, file]);
      setFileURLs((prevURLs) => [...prevURLs, url]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFileChange({
        target: { files: e.dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      if (type === "medicine") {
        const response = await authFetch(
          `pharmacy/${user.hospitalID}/getMedicineInventory`,
          user.token
        );
        dispatch(setLoading(false));
        if (response.status === 200) {
          const data = response.medicines;
          const filteredMedicineStock = data.filter((medicine: ItemType) => {
            const currentDate = new Date();
            const expiryDate = new Date(medicine.expiryDate);

            return (
              medicine.quantity !== null &&
              medicine.quantity > 0 &&
              expiryDate > currentDate &&
              medicine.isActive === 1
            );
          });
          setItemList(filteredMedicineStock);
          // setItemList(data);
          dispatch(setLoading(false));
        }
      } else if (type === "test") {
        if (selectedTest?.name && selectedTest.name.length >= 1) {
          const response = await authPost(
            `test/getlabTestsdata/${user.hospitalID}/${department}`,
            { text: selectedTest?.name || "" },
            user.token
          );
          if (response.message === "success") {
            const testData = response.data;
            const uniqueTests: selectedListType[] = Array.from(
              new Set(
                testData.map(
                  (el: {
                    LOINC_Code: string;
                    LOINC_Name: string;
                    Department: string;
                    gst: number;
                    testPrice: number;
                  }) => ({
                    loinc_num_: el.LOINC_Code,
                    name: el.LOINC_Name,
                    department: el.Department,
                    gst: el.gst,
                    testPrice: el.testPrice,
                  })
                )
              )
            );
            setTestsList(uniqueTests);
          }
        }
      }
    };

    if (user.hospitalID) {
      fetchData();
    }
  }, [
    dispatch,
    user.hospitalID,
    user.token,
    type,
    selectedTest?.name,
    newSelectedList,
  ]);

  const handleAlphaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleFormData = async () => {
    const { name, city, mobileNumber } = formData;

    if (!name || !city || !mobileNumber) {
      dispatch(
        setError(
          "Please fill in all required fields: Name, City, and Mobile Number."
        )
      );
      return;
    }

    if (files.length === 0) {
      const text =
        type === "medicine"
          ? "Please Insert The Prescription"
          : "Please Insert The Test Prescription";
      dispatch(setError(text));
      return;
    }

    setIsPayment((prevState) => !prevState);
  };



const addPatientWithOrder = async (
  paymentDetails: Record<PaymentMethod, number>
) => {
  const paymentMethod = Object.keys(paymentDetails)[0] as PaymentMethod;
  const paymentAmount = paymentDetails[paymentMethod];
  const labsPath = `tests/walkinPatients/${department}`;
  const medicinePath = `addPatientWithOrder`;

  // Create FormData
  const formDataToSend = new FormData();

  // Append file (if any)
  if (files.length > 0) {
    formDataToSend.append("files", files[0]);
  }

  // Append other fields as JSON
  formDataToSend.append(
    type === "medicine" ? "medicineList" : "testsList",
    JSON.stringify(type === "medicine" ? newSelectedList : newSelectedTestList)
  );
  formDataToSend.append("patientData", JSON.stringify(formData));
  formDataToSend.append("userID", user.id.toString());
  formDataToSend.append("department", department);
  formDataToSend.append("paymentMethod", JSON.stringify(paymentDetails));
  formDataToSend.append("paymentAmount", paymentAmount.toString());

  formDataToSend.append(
    "discount",
    JSON.stringify({
      discount: discount,
      discountReason: discountReason,
      discountReasonID: discountReasonID,
    })
  );

  // Send FormData directly (not inside an object)
  const response = await authPost(
    `medicineInventoryPatients/${user.hospitalID}/${type === "medicine" ? medicinePath : labsPath}`,
    formDataToSend, // Send FormData directly
    user.token
  );


  if (response.status === 200) {
    dispatch(setSuccess("Successfully Added"));
  } else {
    dispatch(setError(response.message));
  }

  // Reset states after submission
  setNewSelectedList([]);
  setNewSelectedTestList([]);
  setFormData({
    name: "",
    city: "",
    mobileNumber: "",
    patientID: generateID(),
    quantity: 0,
  });

  setDiscount(0);
  setDiscountReason("");
  setDiscountReasonID("");
  setFiles([]);
  setFileURLs([]);
};

  const grossAmount =
    type === "medicine"
      ? newSelectedList.reduce(
          (acc, item) =>
            acc + (item?.sellingPrice ?? 0) * (item?.quantity ?? 0),
          0
        )
      : newSelectedTestList.reduce(
          (acc, item) => acc + (item.testPrice ?? 0),
          0
        );

  // Calculate GST Amount
  const gstAmount =
    type === "medicine"
      ? (grossAmount * 18) / 100 // Static 18% GST for medicines
      : newSelectedTestList.reduce(
          (acc, item) => acc + (item.testPrice ?? 0) * ((item.gst ?? 0) / 100),
          0
        );

  const totalAmount = grossAmount + gstAmount;
  return (
    <div className={styles.maincontainer_for_sale} >
      {/* Patient Details Section */}
      <div className={styles.containerMedicine}>
      <h3 style = {{fontWeight:600}}>Enter Patient Details</h3>
      <div className={styles.patientDetails}>
        <TextField
          label="Name"
          variant="outlined"
          className={styles.textField}
          name="name"
          placeholder="Enter your Name"
          value={formData.name}
          onChange={handleAlphaInputChange}
        />
        <TextField
          label="Patient ID"
          variant="outlined"
          className={styles.textField}
          name="patientID"
          value={formData.patientID}
          disabled
        />
        <div className={styles.phoneInput}>
          <PhoneInput
           
          placeholder="Enter Your Mobile Number"
            country={"in"}
            value={formData.mobileNumber}
            onChange={(phone) =>
              setFormData({ ...formData, mobileNumber: phone })
            }
            inputStyle={{
              width: "100%",
              height: "56px",
              borderRadius: "4px",
              borderColor: "#c4c4c4",
              paddingLeft: "48px",
              backgroundColor: "transparent",
            }}
            dropdownStyle={{
              width: "300px",
            }}
            inputProps={{
              name: "mobileNumber",
              required: true,
              autoFocus: true,
            }}
          />
        </div>
        <TextField
          label="City"
          variant="outlined"
          className={styles.textField}
          name="city"
          value={formData.city}
          onChange={handleAlphaInputChange}
        />
       
      </div>
      <hr className={styles.horizontalLine} />

      {/* Prescription Upload Section */}
      <div style={{ display: "flex", justifyContent: "space-between"}}>
        <h4 style ={{fontWeight:700, }}>
          {type === "test"
            ? "Upload Patient Test Prescription"
            : "Upload Patient Prescription"}
        </h4>
        {fileURLs.length > 0 && (
          <Button
            variant="contained"
            component="span"
            style={{
              backgroundColor: "#1977f3",
              borderRadius: "30px",
              padding: "0 16px", // Proper padding
              display: "flex",
              alignItems: "center",
              gap: "8px", // Adds spacing between icon and text
              height: "40px", // Fixed height for consistency
              minWidth: "120px",
              textTransform:"none"
              
            }}
            startIcon={<img src={upload} alt="Upload" style={{ width: 25, height: 25 }} />}  // Adds img before the text
          >
            Upload
          </Button>
        )}
      </div>

      {fileURLs.length === 0 && (
        <div
          className={styles.upload}
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: "2px dashed #9CA7B9",
            padding: "20px",
            margin: "10px 40px 10px 40px",
            textAlign: "center",
            cursor: "pointer",
            height:"150px",
            borderRadius:"4px"
          }}
        >
          <input
            accept="image/*,application/pdf"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-input"
            ref={fileInputRef}
          />
          <label htmlFor="upload-input">
            <CloudUpload />
            <p style ={{ fontSize:'12px',fontWeight:"500"}}>
              Drag and drop files here, or browse to select files from your
              computer. Accepted formats: PDF, PNG, JPG. Each file must be under
              20 MB.
            </p>
            <button
              style={{
                backgroundColor: "#F59706",
                padding: "3px",
                border: "none",
                cursor: "pointer",
                borderRadius:"4px"
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Add sx={{ color: "white" }} />
            </button>
          </label>
        </div>
      )}

      {/* Uploaded Documents Section */}
      <div>
        {fileURLs.length ? (
          <h4 style={{ fontWeight: "500" }}>Uploaded Documents</h4>
        ) : (
          ""
        )}
        <div style={{ display: "flex" }}>
          {fileURLs?.map((url, index) => {
            const fileType = files?.[index]?.type;
            const isImage = fileType?.startsWith("image/");
            const isPdf = fileType === "application/pdf";

            return (
              <div className={styles.uploaded_box} key={index}>
                <div className={styles.uploaded_box_file}>
                  {isImage ? (
                    <img
                      src={url}
                      style={{
                        height: "4rem",
                        width: "4rem",
                        objectFit: "cover",
                      }}
                      alt="Image Preview"
                    />
                  ) : isPdf ? (
                    <img
                      src={pdfIcon}
                      alt="PDF"
                      style={{ height: "4rem", width: "4rem" }}
                    />
                  ) : null}
                </div>
                <h5 style={{ fontSize: "12px", width: "5rem" }}>
                  {files?.[index]?.name
                    .slice(0, -files?.[index]?.type.split("/")[1].length - 1)
                    .slice(
                      0,
                      files?.[index]?.name.length > 12
                        ? 12
                        : files?.[index]?.name.length
                    )}
                </h5>
                <div className={styles.uploaded_box_buttons}>
                  <button
                    onClick={() => {
                      const file = files[index];
                      if (!file) return;

                      const fileType = file.type;
                      const isImage = fileType.startsWith("image/");
                      const isPdf = fileType === "application/pdf";

                      if (isImage) {
                        const imageUrl = URL.createObjectURL(file);
                        window.open(imageUrl, "_blank");
                      } else if (isPdf) {
                        const pdfUrl = URL.createObjectURL(file);
                        const pdfWindow = window.open("", "_blank");
                        if (pdfWindow) {
                          pdfWindow.document.write(`
                            <html>
                              <head><title>PDF Viewer</title></head>
                              <body style="margin: 0;">
                                <embed src="${pdfUrl}" type="application/pdf" width="100%" height="100%" />
                              </body>
                            </html>
                          `);
                          pdfWindow.document.close();
                        }
                      }
                    }}
                  >
                    View
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => {
                      const updatedFileURLs = [...fileURLs];
                      updatedFileURLs.splice(index, 1);
                      setFileURLs(updatedFileURLs);

                      const updatedFiles = [...files];
                      updatedFiles.splice(index, 1);
                      setFiles(updatedFiles);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Add Section */}
      <div style={{ backgroundColor: "#fff", padding: "19px" }}>
        {/* Medicine Search Section */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {type === "medicine" ? (
                <Select
                  // value={selectedItem?.name || ""}
                  value={selectedItem?.id ? selectedItem.id.toString() : ""}
                  sx={{ width: "200px" }}
                  onChange={(e) => {
                    const selected = itemList.find(
                      (item) =>
                        item.id !== null &&
                        item.id.toString() === e.target.value
                    );
                    if (selected) {
                      setSelectedItem(selected);
                    }
                  }}
                  displayEmpty
                  className={styles.searchInput}
                >
                  <MenuItem value="" disabled>
                    Select Medicine
                  </MenuItem>
                  {itemList?.map((item, index) =>
                    item.id !== null ? (
                      <MenuItem key={index} value={item.id.toString()}>
                        {`${item.name} (Qty: ${item.quantity})`}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
              ) : (
                <Autocomplete
                  freeSolo={false}
                  value={selectedTest}
                  onChange={(_, newValue: selectedListType | null) => {
                    setSelectedTest(newValue);
                  }}
                  inputValue={selectedTest?.name || ""}
                  onInputChange={(_, newInputValue) => {
                    const regex = /^[a-zA-Z][a-zA-Z\s]*$/;
                    if (
                      (regex.test(newInputValue) || newInputValue === "") &&
                      newInputValue.length <= 20
                    ) {
                      setSelectedTest({
                        loinc_num_: "",
                        name: newInputValue,
                        department: "",
                        testPrice: 100,
                        gst: 0,
                      });
                    }
                  }}
                  options={testList}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.loinc_num_ === value.loinc_num_
                  }
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Test"
                      placeholder="Enter 3 letters for search"
                    />
                  )}
                />
              )}

              <Button
                variant="contained"
                style={{ backgroundColor: "#1977f3" }}
                onClick={() => {
                  if (type === "medicine") {
                    if (
                      selectedItem &&
                      selectedItem.name &&
                      !newSelectedList.some(
                        (list) => list.name === selectedItem.name
                      )
                    ) {
                      setNewSelectedList((prev) => [
                        { ...selectedItem, quantity: 1 },
                        ...prev,
                      ]);
                      setSelectedItem(null);
                    } else {
                      dispatch(
                        setError(
                          "Please select a valid medicine from the list."
                        )
                      );
                    }
                  } else if (type === "test") {
                    if (
                      selectedTest &&
                      selectedTest.name &&
                      testList.some(
                        (test) => test.name === selectedTest.name
                      ) &&
                      !newSelectedTestList.some(
                        (list) => list.name === selectedTest.name
                      )
                    ) {
                      setNewSelectedTestList((prev) => [{...selectedTest,status: "pending"}, ...prev]);
                      setSelectedTest(null);
                    } else {
                      dispatch(
                        setError("Please select a valid test from the list.")
                      );
                    }
                  }
                }}
                
              >
                <Add sx={{ color: "white" }} />
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Table Section */}
        <section className={styles.medicineTable}>
          <h4 style ={{fontWeight:700, fontSize:"18px"}}>
            {type === "medicine" ? "Medicine Prescribed" : "Test Prescribed"}
          </h4>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={styles.headerCell}
                    sx={{ borderTopLeftRadius: "10px", fontWeight:700,fontSize:"17px" }}
                  >
                    {type === "medicine" ? "Medicine Name" : "Test Name"}
                  </TableCell>
                  <TableCell className={styles.headerCell} sx = {{ fontWeight:700,fontSize:"17px"}}>
                    {type === "medicine" ? "HSN Code" : "Lionic Code"}
                  </TableCell>
                  {type === "medicine" && (
                    <>
                      <TableCell className={styles.headerCell} sx = {{ fontWeight:700,fontSize:"17px"}}>
                        Expiry Date
                      </TableCell>
                      <TableCell className={styles.headerCell} sx = {{ fontWeight:700,fontSize:"17px"}}>Price</TableCell>
                      <TableCell className={styles.headerCell} sx = {{ fontWeight:700,fontSize:"17px"}}>
                        Quantity
                      </TableCell>
                      <TableCell className={styles.headerCell} sx = {{ fontWeight:700,fontSize:"17px"}}>GST</TableCell>
                    </>
                  )}
                  {type === "test" && (
                    <TableCell className={styles.headerCell} sx = {{ fontWeight:700,fontSize:"17px"}}>GST</TableCell>
                  )}
                  <TableCell
                    className={styles.headerCell}
                    sx={{ borderTopRightRadius: "10px",fontWeight:700, fontSize:"17px" }}
                  >
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {type === "medicine" ? (
                  newSelectedList.length > 0 ? (
                    newSelectedList.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{fontSize:"17px"}}>{item.name}</TableCell>
                        <TableCell sx={{fontSize:"17px"}}>{item.hsn}</TableCell>
                        <TableCell sx={{fontSize:"17px"}}>{formatDate2(item.expiryDate)}</TableCell>
                        <TableCell sx={{fontSize:"17px"}}>{item.sellingPrice}</TableCell>
                        <TableCell>
                          <TextField
                            name="quantity"
                            type="number"
                            value={item.quantity}
                            onChange={(event) => {
                              const newQuantity = Number(event.target.value);
                              setNewSelectedList((prev) => {
                                return prev.map((i, idx) =>
                                  idx === index
                                    ? { ...i, quantity: newQuantity }
                                    : i
                                );
                              });
                            }}
                            sx={{fontSize:"17px"}}
                            required
                          />
                        </TableCell>
                        <TableCell sx={{fontSize:"17px"}}>18%</TableCell>
                        <TableCell sx={{fontSize:"17px"}}>
                          {(item?.quantity ?? 0) * (item?.sellingPrice ?? 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} style={{ textAlign: "center" }}>
                        <span>Looking like empty</span>
                      </TableCell>
                    </TableRow>
                  )
                ) : newSelectedTestList.length > 0 ? (
                  newSelectedTestList.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell>{test.name}</TableCell>
                      <TableCell>{test.loinc_num_}</TableCell>
                      <TableCell>{test.gst}%</TableCell>
                      <TableCell>{test.testPrice}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} style={{ textAlign: "center" }}>
                      <span>Looking like empty</span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </section>
     </div>
     </div>
        {/* Payment Section */}
        {(type === "medicine"
          ? newSelectedList.length > 0
          : newSelectedTestList.length > 0) && (
          <section className={styles.paymentSection}>
            <h4 style ={{fontWeight:"bold", padding:"20px"}}>Payment Details</h4>
            <div className={styles.paymentDetails}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <TextField
                  id="discount-label"
                  label="Discount"
                  variant="outlined"
                  value={discount===0? "" : discount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= 100 && value >= 0) {
                      setDiscount(value);
                    }
                  }}
                  className={styles.cdField}
                  placeholder="Enter discount  %"
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ marginLeft: "1rem" }}
                  fullWidth
                />
                <TextField
                  fullWidth
                  label="Reason"
                  placeholder="Enter"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  sx={{ marginLeft: "1rem" }}
                />
                <TextField
                  fullWidth
                  label="ID"
                  placeholder="Enter"
                  value={discountReasonID}
                  onChange={(e) => setDiscountReasonID(e.target.value)}
                  sx={{ marginLeft: "1rem" }}
                />
              </div>
              <p style ={{fontSize:"17px"}}>Gross: {grossAmount.toFixed(2)} ₹</p>
              <p style ={{fontSize:"17px"}}>GST: {gstAmount.toFixed(2)} ₹</p>
              <p style ={{fontSize:"17px"}}>
                Total:
                {(totalAmount - (totalAmount * discount) / 100).toFixed(2)} ₹
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end",background:"#ECF2FF",padding:"16px" }}>
              <Button
                variant="contained"
                className={styles.payButton}
                onClick={handleFormData}
                sx={{ borderRadius: "25px" }}
              >
                {`Total: ${totalAmount} ₹ `}{" "}
                <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                  {" "}
                  Procced to Pay
                </span>
              </Button>
            </div>

            {isPayment && (
              <PaymentMethodDialog
                open={isPayment}
                onClose={() => setIsPayment(false)}
                onSubmitPaymenthandler={addPatientWithOrder} 
                amount={Number(
                  (totalAmount - (totalAmount * discount) / 100).toFixed(2)
                )}
                total={Number(
                  (totalAmount - (totalAmount * discount) / 100).toFixed(2)
                )}
                pharmacySale={true}
              />
            )}
          </section>
        )}
     
    </div>
  );
};

export default SaleComponent;
