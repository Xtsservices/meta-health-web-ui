import {
  BarChart,
  Bar,
  Cell,
  LabelList,
  XAxis,
  Label,
  Tooltip,
  PieChart,
  Pie,
  YAxis,
} from "recharts";

import expiryAlert from "../../../assets/pharmacy/expiryAlert.png";
import styles from "./PharmacyDashboard.module.scss";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { formatDate2 } from "../../../utility/global";
import ReorderMedicineModal from "./ReorderMedicineModal";
import { setLoading } from "../../../store/error/error.action";
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import reorderIcon from "../../../assets/pharmacy/buttons/reorderIcon.png";
import replaceIcon from "../../../assets/pharmacy/buttons/replaceIcon.png";
import no_data_in_dashboard from "../../../assets/pharmacy/pharmacyBanners/no_data_in_dashboard.png";
import no_medicines_in_dashboard from "../../../assets/pharmacy/pharmacyBanners/medicalconsuption.png";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface ExpiredMedicineData {
  id: number;
  name: string;
  quantity: number;
  totalQuantity: number;
  expiryDate: string;
  category: string;
  isChecked?: boolean;
  hsn: string;
}

interface LowStock {
  id: number;
  name: string;
  quantity: number;
  totalQuantity: number;
  isChecked?: boolean;
  isOutofStock?: boolean;
  category: string;
}

interface SelectedMedicineData {
  id: number | null;
  name: string;
  category: string;
  quantity: number;
  agencyName: string | null;
  contactNo: string | null;
  email: string | null;
  agentCode: number | null;
  manufacturer: string | null;
  location: string | null;
}

interface ManufacturerData {
  gst: number | null;
  agencyName: string;
  contactNo: string;
  email: string;
  agentCode: number | null;
  manufacturer: string;
}

