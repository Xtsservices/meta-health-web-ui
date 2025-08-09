import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogContent,
  Typography,
  Paper,
  Autocomplete,
} from "@mui/material";

import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import rafiki from "../../../assets/Labs/rafiki.png";
interface TestData {
  id?: number;
  labTestID?:number;
  hospitalID?: number;
  testName: string;
  lonicCode: string;
  hsn: string;
  gst: number;
  testPrice: number;
  addedOn?: string;
  updatedOn?: string;
  testType?: string;
}

type selectedListType = {
  id: number;
  loinc_num_: string;
  name: string;
  department: string;
};

interface OrderExpneseDialogProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  editPriceData: TestData | null;
}

const TestPricingModal = ({
  setOpen,
  open,
  editPriceData,
}: OrderExpneseDialogProps) => {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [testList, setTestList] = useState<TestData[]>([]);

  const initalTestData = {
    id:0,
    testName: "",
    lonicCode: "",
    hsn: "",
    gst: 0,
    testPrice: 0,
  };

  const [selectedTestData, setSelectedTestData] =
    useState<TestData>(initalTestData);

  const addTestToList = () => {
    if (
      selectedTestData.testName &&
      selectedTestData.lonicCode &&
      selectedTestData.hsn &&
      selectedTestData.gst &&
      selectedTestData.testPrice &&
      selectedTestData.id
    ) {
      // Check if the test is already in the list
      const isDuplicate = testList.some(
        (test) => test.id === selectedTestData.id
      );

      if (isDuplicate) {
        alert("This test is already in the list!"); // Show alert if duplicate
        return;
      }

      // Add test if it's not a duplicate
      setTestList([...testList, { ...selectedTestData }]);
      setSelectedTestData(initalTestData);
    } else {
      dispatch(setError("Some Test Data missing"));
    }
  };

  const submitHandler = async () => {
    if (testList.length > 0 && user?.hospitalID) {
      dispatch(setLoading(true));
      const response = await authPost(
        `test/addlabTestPricing/${user.hospitalID}`,
        { testPricingData: testList },
        user.token
      );

      if (response.status == 200) {
        dispatch(setLoading(false));
        dispatch(setSuccess("Successfully Added"));
        setOpen(!open);
      } else {
        dispatch(setError(response.message));
      }
    } else {
      dispatch(setError("Data is missing"));
    }
  };

  const debounceSubmitHandler = debounce(submitHandler, DEBOUNCE_DELAY);

  const [fetchetestList, setFetechTestsList] = React.useState<
    selectedListType[]
  >([]);

  React.useEffect(() => {
    const getTestsData = async () => {
      const response = await authPost(
        `data/lionicCode`,
        { text: selectedTestData.testName || "" },
        user.token
      );

      const path = location.pathname;

      if (response.message === "success") {
        const testData = response.data;

        // Extract department name from the path (e.g., "/radiology" or "/pathology")
        const departmentFilter = path.includes("radiology")
          ? "Radiology"
          : path.includes("pathology")
          ? "Pathology"
          : "";

        // Filter test data based on department
        const filteredTests = testData.filter(
          (el: { Department: string }) => el.Department === departmentFilter
        );

        // Ensure unique test entries
        const uniqueTests: selectedListType[] = Array.from(
          new Set(
            filteredTests.map(
              (el: {
                id: number;
                LOINC_Code: string;
                LOINC_Name: string;
                Department: string;
              }) => ({
                id: el.id,
                loinc_num_: el.LOINC_Code,
                name: el.LOINC_Name,
                department: el.Department,
              })
            )
          )
        );

        setFetechTestsList(uniqueTests);
      }
    };

    if (selectedTestData.testName && selectedTestData.testName.length >= 1) {
      getTestsData();
    } else {
      setFetechTestsList([]);
    }
  }, [user, selectedTestData.testName, location.pathname]);

  const handleUpdatePrice = async() => {
    if (
      selectedTestData.hsn &&
      selectedTestData.gst &&
      selectedTestData.testPrice &&
      selectedTestData.id
    ) {
      dispatch(setLoading(true));

      const response = await authPost(
        `test/updateLabTestPricing/${user.hospitalID}`,
        { testPricingData: selectedTestData },
        user.token
      );

      if (response.status == 200) {
        dispatch(setLoading(false));
        dispatch(setSuccess("Update Success"));
        setOpen(!open);
      } else {
        dispatch(setError(response.message));
      }
    
    } else {
      dispatch(setError("Some Test Data missing"));
    }
  };

  const handleRemoveTest = (index: number) => {
    setTestList((prevList) => prevList.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (editPriceData) {
      setSelectedTestData({
        testName: editPriceData.testName,
        lonicCode: editPriceData.lonicCode,
        hsn: editPriceData.hsn,
        gst: editPriceData.gst,
        testPrice: editPriceData.testPrice,
        id: editPriceData.labTestID,
      });
    }else{
      setSelectedTestData(initalTestData);
    }
  }, [editPriceData]);

  const renderDirectUi = () => {
    return (
      <>
        <Grid item sm={12} style={{position:"relative"}}>
          <Typography variant="body1" sx={{ fontWeight: "200" }}>
            Enter The Specific Details Of The Test
          </Typography>
          <img style={{height:"155px",width:"200px", position:"absolute" ,right:0,top:-65, zIndex:0}} src={rafiki}/>
        </Grid>

        <Grid item xs={6}>
          <Autocomplete
            freeSolo
            options={fetchetestList}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            disabled={editPriceData?true:false}
            value={selectedTestData.testName}
            onChange={(_, newValue) => {
              const loinc_numFilteredData = fetchetestList?.filter((each) =>
                typeof newValue === "object" && newValue !== null
                  ? each.name === newValue.name
                  : false
              );
              if (loinc_numFilteredData?.length === 1) {
                const testData = loinc_numFilteredData[0];
                setSelectedTestData((prev) => ({
                  ...prev,
                  lonicCode: testData.loinc_num_,
                  id: testData.id,
                }));
              }

              setSelectedTestData((prev) => ({
                ...prev,
                testName:
                  typeof newValue === "string"
                    ? newValue
                    : newValue?.name || "",
              }));
            }}
            inputValue={selectedTestData.testName}
            onInputChange={(_, newInputValue) => {
              setSelectedTestData((prev) => ({
                ...prev,
                testName: newInputValue,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Test Name" fullWidth required />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Lonic Code"
            value={selectedTestData.lonicCode}
            disabled={editPriceData?true:false}
            style={{background:"#ffffff"}}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="HSN"
            value={selectedTestData.hsn}
            onChange={(e) =>
              setSelectedTestData((prev) => ({
                ...prev,

                hsn: e.target.value,
              }))
            }
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="GST"
            type="number"
            value={selectedTestData.gst}
            onChange={(e) =>
              setSelectedTestData((prev) => ({
                ...prev,

                gst: Number(e.target.value),
              }))
            }
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Test Price"
            type="number"
            value={selectedTestData.testPrice}
            onChange={(e) =>
              setSelectedTestData((prev) => ({
                ...prev,

                testPrice: Number(e.target.value),
              }))
            }
            required
          />
        </Grid>

        <Grid item xs={1}>
          {editPriceData ? (
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1977f3",

                padding: "1rem 2rem",
              }}
              onClick={handleUpdatePrice}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#1977f3",

                padding: "1rem 2rem",
              }}
              onClick={addTestToList}
            >
              Add
            </Button>
          )}
        </Grid>
      </>
    );
  };

  return (
    <div>
      <DialogContent>
        <h1 style={{ textAlign: "center" }}>Tests Pricing</h1>

        <Box
          sx={{
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            width: "100%",
            
            margin: "0 auto",
          }}
        >
          <Grid container spacing={2}>
            {renderDirectUi()}

            {/* Test List */}

            {testList.length > 0 && (
              <Grid item xs={12}>
                <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                  <Table>
                    <TableHead style={{ backgroundColor: "#F1F1FD" }}>
                      <TableRow>
                        <TableCell>S:No</TableCell>
                        <TableCell>Test Name</TableCell>
                        <TableCell>Lonic Code</TableCell>
                        <TableCell>HSN</TableCell>
                        <TableCell>GST</TableCell>
                        <TableCell>Test Price</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testList.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data.testName}</TableCell>
                          <TableCell>{data.lonicCode}</TableCell>
                          <TableCell>{data.hsn}</TableCell>
                          <TableCell>{data.gst}</TableCell>
                          <TableCell>{data.testPrice}</TableCell>
                          <TableCell style={{ cursor: "pointer" }}>
                            <Button>
                              <DeleteIcon
                                onClick={() => handleRemoveTest(index)}
                              />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            {/* Save and Close Buttons */}

            {testList.length > 0 && (
              <>
                <Grid item xs={12}>
                  <hr style={{ border: "1px solid gray" }} />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{
                        padding: "0.8rem",
                      }}
                      onClick={() => {
                        setOpen(!open);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#1977f3",

                        padding: "0.8rem 2rem",

                        marginLeft: "1rem",
                      }}
                      onClick={debounceSubmitHandler}
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </div>
  );
};

export default TestPricingModal;
