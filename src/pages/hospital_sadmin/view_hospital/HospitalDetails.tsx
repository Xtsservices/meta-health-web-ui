import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import styles from "./HospitalDetails.module.scss";
import BasicTabs from "./Tab";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { capitalizeFirstLetter } from "./../../../utility/global";

interface Hospital {
  id: number;
  name: string;
  website: string | null;
  phoneNo: string;
  address: string;
  city: string;
  state: string | null;
  addedOn: string | null;
  lastModified: string;
  parent: string;
  country: string;
  pinCode: string;
  email: string;
  isDeleted: number;
}

interface HospitalDetailsProps {
  hospital: Hospital | null;
}

const initialState: HospitalDetailsProps = {
  hospital: null,
};

function HospitalDetails() {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<HospitalDetailsProps>(initialState);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        // console.log('Fetching hospital with ID:', id);
        const response = await authFetch(`/hospital/${id}`, user.token);
        // console.log("API Response:", response);

        if (response && response.message === "success" && response.hospital) {
          setState({
            hospital: response.hospital,
          });
        } else {
          console.error("Invalid API response:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user.token) {
      fetchHospital();
    }
  }, [user.token, id]);
  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <h3>
          <IconButton aria-label="delete" onClick={() => navigate("../.")}>
            <ArrowBackIosIcon />
          </IconButton>
        </h3>
      </div>
      <div className={styles.profile_container}>
        <div className={styles.profile_info}>
          <div className={styles.profile_info_left}>
            {/* <p>Hospital Name: <b>{state.hospital?.name}</b></p> */}
            <p>
              Hospital Name:{" "}
              <b>
                {state.hospital?.name
                  ? capitalizeFirstLetter(state.hospital.name)
                  : "N/A"}
              </b>
            </p>
            <p>
              Hospital Id: <b>{state.hospital?.id}</b>{" "}
            </p>
            <p>
              Hospital Group:{" "}
              <b>
                {state.hospital?.parent
                  ? capitalizeFirstLetter(state.hospital.parent)
                  : "N/A"}
              </b>
            </p>
            <p>
              Address:{" "}
              <b>
                {state.hospital?.address
                  ? capitalizeFirstLetter(state.hospital.address)
                  : "N/A"}
              </b>
            </p>
          </div>
        </div>
        <div className={styles.profile_info_right}>
          <p>
            {" "}
            Phone No:{" "}
            <b>{state.hospital?.phoneNo ? state.hospital.phoneNo : "N/A"}</b>
          </p>
          <p>
            Email: <b>{state.hospital?.email ? state.hospital.email : "N/A"}</b>
          </p>
          <p>
            {" "}
            Website:{" "}
            <b>{state.hospital?.website ? state.hospital.website : "N/A"}</b>
          </p>
          <p>
            {" "}
            <b>
              {state.hospital?.city
                ? capitalizeFirstLetter(state.hospital.city)
                : "N/A"}
              ,{" "}
              {state.hospital?.state
                ? capitalizeFirstLetter(state.hospital.state)
                : "N/A"}
              ,{" "}
              {state.hospital?.country
                ? capitalizeFirstLetter(state.hospital.country)
                : "N/A"}{" "}
              - {state.hospital?.pinCode}
            </b>
          </p>
        </div>
      </div>
      <div className={styles.profile_tabs}>
        <BasicTabs />
      </div>
    </div>
  );
}

export default HospitalDetails;
