import React from "react";
import styles from "./TreatmentTab.module.scss";
// import CircularProgress, {
//   circularProgressClasses,
//   CircularProgressProps,
// } from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useSelector } from "react-redux";
import { authFetch } from "../../../../axios/useAuthFetch";
// import { authPatch } from "../../../../axios/usePatch";
// import { MedicineReminderType } from "../../../../types";
import { medicineCategory } from "../../../../utility/medicine";
import pills_icon from "./../../../../../src/assets/PatientProfile/pills_gif.gif";
import { Reminder, useMedicineStore } from "../../../../store/zustandstore";
import CreateIcon from "./createIcon";
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  //   width: 100,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

interface GroupedReminder {
  dosageTime: string;
  medicine: Reminder[];
}
interface GroupedReminderPercentage {
  dosageTime: string;
  medicine: Reminder[];
  percentage: number;
}
// const reminders: Reminder[] = [
//   {
//     id: 5,
//     medicineType: 2,
//     medicineName: "med1",
//     userID: null,
//     dosageTime: "2023-07-12T04:00:00.000Z",
//     givenTime: null,
//     doseStatus: 0,
//   },
//   // ... rest of the reminders
//   // (omitted for brevity)
// ];
// type selectOption = {
//   Currstatus: number;
//   id?: number;
//   medicineIndex: number;
//   timelineIndex: number;
//   setGroupMedicinePercentage: React.Dispatch<
//     React.SetStateAction<GroupedReminderPercentage[]>
//   >;
//   isDisable: boolean;
// };

function Timeline() {
  const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const { medicineReminder, setMedicineReminder } = useMedicineStore();

  const [groupMedicine, setGroupMedicine] = React.useState<GroupedReminder[]>(
    []
  );
  const [groupMedicinePercentage, setGroupMedicinePercentage] = React.useState<
    GroupedReminderPercentage[]
  >([]);
  const getMedicineReminder = async () => {
    const response = await authFetch(
      `medicine/${timeline.id}/reminders/all`,
      user.token
    );
    // console.log("all medicine response", response);
    if (response.message == "success") {
      setMedicineReminder(response.reminders.sort(compareDates));
    }
  };
  React.useEffect(() => {
    if (user.token && timeline.id) {
      getMedicineReminder();
    }
  }, []);
  React.useEffect(() => {
    if (medicineReminder.length) {
      const groupedReminders: GroupedReminder[] = medicineReminder.reduce<
        GroupedReminder[]
      >((acc: GroupedReminder[], reminder: Reminder) => {
        const dosageTime = reminder.dosageTime;
        const existingReminder = acc.find(
          (group) => group.dosageTime === dosageTime
        );

        if (existingReminder) {
          existingReminder.medicine.push(reminder);
        } else {
          acc.push({
            dosageTime: dosageTime,
            medicine: [reminder],
          });
        }

        return acc;
      }, []);

      setGroupMedicine(groupedReminders);
    }
  }, [medicineReminder]);
  React.useEffect(() => {
    if (groupMedicine.length) {
      setGroupMedicinePercentage(
        groupMedicine.map((group) => {
          const percentage =
            (group.medicine.filter((medicine) => medicine.doseStatus == 1)
              .length /
              group.medicine.length) *
            100;
          return { ...group, percentage };
        })
      );
    }
  }, [groupMedicine]);
  return (
    <>
      <div className={styles.timeline}>
        <div className={styles.left}>
          <div className={styles.table_head}>
            <div className="">Type</div>
            <div className={styles.medicineName_flex_start}>Medicine Name</div>
            <div className="">Given By</div>
            <div className="">Timestamp</div>
            <div className="">Status</div>
          </div>
          {groupMedicinePercentage.map((timeline) => {
            return (
              <div className={styles.timeline_card}>
                <div className={styles.header}>
                  <div className={styles.header_time}>
                    {new Date(timeline.dosageTime).toLocaleString("en-US", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                  <div className={styles.header_progressbar}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={timeline.percentage}
                    />
                  </div>
                </div>
                {timeline.medicine.map((medicine) => {
                  let type: string;
                  let backgroundColor: string;
                  if (medicine.medicineType == medicineCategory.capsules) {
                    backgroundColor = "#FFF0DA";
                  } else if (medicine.medicineType == medicineCategory.syrups) {
                    backgroundColor = "#E6F2FE";
                  } else {
                    backgroundColor = "#E4F8F8";
                  }

                  if (medicine.medicineType == medicineCategory.capsules)
                    type = "Capsules";
                  else if (medicine.medicineType == medicineCategory.injections)
                    type = "Injections";
                  else if (medicine.medicineType == medicineCategory.ivLine)
                    type = "ivLine";
                  else if (medicine.medicineType == medicineCategory.syrups)
                    type = "Syrups";
                  else if (medicine.medicineType == medicineCategory.tablets)
                    type = "Tablets";
                  else type = "No data";
                  return (
                    <div
                      className={styles.timeline_medicine}
                      style={{
                        background: `${backgroundColor}`,
                      }}
                    >
                      <p>
                        <CreateIcon
                          medicineType={medicine.medicineType}
                          backgroundColor={backgroundColor}
                        />
                        <p className={styles.medicine_para}> {type}</p>
                      </p>
                      <p
                        className={styles.medicineName_flex_start}
                        style={{ paddingLeft: "10px", boxSizing: "border-box" }}
                      >
                        {medicine.medicineName.slice(0, 1).toUpperCase() +
                          medicine.medicineName.slice(1).toLowerCase()}
                      </p>
                      <p>
                        {medicine?.firstName
                          ? medicine?.firstName?.slice(0, 1)?.toUpperCase() +
                            medicine?.firstName?.slice(1)?.toLowerCase()
                          : "---------"}
                      </p>
                      {/* <p>Dose: {medicine.}</p> */}
                      {/* <p>Nurse: {medicine.nurse || "No data"}</p> */}
                      <p>
                        {medicine.givenTime
                          ? new Date(medicine.givenTime).toLocaleString(
                              "en-US",
                              {
                                // day: "numeric",
                                // month: "short",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )
                          : "---------"}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className={styles.right}>
          <img src={pills_icon} alt="" />
        </div>
      </div>
    </>
  );
}

export default Timeline;

function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
