import React, { useRef } from "react";
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
import { authPatch } from "../../../../axios/usePatch";
// import { MedicineReminderType } from "../../../../types";
import { medicineCategory } from "../../../../utility/medicine";
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
type selectOption = {
  Currstatus: number;
  id?: number;
  medicineID?: number;
  medicationTime: string | null;
  medicineIndex: number;
  timelineIndex: number;
  setGroupMedicinePercentage: React.Dispatch<
    React.SetStateAction<GroupedReminderPercentage[]>
  >;
  isDisable: boolean;
};

const SelectOption = ({
  Currstatus,
  medicineIndex,
  medicineID,
  medicationTime,
  timelineIndex,
  setGroupMedicinePercentage,
  isDisable,
  id,
}: selectOption) => {
  //   const [status, setStatus] = React.useState("pending");
  // const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const backgroundColor = Currstatus == 1 ? "#1FB84A" : "#8A8A8A";
  const isCustomerCare = location.pathname.includes("customerCare");

  return (
    <select
      name="filter"
      id=""
      value={Currstatus}
      style={{ height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: '5px', background: backgroundColor, color: "white" }}
      disabled={
        isDisable || Currstatus == 1 || Currstatus == 2 || isCustomerCare
        // [timelineIndex].medicine[medicineIndex].doseStatus == 1
      }
      onChange={async (event: React.ChangeEvent<HTMLSelectElement>) => {
        // console.log("timeline");
        // console.log("event is", event.target.value);
        const doseStatus = Number(event.target.value);

        const response = await authPatch(
          `medicineReminder/${id}`,
          {
            userID: user.id,
            doseStatus: event.target.value,
            // medicineID,
            medicineID: medicineID ?? 0,
            medicationTime,
          },
          user.token
        );
        console.log("data remain", response);
        if (response.message == "success") {
          setGroupMedicinePercentage((prev) => {
            prev[timelineIndex].medicine[medicineIndex].doseStatus = doseStatus;
            prev[timelineIndex].medicine[medicineIndex].givenTime = String(
              new Date()
            );
            prev[timelineIndex].medicine[medicineIndex].firstName =
              user.firstName;
            if (doseStatus == 1)
              prev[timelineIndex].percentage =
                (prev[timelineIndex].medicine.filter(
                  (medicine) => medicine.doseStatus == 1
                ).length /
                  prev[timelineIndex].medicine.length) *
                100;
            return [...prev];
          });
        }
      }}
    >
      <option value={0}>Pending</option>
      <option value={1}>Completed</option>
      <option value={2}>Not Required</option>
      {/* <option value="Year">Year</option> */}
    </select>
  );
};

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
  const getMedicineReminderApi = useRef(true);
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
    if (user.token && timeline.id && getMedicineReminderApi.current) {
      getMedicineReminderApi.current = false;
      getMedicineReminder();
    }
  }, [user]);
  React.useEffect(() => {
    console.log("medicine rema", medicineReminder);
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
  // console.log("in group without percentage", groupMedicine);
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
  // console.log("latest group", groupMedicine);

  const isAsperNeed = (timeline: GroupedReminderPercentage) => {
    const asperNessAvailable = timeline.medicine.filter(
      (each) => each.medicationTime == "As Per Need"
    );
    return asperNessAvailable.length > 0 ? true : false;
  };

  // Define the units map
  const medicineUnits = {
    [medicineCategory.capsules]: "mg",
    [medicineCategory.injections]: "ml",
    [medicineCategory.ivLine]: "ml",
    [medicineCategory.syrups]: "ml",
    [medicineCategory.tablets]: "mg",
    [medicineCategory.Tubing]: "ml",  // Assuming 'units' if there's no specific unit
    [medicineCategory.Topical]: "g",
    [medicineCategory.Drops]: "ml",
    [medicineCategory.Spray]: "ml"
  };

  // Determine type and unit based on medicineType

  return (
    <>
      <div className={styles.timeline}>
        <div className={styles.left}>
          <div className={styles.table_head}>
            <div className="">Type</div>
            <div className="">Dose</div>
            <div className="">medicationTime</div>
            <div className="">Medicine Name</div>
            <div className="">Given By</div>
            <div className="">Timestamp</div>
            <div className="">Status</div>
          </div>
          {groupMedicinePercentage.map((timeline, timelineIndex) => {
            return (
              <div className={styles.timeline_card}>
                <div className={styles.header}>
                  {isAsperNeed(timeline) ? (
                    <div className={styles.header_time}>As PerNeed</div>
                  ) : (
                    <div className={styles.header_time}>
                      {new Date(timeline.dosageTime).toLocaleString("en-US", {
                        day: "numeric",
                        month: "short",
                        // hour: "numeric",
                        // minute: "numeric",
                        // hour12: true,
                      })}
                    </div>
                  )}

                  <div className={styles.header_progressbar}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={timeline.percentage}
                    />
                  </div>
                </div>
                {timeline.medicine.map((medicine, medicineIndex) => {
                  console.log("medicinelop", medicine)
                  const unittype = medicineUnits[medicine.medicineType] || "Unknown";

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
                  else if (medicine.medicineType == medicineCategory.Tubing)
                    type = "Tubing";
                  else if (medicine.medicineType == medicineCategory.Topical)
                    type = "Topical";
                  else if (medicine.medicineType == medicineCategory.Drops)
                    type = "Drops";
                  else if (medicine.medicineType == medicineCategory.Spray)
                    type = "Spray";
                  else type = "No data";
                  return (
                    <div
                      className={styles.timeline_medicine}
                      style={{
                        background: `${backgroundColor}`,
                      }}
                    >
                      <p style={{ marginTop: "25px" }}>
                        <CreateIcon
                          medicineType={medicine.medicineType}
                          backgroundColor={backgroundColor}
                        />
                        <p className={styles.medicine_para}> {type}</p>
                      </p>

                      <p
                        className={styles.medicineName_flex_start}
                        style={{ paddingLeft: "35px", boxSizing: "border-box" }}
                      >
                        {medicine.doseCount} {unittype}
                      </p>

                      <p
                        className={styles.medicineName_flex_start}
                        style={{ textAlign: 'left', boxSizing: "border-box" }}
                      >
                        {medicine.medicationTime.split(",")[medicineIndex]}
                      </p>




                      <p
                        className={styles.medicineName_flex_start}
                        style={{ paddingLeft: "35px", boxSizing: "border-box" }}
                      >
                        {medicine.medicineName.slice(0, 1).toUpperCase() +
                          medicine.medicineName.slice(1).toLowerCase()}
                      </p>
                      <p style={{ marginTop: "15px" }}>
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
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }
                          )
                          : "---------"}
                      </p>
                      <SelectOption
                        Currstatus={medicine.doseStatus}
                        id={medicine.id}
                        medicineID={medicine.medicineID}
                        medicationTime={medicine.medicationTime}
                        timelineIndex={timelineIndex}
                        medicineIndex={medicineIndex}
                        setGroupMedicinePercentage={setGroupMedicinePercentage}
                        // isDisable={
                        //   new Date().valueOf() <
                        //   new Date(medicine.dosageTime).valueOf()
                        // }
                        isDisable={
                          new Date().valueOf() <
                          new Date(
                            new Date(medicine.dosageTime).valueOf() - 5 * 60 * 60 * 1000 - 30 * 60 * 1000
                          ).valueOf()
                        }
                      />
                      {/* <select name="" id=""></select> */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* <div className={styles.right}>
          <img src={pills_icon} alt="" />
        </div> */}
      </div>
    </>
  );
}

export default Timeline;

function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
