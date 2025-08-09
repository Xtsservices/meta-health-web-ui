import  React ,{useState} from "react";
import {
  DataGrid,
  GridColDef,
  // GridValueGetterParams,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
// import { GridRenderCellParams } from "@mui/x-data-grid";
// import styles from "./TreatmentTab.module.scss";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import IconButton from "@mui/material/IconButton";
// import NotifyButtonActive from "./../../../../../src/assets/PatientProfile/notify_active.svg";
// import NotifyButtonInActive from "./../../../../../src/assets/PatientProfile/notify_inactive.png";
import { MedicineType } from "../../../../types";
import AddedBy from "../../../DailogBoxs/AddedBy";
import Tooltip from '@mui/material/Tooltip';
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { selectCurrentUser } from "../../../../store/user/user.selector";

// const InputNumber = () => {
//   const [number, setNumber] = React.useState(0);

//   return (
//     <div className={styles.datatable_addSubtractInput}>
//       <IconButton
//         aria-label="delete"
//         size="small"
//         onClick={() => setNumber((pre) => pre + 1)}
//       >
//         <AddIcon fontSize="inherit" />
//       </IconButton>
//       <input type="number" value={number} min={0} />
//       <IconButton
//         aria-label="delete"
//         size="small"
//         disabled={number == 0}
//         onClick={() => setNumber((pre) => pre - 1)}
//       >
//         <RemoveIcon fontSize="inherit" />
//       </IconButton>
//     </div>
//   );
// };
// const MedicationTime = () => {
//   const options = ["Before Food", "After Food", "Before sleep"];
//   return (
//     <div className={styles.datatable_medication}>
//       <select name="filter" id="">
//         {options.map((el) => {
//           return <option value={el}>{el}</option>;
//         })}
//         {/* <option value="Year">Year</option> */}
//       </select>
//     </div>
//   );
// };
// const NotifyButton = () => {
//   const [isNotified, setIsNotified] = React.useState(false);
//   return (
//     <div className={styles.datatable_notify}>
//       <button onClick={() => setIsNotified((el) => !el)}>
//         <img
//           src={isNotified ? NotifyButtonActive : NotifyButtonInActive}
//           alt=""
//         />
//       </button>
//     </div>
//   );
// };

// const columns: GridColDef[] = [
//   { field: "id", headerName: "ID", width: 50 },
//   { field: "firstName", headerName: "First name", width: 160 },
//   { field: "days", headerName: "No. of Days", width: 120 },
//   { field: "dosage", headerName: "Dosage", width: 120 },
//   { field: "medication", headerName: "Medication Time", width: 200 },

// {
//   field: "days",
//   headerName: "No. of Days",
//   sortable: false,
//   renderCell: (params: GridRenderCellParams<Date>) => {
//     console.log(params);
//     return <InputNumber />;
//   },
// },
// {
//   field: "dosage",
//   headerName: "Dosage",
//   sortable: false,
//   renderCell: (params: GridRenderCellParams<Date>) => {
//     console.log(params);
//     return <InputNumber />;
//   },
// },
// {
//   field: "medication",
//   headerName: "Medication Time",
//   sortable: false,
//   renderCell: (params: GridRenderCellParams<Date>) => {
//     console.log(params);
//     return <MedicationTime />;
//   },
//   width: 140,
// },
// {
//   field: "Notification",
//   headerName: "Notify",
//   sortable: false,
//   renderCell: (params: GridRenderCellParams<Date>) => {
//     console.log(params);
//     return <NotifyButton />;
//   },
//   width: 10,
//   // select: false,
// },
// ];

// const rows = [
//   { id: 1, firstName: "Jon", days: 5, dosage: 10, medication: "Before Dinner" },
//   {
//     id: 2,
//     firstName: "Cersei",
//     days: 5,
//     dosage: 10,
//     medication: "Before Dinner",
//   },
//   {
//     id: 3,
//     firstName: "Jaime",
//     days: 5,
//     dosage: 10,
//     medication: "Before Dinner",
//   },
// ];
type rowType = {
  id: number | null | undefined;
  firstName: string;
  days: number | null;
  dosage: string | null;
  medication: string;
};
type dataTableType = {
  medicineList: MedicineType[];
  category: number;
};
export default function DataTable({ medicineList, category }: dataTableType) {
  // const user = useSelector(selectCurrentUser);
  // const dispatch = useDispatch();

  // const [paginationModel, setPaginationModel] = React.useState({
  //   page: 0,
  //   pageSize: 3,
  // });
  const [render, setRender] = React.useState<boolean>(false);

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [filteredList, setFilteredList] = React.useState<MedicineType[]>([]);
  const [showID, setShowID] = useState<number | null>(0);
  React.useEffect(() => {
    setFilteredList(() => {
      const filteredValue = medicineList.filter(
        (el) => el.medicineType == category
      );
      return filteredValue;
    });
  }, [medicineList]);

  const [rows, setRows] = React.useState<rowType[]>([]);

  React.useEffect(() => {
    setRows(
      filteredList.map((medicine) => {
        let unit ;
      
      if (medicine.medicineType === 1 || medicine.medicineType === 3) {
        unit = "mg"
      } else if (medicine.medicineType === 6) {
        unit = "g"
      } else {
        unit = "ml"
      }

  
        return {
          id: medicine.id,
          userID: medicine.userID,
          firstName:
            medicine.medicineName.slice(0, 1).toUpperCase() +
            medicine.medicineName.slice(1).toLowerCase(),
          days: medicine.daysCount,
          dosage: `${medicine.doseCount} ${unit}`, // Add the unit to dosage
          medication: medicine.medicationTime,
        };
      })
    );
  }, [filteredList]);
  

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "userID",
      headerName: "Added By",
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <div
        onClick={()=>{
          setShowID(params.value || 0)
          setRender(!render)
          setTimeout(() => {
            setRender(true)
          }, 100)
        }}
          onMouseEnter={() => setShowID(params.value || 0)}
          style={{ cursor: "pointer" }}
        >
          {params.value}
        </div>
      )},
    { field: "firstName", headerName: "Medicine Name", width: 190 },
    { field: "days", headerName: "Days", width: 110 },
    { field: "dosage", headerName: "Dosage", width: 90 },
    {
      field: "medication",
      headerName: "Medication",
      flex: 1, // Allows the column to grow and shrink as needed
      minWidth: 300, // Minimum width to ensure content is visible
      renderCell: (params: GridRenderCellParams) => {
        const formattedValue = (params.value || "").replace(/,/g, ', ');

        return (
          <Tooltip title={formattedValue} arrow>
            <div
              style={{
                whiteSpace: 'pre-wrap',  // Ensures text wraps within the cell
                wordBreak: 'break-word',  // Breaks long words if necessary
                overflowWrap: 'break-word', // Handles long unbreakable words
                maxWidth: '100%', // Ensures the div does not exceed the column width
                
              }}
            >
              {formattedValue}
            </div>
          </Tooltip>
        );
      },
    },
    
    
    
  
  ];

  return (
    <div style={{ height: "auto", width: "99%" }}>
     {rows.length > 0 ? (
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 3 },
          },
        }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
      />
    ) : (
      <div style={{ textAlign: 'center', padding: '20px', fontSize: '16px' }}>
        No data available
      </div>
    )}

       {/* Added By Dialog op*/}
       {(showID !== 0 && (render)) && <AddedBy userID={showID}/>}
    </div>
  );
}
