import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError, setSuccess } from "../../../store/error/error.action";
import { selectCurrentUser } from "../../../store/user/user.selector";
import styles from "./MedicineCard.module.scss";
import Capsule_icon_svg from "../../../assets/reception/svgIcons/capsule_icon_svg";
import TabletSvg from "../../../assets/PatientProfile/tablet_svg";
import TopicalSvg from "../../../assets/PatientProfile/topical_svg";
import TubeSvg from "../../../assets/PatientProfile/tube_svg";
import SpraySvg from "../../../assets/PatientProfile/spray_svg";
import DropSvg from "../../../assets/PatientProfile/drops_sv";
import SyrupsSvg from "../../../assets/PatientProfile/syrups_svg";
import InjectionSvg from "../../../assets/PatientProfile/injection_svg";
import FrameSvg from "../../../assets/PatientProfile/frame_svg";
import Ventilator_svg from "../../../assets/ventilator";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { MedicineReminderType } from "../../../types";

type reminderGroup = {
  dosageTime: string;
  reminders: MedicineReminderType[];
  percentage?: number;
};

type MedicineCardProps = {
  medicineType: string;
  medicineName: string;
  timeOfMedication: string | undefined;
  timestamp?: string;
  status: "Completed" | "Pending" | "Not Required";
  day: string | null | undefined;
  medicineID: number | null; // Added for the API call
  activeIndex: number; // To be passed down
  indexTime: number; // To be passed down
  reminderGroup: reminderGroup[][];
};

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicineType,
  medicineName,
  timeOfMedication,
  timestamp = "------",
  status,
  day,
  medicineID,
  activeIndex,
  indexTime,
}) => {
  const user = useSelector(selectCurrentUser); // Access the current user from Redux store
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(status); // Store the selected status locally
  const [isDisabled, setIsDisabled] = useState(false); // Track the state of the button

  const getMedicineStyle = () => {
    let backgroundColor = "#ffffff";
    let IconComponent: React.ReactNode = null;

    switch (medicineType) {
      case "Capsules":
        backgroundColor = "#FFF0DA";
        IconComponent = <Capsule_icon_svg fill="#FFF0DA" rect="grey" />;
        break;
      case "Syrups":
        backgroundColor = "#E6F2FE";
        IconComponent = <SyrupsSvg fill="#E6F2FE" rect="grey" />;
        break;
      case "Tablets":
        backgroundColor = "#E4F8F8";
        IconComponent = <TabletSvg fill="#E4F8F8" rect="grey" />;
        break;
      case "Injections":
        backgroundColor = "#E4F8F8";
        IconComponent = <InjectionSvg fill="#E4F8F8" rect="grey" />;
        break;
      case "Tubing":
        backgroundColor = "#E4F8F8";
        IconComponent = <TubeSvg fill="#E4F8F8" rect="grey" />;
        break;
      case "Topical":
        backgroundColor = "#E4F8F8";
        IconComponent = <TopicalSvg fill="#E4F8F8" rect="grey" />;
        break;
      case "Drops":
        backgroundColor = "#E4F8F8";
        IconComponent = <DropSvg fill="#E4F8F8" rect="grey" />;
        break;
      case "Spray":
        backgroundColor = "#E4F8F8";
        IconComponent = <SpraySvg fill="#E4F8F8" rect="grey" />;
        break;
      case "IV Line":
        backgroundColor = "#E4F8F8";
        IconComponent = <FrameSvg fill="#E4F8F8" rect="grey" />;
        break;
      case "Ventilator":
        backgroundColor = "#E4F8F8";
        IconComponent = <Ventilator_svg fill="#E4F8F8" rect="grey" />;
        break;
      default:
        backgroundColor = "#ffffff";
        IconComponent = null;
    }

    return { backgroundColor, IconComponent };
  };

  const { backgroundColor, IconComponent } = getMedicineStyle();

  

  const [reminderGroup, setReminderGroup] = React.useState<reminderGroup[][]>(
    []
  );

  const handleSubmit = async () => {
    setIsDisabled(true);
    const obj = {
      userID: user.id,
      doseStatus:
        selectedStatus === "Completed"
          ? 1
          : selectedStatus === "Pending"
          ? 2
          : 2,
      note: "",
    };

    const response = await authPatch(
      `medicineReminder/${medicineID}`,
      obj,
      user.token
    );

    if (response.message === "success") {
      dispatch(setSuccess("Updated successfully"));
      const percentage =
        (reminderGroup[activeIndex][indexTime].reminders.filter(
          (medicine) => medicine.doseStatus == 1
        ).length /
          reminderGroup[activeIndex][indexTime].reminders.length) *
        100;
      setReminderGroup((prev) => {
        prev[activeIndex][indexTime].percentage = percentage;
        return [...prev];
      });
    } else {
      dispatch(setError(response.message));
    }
    setIsDisabled(false);
  };

  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "Completed" | "Pending" | "Not Required";
    setSelectedStatus(newStatus);
    debouncedHandleSubmit(); // Trigger submit automatically
  };

  return (
    <div className={styles.medicine_container} style={{ backgroundColor }}>
      <div className={styles.medicine_type_section}>
        <div className={styles.image_container}>{IconComponent}</div>
        <h3>{medicineType}</h3>
        <div className={styles.medicine_day_info}>
          <h4>
            <span>{day?.split("/")?.[0] || "?"}</span> of{" "}
            {day?.split("/")?.[1] || "?"}
          </h4>
        </div>
      </div>

      <div className={styles.medicine_table}>
        <div className={styles.medicine_header}>
          <div className={styles.medicine_column}>Medicine Name</div>
          <div className={styles.medicine_column}>Time of Medication</div>
          <div className={styles.medicine_column}>Timestamp</div>
          <div className={styles.medicine_column}>Status</div>
        </div>

        <div className={styles.medicine_row}>
          <div className={styles.medicine_column}>
            <h4>{medicineName}</h4>
          </div>
          <div className={styles.medicine_column}>
            <h4>{timeOfMedication}</h4>
          </div>
          <div className={styles.medicine_column}>
            <h4>{timestamp}</h4>
          </div>
          <div className={styles.medicine_column}>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              disabled={isDisabled}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Not Required">Not Required</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
