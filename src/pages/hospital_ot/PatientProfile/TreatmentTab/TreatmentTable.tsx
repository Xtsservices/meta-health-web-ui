import * as React from "react";
import {
  DataGrid,
  GridColDef,
  // GridValueGetterParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
// import { GridRenderCellParams } from "@mui/x-data-grid";

// import styles from "./TreatmentTab.module.scss";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import IconButton from "@mui/material/IconButton";
// import NotifyButtonActive from "./../../../../../src/assets/PatientProfile/notify_active.svg";
// import NotifyButtonInActive from "./../../../../../src/assets/PatientProfile/notify_inactive.png";
import { prescriptionDataType } from "../../../../types";
import { styled } from "@mui/material/styles";

const StyledDataGrid = styled(DataGrid)(() => ({
  // Add your custom styles here
  "&.custom-data-grid .MuiDataGrid-root .MuiDataGrid-footer .MuiTablePagination-root":
    {
      display: "none",
    },
}));

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
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "medicineName", headerName: "Medicine Name", width: 160 },
  { field: "days", headerName: "No. of Days", width: 120 },
  { field: "dosage", headerName: "Dosage", width: 120 },
  { field: "medicineTime", headerName: "Medication Time", width: 200 },
];

type rowType = {
  id: number | null | undefined;
  days: string;
  dosage: string;
  medicineName: string;
  medicineTime: string;
};
type dataTableType = {
  prescriptionData: prescriptionDataType;
};
export default function DataTable({ prescriptionData }: dataTableType) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  
  // const [filteredList, setFilteredList] = React.useState<MedicineType[]>([]);
  const [rows, setRows] = React.useState<rowType[]>([]);
  React.useEffect(() => {
    setRows(
      prescriptionData.medicine.split(",").map((_, index) => {
        return {
          id: index + 1,
          days: prescriptionData.medicineDuration.split(",")[index] || "",
          dosage: prescriptionData.medicineFrequency.split(",")[index] || "",
          medicineName: prescriptionData.medicine.split(",")[index] || "",
          medicineTime: prescriptionData.medicineTime.split(",")[index] || "",
        };
      })
    );
  }, [prescriptionData]);
  return (
    <div style={{ height: "auto", width: "100%" }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        // pageSizeOptions={[5, 10]}
        // checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        // disableRowSelectionOnClick
      />
    </div>
  );
}
