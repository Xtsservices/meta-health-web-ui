import { useEffect, useState } from "react";
import styles from "./DoctorManagement.module.scss";
import DoctorProfileCard from "./DoctorProfileCard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

type Doctor = {
  id: number;
  name: string;
  department: string;
  qualification: string;
  experience: string;
  designation: string;
  doctorImage: string;
  availability: { fromTime: string; toTime: string };
};

const sampledocData: Doctor[] = [
  {
    id: 1,
    name: "Pavan Kumar",
    department: "IPD",
    availability: { fromTime: "2023-11-10 09:00", toTime: "2023-11-10 10:30" },
    doctorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    qualification: "MBBS, MD General Medicine",
    experience: "10 years",
    designation: "Senior Consultant",
  },
  {
    id: 2,
    name: "Rajesh Singh",
    department: "OPD",
    availability: { fromTime: "2023-11-10 10:45", toTime: "2023-11-10 12:15" },
    doctorImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7",
    qualification: "MBBS, DNB",
    experience: "8 years",
    designation: "Consultant",
  },
  {
    id: 3,
    name: "Sneha Sharma",
    department: "EMERGENCY",
    availability: { fromTime: "2023-11-10 12:30", toTime: "2023-11-10 14:00" },
    doctorImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    qualification: "MBBS, MS",
    experience: "12 years",
    designation: "Head of Emergency",
  },
  {
    id: 4,
    name: "Amit Patel",
    department: "IPD",
    availability: { fromTime: "2023-11-10 14:15", toTime: "2023-11-10 15:45" },
    doctorImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7",
    qualification: "MBBS, MD",
    experience: "15 years",
    designation: "Senior Physician",
  },
  {
    id: 5,
    name: "Neha Gupta",
    department: "OPD",
    availability: { fromTime: "2023-11-10 16:00", toTime: "2023-11-10 17:30" },
    doctorImage: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    qualification: "MBBS, DGO",
    experience: "7 years",
    designation: "Gynecologist",
  },
  {
    id: 6,
    name: "Manoj Verma",
    department: "OPD",
    availability: { fromTime: "2023-11-10 17:45", toTime: "2023-11-10 19:15" },
    doctorImage: "https://images.unsplash.com/photo-1615859136440-b61848b2bff5",
    qualification: "MBBS, DNB",
    experience: "6 years",
    designation: "Orthopedic Consultant",
  },
  {
    id: 7,
    name: "Ravi Kumar",
    department: "IPD",
    availability: { fromTime: "2023-11-10 09:30", toTime: "2023-11-10 11:00" },
    doctorImage: "https://images.unsplash.com/photo-1541071789492-d1fe66d6f519",
    qualification: "MBBS, MD",
    experience: "9 years",
    designation: "Cardiologist",
  },
  {
    id: 8,
    name: "Priya Mehta",
    department: "EMERGENCY",
    availability: { fromTime: "2023-11-10 14:30", toTime: "2023-11-10 16:00" },
    doctorImage: "https://images.unsplash.com/photo-1573497019813-6f081ec2b41f",
    qualification: "MBBS, MD",
    experience: "11 years",
    designation: "Emergency Medicine Specialist",
  },
  {
    id: 9,
    name: "Vijay Yadav",
    department: "OPD",
    availability: { fromTime: "2023-11-10 16:15", toTime: "2023-11-10 17:45" },
    doctorImage: "https://images.unsplash.com/photo-1521908180003-246bf5c01f24",
    qualification: "MBBS, MS",
    experience: "5 years",
    designation: "General Surgeon",
  },
  {
    id: 10,
    name: "Sushila Devi",
    department: "IPD",
    availability: { fromTime: "2023-11-10 11:15", toTime: "2023-11-10 12:45" },
    doctorImage: "https://images.unsplash.com/photo-1591994950004-bcbad45845d5",
    qualification: "MBBS, DGO",
    experience: "13 years",
    designation: "Obstetrician and Gynecologist",
  },
  {
    id: 11,
    name: "Anil Kumar",
    department: "OPD",
    availability: { fromTime: "2023-11-10 13:00", toTime: "2023-11-10 14:30" },
    doctorImage: "https://images.unsplash.com/photo-1607477126799-254b42ac55b8",
    qualification: "MBBS, MS",
    experience: "14 years",
    designation: "Urologist",
  },
  {
    id: 12,
    name: "Sunita Sharma",
    department: "IPD",
    availability: { fromTime: "2023-11-10 18:00", toTime: "2023-11-10 19:30" },
    doctorImage: "https://images.unsplash.com/photo-1570562999299-1e5b52f33a24",
    qualification: "MBBS, MD",
    experience: "10 years",
    designation: "Pediatrician",
  },
  {
    id: 13,
    name: "Deepak Singh",
    department: "EMERGENCY",
    availability: { fromTime: "2023-11-10 19:45", toTime: "2023-11-10 21:15" },
    doctorImage: "https://images.unsplash.com/photo-1601748155671-53783c0c2329",
    qualification: "MBBS, MD",
    experience: "7 years",
    designation: "Emergency Specialist",
  },
  {
    id: 14,
    name: "Nisha Gupta",
    department: "OPD",
    availability: { fromTime: "2023-11-10 09:00", toTime: "2023-11-10 10:30" },
    doctorImage: "https://images.unsplash.com/photo-1604152871574-b93994cba833",
    qualification: "MBBS, DGO",
    experience: "8 years",
    designation: "Gynecologist",
  },
  {
    id: 15,
    name: "Rohit Reddy",
    department: "IPD",
    availability: { fromTime: "2023-11-10 10:45", toTime: "2023-11-10 12:15" },
    doctorImage: "https://images.unsplash.com/photo-1593642532878-d8a1e1d3488f",
    qualification: "MBBS, MS",
    experience: "16 years",
    designation: "Orthopedic Surgeon",
  },
];

