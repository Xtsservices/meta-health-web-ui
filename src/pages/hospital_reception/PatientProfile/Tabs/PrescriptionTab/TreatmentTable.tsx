import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { prescriptionDataType } from "../../../../../types";

type RowType = {
  id: number | null | undefined;
  userID: number | null;
  medicine: string;
  medicineDuration: number | null;
  meddosage: number | null;
  medicineTime: string;
  medicineStartDate: string;
};

type DataTableProps = {
  prescriptionData: prescriptionDataType[];
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
};

const DataTable: React.FC<DataTableProps> = ({ prescriptionData }) => {
  const [render, setRender] = useState<boolean>(false);
  const [, setShowID] = useState<number | null>(0);
  const [rows, setRows] = useState<RowType[]>([]);
  const [page] = useState<number>(0);
  const [pageSize] = useState<number>(3);
  const [, setTotalRows] = useState<number>(0);

  useEffect(() => {
    if (Array.isArray(prescriptionData)) {
      setRows(
        prescriptionData.map((medicineData) => ({
          id: medicineData.id,
          userID: medicineData.userID ?? 0,
          medicine: medicineData.medicine,
          medicineDuration:
            medicineData.medicineDuration !== null
              ? Number(medicineData.medicineDuration)
              : null,
          meddosage: medicineData.meddosage,
          medicineTime: medicineData.medicineTime,
          medicineStartDate: formatDate(medicineData.medicineStartDate),
        }))
      );
      setTotalRows(prescriptionData.length);
    }
  }, [prescriptionData]);

  // const handlePageChange = (newPage: number) => {
  //   setPage(newPage);
  // };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "userID",
      headerName: "Added By",
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <div
          onClick={() => {
            setShowID(params.value || 0);
            setRender(!render);
            setTimeout(() => {
              setRender(true);
            }, 100);
          }}
          onMouseEnter={() => setShowID(params.value || 0)}
          style={{ cursor: "pointer" }}
        >
          {params.value}
        </div>
      ),
    },
    { field: "medicine", headerName: "Medicine Name", width: 200 },
    { field: "medicineDuration", headerName: "Days", width: 90 },
    { field: "meddosage", headerName: "Dosage", width: 90 },
    {
      field: "medicineTime",
      headerName: "Medication Time",
      width: 290,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            minHeight: "50px",
            paddingTop: "10px",
          }}
        >
          {params.value.split(",").map((time: string, index: number) => (
            <span key={index}>
              {time.trim()}
              {index < params.value.split(",").length - 1 && ", "}
            </span>
          ))}
        </div>
      ),
    },

    {
      field: "medicineStartDate",
      headerName: "Medicine StartDate",
      width: 150,
    },
  ];

  return (
    <div style={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={rows.slice(page * pageSize, page * pageSize + pageSize)}
        columns={columns}
        pagination
        //   components={{
        //     Pagination: () => (
        //       <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
        //       </div>
        //     ),
        //   }}
      />
      {/* {showID !== 0 && render && <AddedBy userID={showID} />} */}
    </div>
  );
};

export default DataTable;