const PharmacyDashboard = () => {
  const [openLowStockModal, setopenLowStockModal] = useState(false);
  const [openReplaceModal, setopenReplaceModal] = useState(false);
  const [lowStockMedicineData, setLowStockMedicineData] = useState<LowStock[]>(
    []
  );
  const [newOrdermedicineList, setNewOrdermedicineList] = useState<
    SelectedMedicineData[]
  >([]);
  const [newReplacemedicineList, setNewReplacemedicineList] = useState<
    SelectedMedicineData[]
  >([]);
  const [manufactureData, setManufactureData] = useState<ManufacturerData[]>(
    []
  );
  const [reorderIds, setReorderIds] = useState<number[]>([]);
  const [replaceOrderIds, setReplaceOrderIds] = useState<number[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);

  const [departmentConsumption, setDepartmentConsumption] = useState<
    PieChartData[]
  >([]);
  const [expiredMedicineData, setExpiredMedicineData] = useState<
    ExpiredMedicineData[]
  >([]);

  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setIsModalOpen(false); // Close modal after selection
  };

  useEffect(() => {
    const getMedicinesInfo = async () => {
      const formattedFromDate = dayjs(startDate).format("YYYY-MM-DD");
      const formattedToDate = endDate
        ? dayjs(endDate).format("YYYY-MM-DD")
        : formattedFromDate; // Default to fromDate if null
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${user.hospitalID}/getMedicinesInfo?fromDate=${formattedFromDate}&toDate=${formattedToDate}`,
        user.token
      );
      if (response.status == 200) {
        setPieChartData([
          {
            name: "Expired",
            value: Math.max(0, Number(response?.data?.expiryPrice)),
            color: "orange",
          },
          {
            name: "Used",
            value: Math.max(0, Number(response?.data?.usedPrice)),
            color: "skyblue",
          },
          {
            name: "In Stock",
            value: Math.max(0, Number(response?.data?.inStockPrice)),
            color: "green",
          },
        ]);
      }
    };

    if (user.hospitalID) {
      getMedicinesInfo();
    }
  }, [user.hospitalID, user.token, startDate, endDate]);

  const [startDateDepartmental, setStartDateDepartmental] =
    useState<Date | null>(new Date());
  const [endDateDepartmental, setEndDateDepartmental] = useState<Date | null>(
    new Date()
  );
  const [isModalOpenDepartmental, setIsModalOpenDepartmental] = useState(false);
  const datePickerRef = useRef<any>(null);
  const datePickerRefDept = useRef<any>(null);

  const handleDateChangeDepartmental = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDateDepartmental(start);
    setEndDateDepartmental(end);
    setIsModalOpenDepartmental(false);
  };

  // =====getDepartmentConsumption======
 
  useEffect(() => {
    const getDepartmentConsumption = async () => {
      const formattedFromDate = dayjs(startDateDepartmental).format(
        "YYYY-MM-DD"
      );
      const formattedToDate = endDateDepartmental
        ? dayjs(endDateDepartmental).format("YYYY-MM-DD")
        : formattedFromDate; // Default to fromDate if null

      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${user.hospitalID}/getDepartmentConsumption/${formattedFromDate}/${formattedToDate}`,
        user.token
      );
      if (response.status == 200) {
        setDepartmentConsumption([
          {
            name: "Out Patient",
            value: response?.data?.[0]?.outPatient
              ? Math.round(Number(response.data[0].outPatient))
              : 0,
            color: "#f9b995",
          },
          {
            name: "In Patient",
            value: response?.data?.[0]?.inPatient
              ? Math.round(Number(response.data[0].inPatient))
              : 0,
            color: "#c0e4ff",
          },
          {
            name: "Emergency",
            value: response?.data?.[0]?.emergency
              ? Math.round(Number(response.data[0].emergency))
              : 0,
            color: "#f99f99",
          },
        ]);
      }
    };

    if (user.hospitalID) {
      getDepartmentConsumption();
    }
  }, [user.hospitalID, user.token, startDateDepartmental, endDateDepartmental]);

  useEffect(() => {
    dispatch(setLoading(true));
    const getManufactureData = async () => {
      const response = await authFetch(
        `medicineInventoryManufacture/${user.hospitalID}/getAllManufacture`,
        user.token
      );
      if (response.status == 200) {
        setManufactureData(response.data);
        dispatch(setLoading(false));
      }
    };

    if (user.hospitalID) {
      getManufactureData();
    }
  }, [dispatch, user.hospitalID, user.token]);

  useEffect(() => {
    const getExpiryProductInfo = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${user.hospitalID}/getExpiryProductInfo`,
        user.token
      );
      if (response.status == 200) {
        setExpiredMedicineData(response.data);
      }
    };

    if (user.hospitalID) {
      getExpiryProductInfo();
    }
  }, [user.hospitalID, user.token]);

  useEffect(() => {
    const getLowStockProductInfo = async () => {
      const response = await authFetch(
        `/medicineInventoryPatientsOrder/${user.hospitalID}/getLowStockProductInfo`,
        user.token
      );
      if (response.status == 200) {
        setLowStockMedicineData(response.data);
      }
    };

    if (user.hospitalID) {
      getLowStockProductInfo();
    }
  }, [user.hospitalID, user.token]);

  const CustomBar = (props: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
  }) => {
    const { x, y, width, height, fill } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={10}
          ry={10}
        />
      </g>
    );
  };

  //==========================expired product start =======================

  const handleReplaceStockDrugStatus = (medId: number) => {
    setReplaceOrderIds((prevIds) => {
      // If medId exists, remove it; otherwise, add it
      return prevIds.includes(medId)
        ? prevIds.filter((id) => id !== medId) // Remove if exists
        : [...prevIds, medId]; // Add if not exists
    });
  };

  useEffect(() => {
    if (replaceOrderIds && expiredMedicineData) {
      // Filter the lowStockMedicineData to include only items with IDs in reorderIds
      const filteredIdsData = expiredMedicineData
        .filter((each) => replaceOrderIds.includes(each.id))
        .map((each) => ({
          id: each.id,
          name: each.name,
          category: each.category,
          quantity: each.quantity,
          agencyName: null,
          contactNo: null,
          email: null,
          agentCode: null,
          manufacturer: null,
          location: null,
        }));

      // Set the transformed data to the state
      setNewReplacemedicineList(filteredIdsData);
    } else {
      // If reorderIds is empty or undefined, clear the newOrdermedicineList
      setNewReplacemedicineList([]);
    }
  }, [replaceOrderIds, expiredMedicineData]);

  //======================expired product END ===========================

  //======================lowstock product start ===========================

  const handleLowStockDrugStatus = (medId: number) => {
    setReorderIds((prevIds) => {
      // If medId exists, remove it; otherwise, add it
      return prevIds.includes(medId)
        ? prevIds.filter((id) => id !== medId) // Remove if exists
        : [...prevIds, medId]; // Add if not exists
    });
  };

  useEffect(() => {
    if (reorderIds && lowStockMedicineData) {
      // Filter the lowStockMedicineData to include only items with IDs in reorderIds
      const filteredIdsData = lowStockMedicineData
        .filter((each) => reorderIds.includes(each.id))
        .map((each) => ({
          id: each.id,
          name: each.name,
          category: each.category,
          quantity: each.quantity,
          agencyName: null,
          contactNo: null,
          email: null,
          agentCode: null,
          manufacturer: null,
          location: null,
        }));

      // Set the transformed data to the state
      setNewOrdermedicineList(filteredIdsData);
    } else {
      // If reorderIds is empty or undefined, clear the newOrdermedicineList
      setNewOrdermedicineList([]);
    }
  }, [reorderIds, lowStockMedicineData]);
  console.log(lowStockMedicineData);

  //======================lowstock product END md:order-last===========================

  //================== after api call Replace or Reorder
  const handleClearData = (message: string) => {
    if (message === "close") {
      setopenLowStockModal(false);
      setopenReplaceModal(false);
    } else {
      // navigate to order placement
      navigate("/hospital-dashboard/pharmacy/expenses");
    }
  };
  console.log("lowStockMedicineData", lowStockMedicineData);
  return (
    <div className={styles.homeMainContainer}>
      <div className={styles.subContainer}>
        <div className={styles.container}>
          <div className={styles.conatinerHeader}>
            <h3 style={{ fontWeight: 600, fontSize: "16px" }}>
              Medication Consumption
            </h3>
            <div className={styles.iconsContainer}>
              <div className={styles.calendar} style={{ marginRight: "2px" }}>
                <CalendarTodayIcon
                  
                />
                <div className={styles.datePickerContainer}>
                  <DatePicker
                    ref={datePickerRefDept}
                    selected={startDateDepartmental}
                    onChange={(dates: [Date | null, Date | null]) => {
                      const [start, end] = dates;
                      setStartDateDepartmental(start);
                      setEndDateDepartmental(end);
                    }}
                    startDate={startDateDepartmental || undefined}
                    endDate={endDateDepartmental || undefined}
                    selectsRange
                    isClearable
                    placeholderText="Select a date range"
                    className={styles.datePicker}
                    calendarClassName={styles.calendar}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.barChartMainContainer}>
            <div className={styles.barChartSubContainer}>
              {departmentConsumption?.some((item) => item.value > 0) ? (
                <>
                  <div>
                    <BarChart
                      width={250}
                      height={300}
                      data={departmentConsumption}
                    >
                      <XAxis dataKey="n">
                        <Label
                          value="Medicine Consumption"
                          offset={0}
                          position="insideBottom"
                        />
                      </XAxis>
                      <YAxis
                        hide={true}
                        label={{
                          value: "Amount",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        color="color"
                        shape={(props: any) => <CustomBar {...props} />}
                      >
                        <LabelList dataKey="value" position="top" />
                        {departmentConsumption.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </div>

                  <ul className={styles.barcharUl}>
                    <li>
                      <button className={styles.opd}></button>
                      <span>Out Patient</span>
                    </li>

                    <li>
                      <button className={styles.ipd}></button>
                      <span>In Patient</span>
                    </li>

                    <li>
                      <button className={styles.emergency}></button>
                      <span>Emergency</span>
                    </li>
                  </ul>
                </>
              ) : (
                <div className={styles.no_products_found_container}>
                  <img
                    src={no_medicines_in_dashboard}
                    alt="no data image"
                    style={{ width: "150px" }}
                  />
                  <p className={styles.nodata}>
                    No Medication Consumptions on this date
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ========================Medicine Inventory===================== */}
        <div className={styles.containerLg}>
          <div className={styles.conatinerHeader}>
            <h3 style={{ fontWeight: 600, fontSize: "16px" }}>
              Medicine Inventory
            </h3>

            <div className={styles.iconsContainer}>
            <div className={styles.calendar} style={{ marginRight: "0.5rem" }}>
        <CalendarTodayIcon  />
        <div className={styles.datePickerContainer}>
                <DatePicker
                  ref={datePickerRef}
                  selected={startDate}
                  onChange={(dates: [Date | null, Date | null]) => {
                    const [start, end] = dates;
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  selectsRange
                  isClearable
                  placeholderText="Select a date range"
                  className={styles.datePicker}
                  calendarClassName={styles.calendar}
                  maxDate={new Date()}
                />
              </div>
      </div>

    </div>

          </div>
          <div className={styles.barChartMainContainer}>
            <div className={styles.barChartSubContainer}>
              {pieChartData?.some((item) => item.value > 0) ? (
                <>
                  <div>
                    <PieChart width={400} height={300}>
                      <Pie
                        data={pieChartData}
                        cx={204} // Center X coordinate (half of width)
                        cy={140} // Center Y coordinate (half of height)
                        outerRadius={80} // Adjust radius to fit within the height
                        fill="#8884d8"
                        dataKey="value"
                        labelLine={false}
                        label={
                          ({ name, value }) =>
                            value > 0 ? `${name}: ${value}` : null // Show value only if > 0
                        }
                        minAngle={10} // Ensure small segments are visible
                      >
                        {pieChartData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}`} />
                    </PieChart>
                  </div>

                  {/* Keep the <ul> section for color indicators and names */}
                  <ul className={styles.barcharUl}>
                    <li>
                      <button className={styles.dotOrange}></button>
                      <span>Expired</span>
                    </li>
                    <li>
                      <button className={styles.dotBlue}></button>
                      <span>Used</span>
                    </li>
                    <li>
                      <button className={styles.dotGreen}></button>
                      <span>In Stock</span>
                    </li>
                  </ul>
                </>
              ) : (
                <div className={styles.no_products_found_container}>
                  <img
                    src={no_medicines_in_dashboard}
                    alt="no data image"
                    style={{ width: "150px" }}
                  />
                  <p className={styles.nodata}>
                    No Medicines Inventory on this date
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ============================EXPIRED PRODUCT , PRODUCTS WITH LOW STOCKS======================== */}
      <div className={styles.subContainer}>
        {/* ============================EXPIRED PRODUCT======================== */}
        <div className={styles.containerLg}>
          <div className={styles.expiredProductMainContainer}>
            <div className={styles.expiredProductContainer}>
              <h3 style={{ fontWeight: 600, fontSize: "16px" }}>
                Expired Products
              </h3>
            </div>
            {expiredMedicineData?.length > 0 ? (
              <TableContainer
                sx={{
                  borderBottomRightRadius: "20px",
                  borderBottomLeftRadius: "20px",
                  scrollbarWidth: "thin", // Standard scrollbar width for Firefox
                  scrollbarColor: "gray transparent", // gray scrollbar thumb, transparent track (for Firefox)
                  height: "300px", // Adjust height
                  overflowY: "auto", // Enables vertical scrolling
                  borderBottom: "none",
                  "&::-webkit-scrollbar": {
                    width: "0px", // Adjust width
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1", // Track color
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "gray", // **Red scrollbar**
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "darkred", // Darker red on hover
                  },
                }}
                component={Paper}
                elevation={0}
              >
                <Table>
                  {/* Table Head */}
                  <TableHead className={styles.tableHeadings}>
                    <TableRow>
                      <TableCell style={{ fontWeight: 700, fontSize: "16px" }}>
                        Drug Name
                      </TableCell>
                      <TableCell style={{ fontWeight: 700, fontSize: "16px" }}>
                        Expiry Date
                      </TableCell>
                      <TableCell style={{ fontWeight: 700, fontSize: "16px" }}>
                        Qty
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell style={{ fontWeight: 700, fontSize: "15px" }}>
                        Select
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  {/* Table Body */}
                  <TableBody>
                    {expiredMedicineData.map((each) => (
                      <TableRow key={each.id}>
                        <TableCell style={{ fontSize: "15px" }}>
                          {each.name}
                        </TableCell>
                        <TableCell style={{ fontSize: "15px" }}>
                          {formatDate2(each.expiryDate)}
                        </TableCell>
                        <TableCell style={{ fontSize: "15px" }}>
                          {each.totalQuantity}
                        </TableCell>
                        <TableCell>
                          <img src={expiryAlert} alt="expired alert image" />
                        </TableCell>
                        <TableCell>
                          
                          <input
                            type="checkbox"
                            checked={each.isChecked}
                            onChange={() =>
                              handleReplaceStockDrugStatus(each.id)
                            }
                            style={{width:"17px",height:"17px"}}
                            className={styles.checkbox_styling}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Button for replacing expired medicines */}
              </TableContainer>
            ) : (
              <div className={styles.no_products_found_container}>
                <img
                  src={no_data_in_dashboard}
                  alt="no data image"
                  style={{ width: "150px" }}
                />
                <p className={styles.nodata}>No expired products found.</p>
              </div>
            )}
            <div className={styles.order_reorder_button_Style}>
              <button
                className={styles.reorderbutton}
                onClick={() => setopenReplaceModal(true)}
              >
                <img src={replaceIcon} alt="replace icon" />
                Replace
              </button>
            </div>
          </div>
        </div>

        {/* ============================PRODUCTS WITH LOW STOCKS======================== */}

        <div className={styles.containerLg}>
          <div className={styles.lowStockMainContainer}>
            <div className={styles.lowStockContainer}>
              <h3 style={{ fontWeight: 600, fontSize: "16px" }}>
                Products with Low Stocks
              </h3>
            </div>

            {lowStockMedicineData?.length > 0 ? (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderBottomRightRadius: "20px",
                  borderBottomLeftRadius: "20px",
                  height: "300px",
                  overflowY: "auto",
                  scrollbarWidth: "thin", // Standard scrollbar width for Firefox
                  scrollbarColor: "gray transparent", // gray scrollbar thumb, transparent track (for Firefox)

                  "&::-webkit-scrollbar": {
                    width: "2px", // Adjust width
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent", // Track color
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "red", // **Red scrollbar thumb**
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "darkred", // Darker red on hover
                  },
                }}
              >
                <Table>
                  {/* Table Head */}
                  <TableHead className={styles.tableHeadings}>
                    <TableRow>
                      <TableCell style={{ fontWeight: 700, fontSize: "16px" }}>
                        Drug Name
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell style={{ fontWeight: 700, fontSize: "16px" }}>
                        Qty
                      </TableCell>
                      <TableCell style={{ fontWeight: 700, fontSize: "16px" }}>
                        Select
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  {/* Table Body */}
                  <TableBody>
                    {lowStockMedicineData.map((each) => (
                      <TableRow key={each.id}>
                        <TableCell style={{ fontSize: "15px" }}>
                          {each.name}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            style={{
                              backgroundColor:
                                each.quantity == 0 ? "#F35757" : "#D0CE61",
                              textTransform: "none",
                              color: "#fff",
                              boxShadow: "none",
                              borderRadius: "10px",
                              width: "100px",
                            }}
                          >
                            {each.quantity == 0 ? "Out of stock" : "Low stock"}
                          </Button>
                        </TableCell>
                        <TableCell style={{ fontSize: "15px" }}>
                          {each.totalQuantity}
                        </TableCell>
                        <TableCell>
                        <input
                            type="checkbox"
                            checked={each.isChecked}
                            onChange={() =>
                              handleLowStockDrugStatus(each.id)
                            }
                            style={{width:"17px",height:"17px"}}
                            className={styles.checkbox_styling}
                          />
                          
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className={styles.no_products_found_container}>
                <img
                  src={no_data_in_dashboard}
                  alt="no data image"
                  style={{ width: "150px" }}
                />
                <p className={styles.nodata}>
                  No expired products found. Everything is up to date
                </p>
              </div>
            )}
            <div className={styles.order_reorder_button_Style}>
              <button
                className={styles.reorderbutton}
                onClick={() => setopenLowStockModal(true)}
              >
                <img src={reorderIcon} alt="reorder icon" />
                Reorder
              </button>
            </div>
          </div>
        </div>
      </div>

      {openLowStockModal && (
        <ReorderMedicineModal
          isOpen={openLowStockModal}
          handleClearData={handleClearData}
          medData={newOrdermedicineList}
          manufactureData={manufactureData}
          heading={"RE-ORDER MEDICINE"}
        />
      )}

      {/* MUI Modal for Date Picker */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            outline: "none",
            minWidth: "320px",
            textAlign: "center",
          }}
        >
          <h3>Select a Date Range</h3>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            selectsRange
            isClearable
            placeholderText="Select a date range"
            inline
            maxDate={new Date()}
          />
          <div style={{ marginTop: "10px" }}>
            <Button variant="contained" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </Paper>
      </Modal>

      <Modal
        open={isModalOpenDepartmental}
        onClose={() => setIsModalOpenDepartmental(false)}
      >
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            outline: "none",
            minWidth: "320px",
            textAlign: "center",
          }}
        >
          <h3>Select a Date Range</h3>
          <DatePicker
            selected={startDateDepartmental}
            onChange={handleDateChangeDepartmental}
            startDate={startDateDepartmental || undefined}
            endDate={endDateDepartmental || undefined}
            selectsRange
            isClearable
            placeholderText="Select a date range"
            inline
            maxDate={new Date()}
          />
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              onClick={() => setIsModalOpenDepartmental(false)}
            >
              Close
            </Button>
          </div>
        </Paper>
      </Modal>

      {openReplaceModal && (
        <ReorderMedicineModal
          isOpen={openReplaceModal}
          handleClearData={handleClearData}
          medData={newReplacemedicineList}
          manufactureData={manufactureData}
          heading={"RE-PLACE MEDICINE"}
        />
      )}
    </div>
  );
};

export default PharmacyDashboard;
