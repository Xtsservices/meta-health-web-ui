import { useContext, useEffect, useRef, useState } from "react";
import TriageFormContext, {
  GetTriageFormDataObject,
} from "../contexts/TriageFormContext";
import styles from "./TriageZoneFinal.module.scss";
import { BounceLoader } from "react-spinners";
import { zoneType } from "../../../../utility/role";
import { authPost } from "../../../../axios/useAuthPost";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../../utility/global";

const spinnerColor = {
  [zoneType.red]: "#ff6f61",
  [zoneType.yellow]: "#ffdf61",
  [zoneType.green]: "#61ff76",
};

const finalBoxColors = {
  [zoneType.red]: "#c43232",
  [zoneType.yellow]: "#fdcb19",
  [zoneType.green]: "#209116",
};

const ZoneFinalBox = ({
  backgroundColor,
  zone,
}: {
  backgroundColor: string;
  zone: string;
}) => {
  return (
    <div
      style={{
        backgroundColor,
        boxShadow: zone === "red" ? "0px 0px 15px rgba(196, 50, 50, 0.9)" : "",
      }}
      className={styles.final_box}
    >
      {zone === "red" && (
        <img src="/src/assets/triage/alert.svg" width={40} alt="alert red" />
      )}
      {zone !== "red" && (
        <img src="/src/assets/triage/person.svg" width={40} alt="person" />
      )}
      <p>Patient is Under {capitalizeFirstLetter(zone)}  Zone</p>
    </div>
  );
};

const TriageZone = () => {
  const { formData } = useContext(TriageFormContext);
  const [apiCalled, setApiCalled] = useState(false);
  const zone = formData && formData.zone ? formData.zone : zoneType.green;
  const zoneName =
    zone === zoneType.red
      ? "red"
      : zone === zoneType.yellow
      ? "yellow"
      : "green";
  const color = zone ? spinnerColor[zone] : "#c6c4ee";
  const user = useSelector(selectCurrentUser);
  const triagePostRef = useRef(true);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && formData && !apiCalled && triagePostRef.current) {
      setApiCalled(true);
      const data = GetTriageFormDataObject(formData) as any;

      data.zone = String(data?.zone) || String(zoneType.green);
      data.hospitalID = user.hospitalID;
      data.userID = user.id;
      const fn = async () => {
        try {
          const res = await authPost(
            `triage/${user.hospitalID}/${id}`,
            data,
            user.token
          );
          if (res.message === "success") {
            setIsLoading(false);
          } else console.log("Error", res);
        } catch (error) {
          console.log("triage error", error);
        }
      };
      fn();
      triagePostRef.current = false;
    }
  }, [user, formData, apiCalled, id]);

  useEffect(() => {
    if (!isLoading)
      setTimeout(() => {
        navigate("/hospital-dashboard/triage/list");
      }, 1000);
  }, [isLoading, navigate]);

  return (
    <div className={styles.container}>
      <h3 className={styles.container_title}>Triage Zone</h3>
      <div className={styles.container_center}>
        {isLoading && <p>Patient is being processed under {zoneName} zone</p>}
        {!isLoading && (
          <ZoneFinalBox
            backgroundColor={finalBoxColors[zone]}
            zone={zoneName}
          />
        )}
        <BounceLoader
          color={color}
          size={60}
          loading={isLoading}
          speedMultiplier={0.8}
        />
      </div>
    </div>
  );
};

export default TriageZone;
