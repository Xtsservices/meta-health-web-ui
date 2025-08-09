import React from "react";
import { useSelector } from "react-redux";
import PatientCard from "../patientCard/PatientCard";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { PatientCardData } from "../../../types";

interface SearchpatientProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

function Searchpatient({ search, setSearch }: SearchpatientProps) {
  const [allList, setAllList] = React.useState<PatientCardData[]>([]);
  const user = useSelector(selectCurrentUser);

  React.useEffect(() => {
    const getPatientList = async () => {
      setAllList([]);
      const response = await authFetch(
        `test/${user.roleName}/${user.hospitalID}/${user.id}/getAllPatient`,
        user.token
      );
      if (response.message === "success") {
        setAllList(response.patientList);
      }
    };
    if (user.token) getPatientList();
  }, [user]);
  return (
    <>
      {allList
        .filter((el) => String(el.phoneNumber).includes(search))
        .map((patient) => {
          return (
            <PatientCard
              key={patient.patientID}
              patient={patient}
              setSearch={setSearch}
            />
          );
        })}
    </>
  );
}

export default Searchpatient;
