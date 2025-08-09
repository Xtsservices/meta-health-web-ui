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
import { MedicineType } from "../../../../types";
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
  { field: "firstName", headerName: "First name", width: 160 },
  { field: "days", headerName: "No. of Days", width: 120 },
  { field: "dosage", headerName: "Dosage", width: 120 },
  { field: "medication", headerName: "Medication Time", width: 200 },

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
];

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
  dosage: number | null;
  medication: string;
};
type dataTableType = {
  medicineList: MedicineType[];
  category: number;
};
export default function DataTable({ medicineList, category }: dataTableType) {
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  console.log("selected row", rowSelectionModel);
  console.log(medicineList);
  const [filteredList, setFilteredList] = React.useState<MedicineType[]>([]);
  React.useEffect(() => {
    setFilteredList(() => {
      const filteredValue = medicineList.filter(
        (el) => el.medicineType == category
      );
      console.log(filteredValue);
      return filteredValue;
    });
  }, [category, medicineList]);
  const [rows, setRows] = React.useState<rowType[]>([]);
  React.useEffect(() => {
    setRows(
      filteredList.map((medicine) => ({
        id: medicine.id,
        firstName:
          medicine.medicineName.slice(0, 1).toUpperCase() +
          medicine.medicineName.slice(1).toLowerCase(),
        days: medicine.daysCount,
        dosage: medicine.doseCount,
        medication: medicine.medicationTime,
      }))
    );
  }, [filteredList]);
  console.log(rows);
  return (
    <div style={{ height: "auto", width: "99%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 3 },
          },
        }}
        // pageSizeOptions={[5, 10]}
        // checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        // disableRowSelectionOnClick
      />
    </div>
  );
}
