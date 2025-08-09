import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import styles from "./Notification.module.scss";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import gelatin_icon from "@/assets/gelatin_icon.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
// import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { authFetch } from "../../../../axios/useAuthFetch";
import { MedicineReminderType } from "../../../../types";
import { formatDate } from "../../../../utility/global";
// import { authPatch } from "../../../../axios/usePatch";
// import { setError, setSuccess } from "../../../../store/error/error.action";
import MedicineCard from "../../../hospital_staff/InpatientList/MedicineCard";
type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timelineID: number | undefined;
  name: string;
};
const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "1000px",
  },
});
type remindersType = {
  [date: string]: MedicineReminderType[];
};
type reminderGroup = {
  dosageTime: string;
  reminders: MedicineReminderType[];
  percentage?: number;
};
// const daysOfWeek = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];
export default function NotificationDialog({
  open,
  setOpen,
  timelineID,
  name,
}: propType) {
  const handleClose = () => {
    setOpen(false);
  };
  const user = useSelector(selectCurrentUser);
  // const dispatch = useDispatch();
  const [reminders, setReminders] = React.useState<remindersType | null>(null);
  const [dateArray, setDateArray] = React.useState<Array<keyof remindersType>>(
    []
  );
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [firstUpcoming, setFirstUpcoming] = React.useState<number>(-1);
  const [activeTimeIndex, setActiveTimeIndex] = React.useState(-1);
  const [isDisabled] = React.useState(false);
  // const [medicineTypeButton, setMedicineTypeButton] = React.useState(1);
  const getNotificationData = async () => {
    const notificationResponse = await authFetch(
      `medicine/${timelineID}/reminders/all/notifications`,
      user.token
    );
    if (notificationResponse.message == "success") {
      setReminders(notificationResponse.reminders);
    }
  };
  React.useEffect(() => {
    if (reminders) setDateArray(Object.keys(reminders));
  }, [reminders]);
  ///////////////////////////////////
  ////////////////////////////////
  React.useEffect(() => {
    if (user.token) {
      getNotificationData();
    }
  }, [user, timelineID]);
  const classes = useStyles();
  const [reminderGroup, setReminderGroup] = React.useState<reminderGroup[][]>(
    []
  );

  //////////////////////////////
  /////////////////////////////
  React.useEffect(() => {
    if (reminders) {
      const finalGroupReminder: reminderGroup[][] = [];
      dateArray?.forEach((date: keyof remindersType) => {
        const groupedReminders: reminderGroup[] = reminders[date]?.reduce<
          reminderGroup[]
        >((acc: reminderGroup[], reminder: MedicineReminderType) => {
          const dosageTime = reminder.dosageTime;
          const existingReminder = acc.find(
            (group) => group.dosageTime === dosageTime
          );

          if (existingReminder) {
            existingReminder.reminders.push(reminder);
          } else {
            acc.push({
              dosageTime: dosageTime,
              reminders: [reminder],
            });
          }

          return acc;
        }, []);

        if (groupedReminders?.length) {
          const newArray: reminderGroup[] = groupedReminders?.map((group) => {
            const percentage =
              (group.reminders.filter((medicine) => medicine.doseStatus == 1)
                .length /
                group.reminders.length) *
              100;
            return { ...group, percentage };
          });
          finalGroupReminder.push(newArray);
        }
      });
      setReminderGroup(finalGroupReminder);
    }
  }, [reminders, dateArray]);

  ////////////////////////control Group reminder/////////////////////////////
  React.useEffect(() => {
    reminderGroup[activeIndex]?.sort(compareDates).forEach((el, index) => {
      if (
        el.dosageTime &&
        new Date(el.dosageTime).valueOf() > Date.now() &&
        firstUpcoming == -1
      ) {
        setFirstUpcoming(index);
        return;
      }
    });
  }, [activeIndex, reminderGroup]);
  // React.useEffect(() => {
  //   setMedicineTypeButton(
  //     reminderGroup?.[activeIndex]?.sort(compareDates)?.[
  //       activeTimeIndex == -1 && activeIndex == 0
  //         ? firstUpcoming && firstUpcoming - 1
  //         : activeTimeIndex
  //     ]?.reminders[0]?.medicineType || 1
  //   );
  // // }, [activeTimeIndex, activeIndex, reminderGroup, firstUpcoming]);
  // type submitType = {
  //   userID: number;
  //   doseStatus: number;
  //   note: string;
  // };
  // const handleSubmit = async (
  //   medicineID: number,
  //   obj: submitType,
  //   activeIndex: number,
  //   indexTime: number
  //   // medicineIndex: number
  // ) => {
  //   setIsDisabled(true);
  //   const response = await authPatch(
  //     `medicineReminder/${medicineID}`,
  //     obj,
  //     user.token
  //   );
  //   if (response.message == "success") {
  //     dispatch(setSuccess("Updated successfully"));
  //     const percentage =
  //       (reminderGroup[activeIndex][indexTime].reminders.filter(
  //         (medicine) => medicine.doseStatus == 1
  //       ).length /
  //         reminderGroup[activeIndex][indexTime].reminders.length) *
  //       100;
  //     setReminderGroup((prev) => {
  //       prev[activeIndex][indexTime].percentage = percentage;
  //       return [...prev];
  //     });
  //   } else {
  //     dispatch(setError(response.message));
  //   }
  //   setIsDisabled(false);
  // };
  // const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>
          Treatment Notification <br />
          <p style={{ margin: 0, fontSize: "15px" }}>Patient Name: {name}</p>
        </DialogTitle>
        <DialogContent>
          <div className={styles.container}>
            <div className={styles.container_date}>
              {/* Buttons for Date and Day Start */}
              {dateArray.map((el, index) => {
                return (
                  <button
                    className={index == activeIndex ? styles.active : ""}
                    onClick={() => {
                      setActiveIndex(index);
                      if (index > 0) {
                        setActiveTimeIndex(0);
                      } else {
                        setActiveTimeIndex(-1);
                      }
                    }}
                    disabled={isDisabled}
                  >
                    {formatDate(String(el))} 
                  </button>
                );
              })}
              {/* Buttons for Date and Day End */}
            </div>
            <div className={styles.container_main}>
              <div className={styles.container_main_medicine_bar}>
                <div className={styles.header}>
                  <h3>Medicine Details</h3>
                  <div className={styles.current_time}>
                    {new Date().toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                </div>
                {/* <div className={styles.options}>
                  <button
                    className={
                      medicineTypeButton == medicineCategory.tablets
                        ? styles.active
                        : ""
                    }
                    onClick={() =>
                      setMedicineTypeButton(medicineCategory.tablets)
                    }
                  >
                    Tablet
                  </button>
                  <button
                    className={
                      medicineTypeButton == medicineCategory.capsules
                        ? styles.active
                        : ""
                    }
                    onClick={() =>
                      setMedicineTypeButton(medicineCategory.capsules)
                    }
                  >
                    Capsule
                  </button>
                  <button
                    className={
                      medicineTypeButton == medicineCategory.syrups
                        ? styles.active
                        : ""
                    }
                    onClick={() =>
                      setMedicineTypeButton(medicineCategory.syrups)
                    }
                  >
                    Syrup
                  </button>
                  <button
                    className={
                      medicineTypeButton == medicineCategory.injections
                        ? styles.active
                        : ""
                    }
                    onClick={() =>
                      setMedicineTypeButton(medicineCategory.injections)
                    }
                  >
                    Injection
                  </button>
                  <button
                    className={
                      medicineTypeButton == medicineCategory.ivLine
                        ? styles.active
                        : ""
                    }
                    onClick={() =>
                      setMedicineTypeButton(medicineCategory.ivLine)
                    }
                  >
                    IV Line
                  </button>
                </div> */}
                <div className={styles.medicines}>
                  {reminderGroup?.[activeIndex]
                    ?.sort(compareDates)
                    ?.[
                      activeTimeIndex == -1 && activeIndex == 0
                        ? firstUpcoming && firstUpcoming - 1
                        : activeTimeIndex
                    ]?.reminders.map((medicine) => {
                      // Prepare the medicine data to pass to MedicineCard
                      const formattedMedicineName =
                        medicine.medicineName.slice(0, 1).toUpperCase() +
                        medicine.medicineName.slice(1).toLocaleLowerCase();
                      const formattedTimestamp = medicine.dosageTime
                        ? new Date(medicine.dosageTime).toLocaleString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }
                          )
                        : "";

                      const status =
                        medicine.doseStatus === 0
                          ? "Pending"
                          : medicine.doseStatus === 1
                          ? "Completed"
                          : "Not Required";

                      return (
                        <MedicineCard
                          key={medicine?.id}
                          medicineID={medicine?.id} 
                          activeIndex={activeIndex}
                          indexTime={activeTimeIndex} 
                          medicineType="Tablets"
                          medicineName={formattedMedicineName}
                          timeOfMedication={medicine?.medicationTime} 
                          timestamp={formattedTimestamp}
                          status={status}
                          day={medicine?.day}
                          reminderGroup={reminderGroup}
                        />
                      );
                    })}

                  {/* ///////////////////////////////////////
                  ///////////////////////////////////////////////// */}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {/* <Button onClick={handleClose} variant="contained">
            Save
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

function compareDates(a: reminderGroup, b: reminderGroup) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