const DoctorManagement = () => {
  const [doctorsList, setDoctorList] = useState<Doctor[]>([]);
  const user = useSelector(selectCurrentUser);
  const [page, setPage] = useState({
    limit: 10,
    page: 1,
  });

  const [dataTable, setDataTable] = useState<Doctor[]>([]);

  const getAllList = async () => {
    setDoctorList(sampledocData);
    // Uncomment to fetch real data
    // const doctorResponse = await authFetch(
    //   `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
    //   user.token
    // );
    // if (doctorResponse.message == "success") {
    //   setDoctorList(doctorResponse.users);
    // }
  };

  useEffect(() => {
    if (user.token) {
      getAllList();
    }
  }, [user.token]);

  useEffect(() => {
    // Calculate the start and end index for slicing based on page and limit
    const startIndex = (page.page - 1) * page.limit;
    const endIndex = startIndex + page.limit;
    const paginatedData = doctorsList.slice(startIndex, endIndex);
    setDataTable(paginatedData);
  }, [page, doctorsList]);

  const totalPages = Math.ceil(doctorsList.length / page.limit);

  return (
    <div className={styles.container}>
      <h1 className={styles.list_of_doctor}>List of doctors</h1>
      <div className={styles.doctor_card_scroll_container}>

      <div className={styles.doctorCards}>
        {dataTable.map((doc) => (
          <DoctorProfileCard
            key={doc.id}
            doctorImage={doc.doctorImage}
            name={doc.name}
            department={doc.department}
            qualification={doc.qualification}
            experience={doc.experience}
            designation={doc.designation}
          />
        ))}
      </div>
      {dataTable?.length > 0 && (
        <div className={styles.page_navigation}>
          Results Per Page
          <select
            name="filter"
            style={{width:'15%'}}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setPage((prevValue) => ({
                ...prevValue,
                limit: Number(event.target.value),
                page: 1, // Reset to first page on limit change
              }));
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={doctorsList.length}>All</option>
          </select>
          <IconButton
            aria-label="previous"
            disabled={page.page === 1}
            onClick={() => {
              setPage((prevValue) => ({
                ...prevValue,
                page: prevValue.page - 1,
              }));
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <span>
            Page {page.page} of {totalPages}
          </span>
          <IconButton
            aria-label="next"
            disabled={page.page === totalPages}
            onClick={() => {
              setPage((prevValue) => ({
                ...prevValue,
                page: prevValue.page + 1,
              }));
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      )}
      </div>
    </div>
  );
};

export default DoctorManagement;
