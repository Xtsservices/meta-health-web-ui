import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import styles from "./notification.module.scss";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import gelatin_icon from "./../../../../src/assets/gelatin_icon.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { MedicineReminderType } from "../../../types";
import { formatDate } from "../../../utility/global";
// import { medicineCategory } from "../../../utility/medicine";
// import { authPatch } from "../../../axios/usePatch";
// import { setError, setSuccess } from "../../../store/error/error.action";
// import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import MedicineCard from "./MedicineCard";
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
  // console.log("from notify", timelineID);
  const [reminders, setReminders] = React.useState<remindersType | null>(null);
  const [dateArray, setDateArray] = React.useState<Array<keyof remindersType>>(
    []
  );
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [firstUpcoming, setFirstUpcoming] = React.useState<number>(0);
  const [activeTimeIndex, setActiveTimeIndex] = React.useState(-1);
  const [isDisabled] = React.useState(false);
  // const [medicineTypeButton, setMedicineTypeButton] = React.useState(1);
  const getNotificationData = async () => {
    // console.log(`medicine/${timelineID}/reminders/all/notifications`);
    const notificationResponse = await authFetch(
      `medicine/${timelineID}/reminders/all/notifications`,
      user.token
    );
    console.log("notfication response", notificationResponse);
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
        // console.log(reminders[date]);
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
      // console.log("final group", finalGroupReminder);
      setReminderGroup(finalGroupReminder);
    }
  }, [reminders, dateArray]);
  // console.log("final group reminder", reminderGroup);

  ////////////////////////control Group reminder/////////////////////////////
  React.useEffect(() => {
    // console.log(
    //   "reminder active",
    //   reminderGroup[activeIndex]?.sort(compareDates)
    // );
    console.log(
      "new group here it is",
      reminderGroup,
      activeIndex,
      firstUpcoming
    );
    reminderGroup[activeIndex]?.sort(compareDates).forEach((el, index) => {
      // console.log(new Date(el.dosageTime).valueOf() > Date.now());
      if (
        el.dosageTime &&
        new Date(el.dosageTime).valueOf() > Date.now() &&
        firstUpcoming == -1
      ) {
        console.log("dosage", el.dosageTime);
        setFirstUpcoming(index);
        return;
      }
    });
  }, [activeIndex, reminderGroup]);
  // console.log("first upcomig", firstUpcoming);
  // React.useEffect(() => {
  //   setMedicineTypeButton(
  //     reminderGroup?.[activeIndex]?.sort(compareDates)?.[
  //       activeTimeIndex == -1 && activeIndex == 0
  //         ? firstUpcoming && firstUpcoming - 1
  //         : activeTimeIndex
  //     ]?.reminders[0]?.medicineType || 1
  //   );
  // }, [activeTimeIndex, activeIndex, reminderGroup, firstUpcoming]);


  return (
    <div style={{width:"100%",backgroundColor:"red"}}>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
        style={{width:"100%"}}
      >
        <DialogTitle>
          Treatment Notification <br />
          <p style={{ margin: 0, fontSize: "15px" }}>Patient Name: {name}</p>
        </DialogTitle>
        <DialogContent >
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
