import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatDate2 } from "../../../utility/global";
import { ExpenseData } from "../../../utility/medicine";
import styles from "../OrderManagement/OuterTable.module.scss";
import PharmacyExpensesInnerTable from "../pharmacyExpenses/PharmacyExpensesInnerTable";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
interface AddInventoryCardProps {
  data: ExpenseData[];
  setRenderData?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMEdId?: React.Dispatch<React.SetStateAction<number|null>>;
}

const AddInventoryCard = ({ data,setRenderData,setEditMEdId }: AddInventoryCardProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  // const [page, setPage] = useState({ page: 1, limit: 8 });
  const [sortAgencyOrder, setSortingAgencyOrder]  = useState<"asc" | "desc">("asc")
  const [sortManufacturer, setSortingManufacturer] = useState<"asc" | "desc">("asc")
  const [agencyAnchorEl, setAgencyAnchorEl] = useState<null | HTMLElement>(null);
  const [manufacturerAnchorEl, setManufacturerAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<ExpenseData[]>(data);

  const uniqueAgencies = Array.from(new Set(data?.map((item) => item.agencyName)));
  const uniqueManufacturers = Array.from(new Set(data?.map((item) => item.manufacturer)));

  useEffect(() => {
    let filteredResult = data;
  
    if (selectedAgency) {
      filteredResult = filteredResult.filter((item) => item.agencyName === selectedAgency);
    }
    if (selectedManufacturer) {
      filteredResult = filteredResult.filter((item) => item.manufacturer === selectedManufacturer);
    }
  
    setFilteredData(filteredResult);
  }, [data, selectedAgency, selectedManufacturer]);

  const handleAgencyClick = (event: React.MouseEvent<HTMLElement>) => {
  setAgencyAnchorEl(event.currentTarget);
};

const handleManufacturerClick = (event: React.MouseEvent<HTMLElement>) => {
  setManufacturerAnchorEl(event.currentTarget);
};

const handleAgencyClose = () => {
  setAgencyAnchorEl(null);
};

const handleManufacturerClose = () => {
  setManufacturerAnchorEl(null);
};

const handleAgencySelect = (agency: string) => {
  setSelectedAgency(agency);
  handleAgencyClose();
};

const handleManufacturerSelect = (manufacturer: string) => {
  setSelectedManufacturer(manufacturer);
  handleManufacturerClose();
};

const handleResetAgencyFilter = () => {
  setSelectedAgency(null);
  handleAgencyClose();
};

const handleResetManufacturerFilter = () => {
  setSelectedManufacturer(null);
  handleManufacturerClose();
};

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const handleSortingAgency = ()=> {
    setSortingAgencyOrder(sortAgencyOrder=="asc"? "desc": "asc")
  }
  const handleSortingManufaturer = ()=> {
    setSortingManufacturer(sortManufacturer=="asc"? "desc": "asc")
  }

  const sortedData = [...filteredData]
  ?.sort((a, b) => {
    const nameA = a.agencyName ?? ""; 
    const nameB = b.agencyName ?? "";
    return sortAgencyOrder === "asc" 
      ? nameA.localeCompare(nameB) 
      : nameB.localeCompare(nameA);
  })
  ?.sort((a, b) => {
    const manufacturerA = a.manufacturer ?? ""; 
    const manufacturerB = b.manufacturer ?? "";
    return sortManufacturer === "asc"
      ? manufacturerA.localeCompare(manufacturerB)
      : manufacturerB.localeCompare(manufacturerA);
  });

  // const paginatedData = sortedData?.slice(
  //   (page.page - 1) * page.limit,
  //   page.page * page.limit
  // );
  return (
    <div>
      {/* <div className={styles.header}>Add Inventory</div> */}
      <TableContainer component={Paper} className={styles.tableContainer} sx ={{maxHeight:"80vh", overflow:"scroll"}} >
        
        <Table sx={{borderTopLeftRadius:"15px",borderTopRightRadius:"15px"}}>
          <TableHead className={styles.header}>
            <TableRow sx={{position:"sticky", top:0,background:"#1977f3",zIndex:0}} >
              <TableCell style={{ fontWeight: "bold", borderTopLeftRadius:"16px", color:"#ffffff",fontSize:"16px" }}>S:NO</TableCell>
              <TableCell style={{ fontWeight: "bold", color:"#ffffff",fontSize:"16px" }}>User Name</TableCell>
              <TableCell style={{ fontWeight: "bold" , display:"flex", alignItems:"center", color:"#ffffff",fontSize:"16px" }} 
              >Agency Name
              <div style = {{display:"flex",flexDirection:"column", justifyContent:"flex-start"}} onClick={handleAgencyClick}>
              <ArrowDropUpIcon onClick={handleSortingAgency} style ={{ color:"#ffffff"}} /> 
               
              <ArrowDropDownIcon onClick={handleSortingAgency} style ={{marginTop:"-15px", color:"#ffffff"}} />
              </div>

              </TableCell>
              <TableCell style={{ fontWeight: "bold", color:"#ffffff",fontSize:"16px" }}>Contact No</TableCell>
              <TableCell style={{ fontWeight: "bold", color:"#ffffff",fontSize:"16px" }}>Agent Code</TableCell>
              <TableCell style={{ fontWeight: "bold", display:"flex", alignItems:"center", color:"#ffffff",fontSize:"16px"}}
              
              >Manufacture
              <div style = {{display:"flex",flexDirection:"column", justifyContent:"flex-start"}} onClick={handleManufacturerClick}>
              <ArrowDropUpIcon onClick={handleSortingManufaturer} style ={{ color:"#ffffff"}}/>  
              <ArrowDropDownIcon onClick={handleSortingManufaturer} style ={{marginTop:"-15px", color:"#ffffff"}} />
              </div>

              </TableCell>
              <TableCell style={{ fontWeight: "bold", color:"#ffffff",fontSize:"16px" }}>Expiry Date</TableCell>
              <TableCell style={{ fontWeight: "bold", color:"#ffffff",fontSize:"16px" ,borderTopRightRadius:"16px"}}>Action</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length == 0 && (
              <div style={{ textAlign: "center", textTransform: "uppercase" }}>
                <h4>No New Alerts !!</h4>
              </div>
            )}
            {sortedData.length > 0 &&
              sortedData.map((row,index) => (
                <React.Fragment key={row.id}>
                  <TableRow 
                    onClick={() => handleRowClick(index)}
                    style={{ backgroundColor: "#b2caea" }}
                  >
                    <TableCell style ={{fontSize:"15px"}}>{index+1}</TableCell>
                    <TableCell  style ={{fontSize:"15px"}}>{row.firstName + " " + row.lastName}</TableCell>
                    <TableCell style ={{fontSize:"15px"}}>{row.agencyName}</TableCell>
                    <TableCell style ={{fontSize:"15px"}}>{row.contactNo}</TableCell>
                    <TableCell style ={{fontSize:"15px"}}>{row.agentCode}</TableCell>
                    <TableCell style ={{fontSize:"15px"}}>{row.manufacturer}</TableCell>
                    <TableCell  style ={{fontSize:"15px"}}>{formatDate2(row.addedOn)}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        {expandedRow === index ? (
                          <KeyboardArrowUpIcon  style ={{color:"#1977F3"}} />
                        ) : (
                          <KeyboardArrowDownIcon style ={{color:"#1977F3"}} />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        paddingBottom: "1px",
                        paddingTop: "0px",
                      }}
                      colSpan={7}
                    >
                      <Collapse
                        in={expandedRow === index}
                        timeout="auto"
                        unmountOnExit
                      >
                        
                        <Box margin={1}>
                          <PharmacyExpensesInnerTable
                            data={row.medicinesList}
                            isButton={false}
                            parentComponentName={"Inventory"}
                            setRenderData={setRenderData}
                            setEditMEdId={setEditMEdId}
                          />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div className={styles.pagenavigation}>
        Results Per Page
        <select
          name="filter"
          style={{ width: "3rem" ,marginLeft:"1rem"}}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setPage((prevValue) => {
              return { ...prevValue, limit: Number(event.target.value) };
            });
          }}
        >
          <option value={8}>8</option>
          <option value={25}>25</option>
          <option value={data.length}>All</option>
        </select>
        <IconButton
          aria-label="previous"
          disabled={page.page === 1}
          onClick={() => {
            setPage((prevValue) => {
              return { ...prevValue, page: prevValue.page - 1 };
            });
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          aria-label="next"
          disabled={Math.ceil(data.length / page.limit) === page.page}
          onClick={() => {
            setPage((prevValue) => {
              return { ...prevValue, page: prevValue.page + 1 };
            });
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div> */}
      <Menu
        anchorEl={agencyAnchorEl}
        open={Boolean(agencyAnchorEl)}
        onClose={handleAgencyClose}
      >
        {uniqueAgencies.map((agency) => (
          <MenuItem key={agency} onClick={() => handleAgencySelect(agency)}>
            {agency}
          </MenuItem>
        ))}
        <MenuItem onClick={handleResetAgencyFilter}>Reset Agency Filter</MenuItem>
      </Menu>

      <Menu
        anchorEl={manufacturerAnchorEl}
        open={Boolean(manufacturerAnchorEl)}
        onClose={handleManufacturerClose}
      >
        {uniqueManufacturers.map((manufacturer) => (
          <MenuItem key={manufacturer} onClick={() => handleManufacturerSelect(manufacturer)}>
            {manufacturer}
          </MenuItem>
        ))}
        <MenuItem onClick={handleResetManufacturerFilter}>Reset Manufacturer Filter</MenuItem>
      </Menu>
    </div>
  );
};

export default AddInventoryCard;
