import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@mui/styles';
import styles from './notification-dialog.module.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import gelatin_icon from './../../../../src/assets/gelatin_icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/user/user.selector';
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { authFetch } from '../../../axios/useAuthFetch';
import { MedicineReminderType } from '../../../types';
import { formatDate } from '../../../utility/global';
// import { medicineCategory } from "../../../utility/medicine";
import { authPatch } from '../../../axios/usePatch';
import { setError, setSuccess } from '../../../store/error/error.action';
type propType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timelineID: number;
  name: string;
};
const useStyles = makeStyles({
  dialogPaper: {
    width: '800px',
    minWidth: '1000px',
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
const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
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
  const dispatch = useDispatch();
  // console.log("from notify", timelineID);
  const [reminders, setReminders] = React.useState<remindersType | null>(null);
  const [dateArray, setDateArray] = React.useState<Array<keyof remindersType>>(
    []
  );
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [firstUpcoming, setFirstUpcoming] = React.useState<number>(-1);
  const [activeTimeIndex, setActiveTimeIndex] = React.useState(-1);
  const [isDisabled, setIsDisabled] = React.useState(false);
  // const [medicineTypeButton, setMedicineTypeButton] = React.useState(1);
  const getNotificationData = async () => {
    // console.log(`medicine/${timelineID}/reminders/all/notifications`);
    const notificationResponse = await authFetch(
      `medicine/${timelineID}/reminders/all/notifications`,
      user.token
    );
    // console.log("notfication response", notificationResponse);
    if (notificationResponse.message == 'success') {
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
   
    reminderGroup[activeIndex]?.sort(compareDates).forEach((el, index) => {
      // console.log(new Date(el.dosageTime).valueOf() > Date.now());
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
  type submitType = {
    userID: number;
    doseStatus: number;
    note: string;
  };
  const handleSubmit = async (
    medicineID: number,
    obj: submitType,
    activeIndex: number,
    indexTime: number
    // medicineIndex: number
  ) => {
    setIsDisabled(true);
    const response = await authPatch(
      `medicineReminder/${medicineID}`,
      obj,
      user.token
    );
    // console.log(obj, `medicineReminder/${medicineID}`);
    if (response.message == 'success') {
      dispatch(setSuccess('Updated successfully'));
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
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>
          Treatment Notification <br />
          <p style={{ margin: 0, fontSize: '15px' }}>{name}</p>
        </DialogTitle>
        <DialogContent>
          <div className={styles.container}>
            <div className={styles.container_date}>
              {dateArray.map((el, index) => {
                return (
                  <button
                    className={index == activeIndex ? styles.active : ''}
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
            </div>
            <div className={styles.container_main}>
              <div className={styles.container_main_timebar}>
                <h4>
                  {
                    daysOfWeek[
                      new Date(
                        reminderGroup[activeIndex]?.[0].dosageTime || ''
                      ).getDay()
                    ]
                  }
                  |{' '}
                  <span>
                    {new Date(
                      reminderGroup[activeIndex]?.[0].dosageTime || ''
                    ).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </h4>
                {reminderGroup[activeIndex]
                  ?.sort(compareDates)
                  .map((group, index) => {
                    let classname = '';
                    if (index >= firstUpcoming - 1) classname = 'normal_button';

                    if (index <= firstUpcoming - 2)
                      classname = 'inactive_button';
                    if (
                      activeTimeIndex == -1 && activeIndex == 0
                        ? firstUpcoming - 1 == index
                        : activeTimeIndex == index
                    )
                      classname = 'active_button';
                    // console.log("first upcoming", firstUpcoming, classname);
                    return (
                      <button
                        className={styles[classname]}
                        onClick={() => setActiveTimeIndex(index)}
                        disabled={isDisabled}
                      >
                        <div className={styles.left}>
                          <div className={styles.time}>
                            {group.dosageTime
                              ? new Date(group.dosageTime).toLocaleString(
                                  'en-US',
                                  {
                                    // day: "numeric",
                                    // month: "short",
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                  }
                                )
                              : ''}
                          </div>
                          <div className={styles.status}>
                            {group.percentage == 100
                              ? 'Completed'
                              : new Date(group.dosageTime).valueOf() >
                                Date.now()
                              ? 'Upcoming'
                              : 'Pending'}
                          </div>
                        </div>
                        <div className={styles.right}>
                          <ArrowForwardIosIcon fontSize="large" />
                        </div>
                      </button>
                    );
                  })}
              </div>
              <div className={styles.container_main_medicine_bar}>
                <div className={styles.header}>
                  <h3>Medicine Details</h3>
                  <div className={styles.current_time}>
                    {new Date().toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
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
                    ]?.reminders.map((medicine, medicineIndex) => {
                      // console.log("list all medicines", medicine);
                      return (
                        <div
                          className={
                            styles.medicine_box + ' ' + styles.med_active
                          }
                        >
                          <div className={styles.header}>
                            <div className={styles.name}>
                              <div className={styles.images}>
                                <img src={gelatin_icon} alt="" />
                              </div>
                              <h3>
                                {medicine.medicineName
                                  .slice(0, 1)
                                  .toUpperCase() +
                                  medicine.medicineName
                                    .slice(1)
                                    .toLocaleLowerCase()}
                              </h3>
                            </div>
                            <select
                              name="filter"
                              value={String(medicine.doseStatus)}
                              // disabled={medicine.doseStatus !== 0}
                              onChange={async (
                                event: React.ChangeEvent<HTMLSelectElement>
                              ) => {
                                // console.log("timeline");
                                // console.log("event is", event.target.value);
                                const doseStatus = Number(event.target.value);
                                setReminderGroup((prev) => {
                                  prev[activeIndex].sort(compareDates)[
                                    activeTimeIndex == -1 && activeIndex == 0
                                      ? firstUpcoming && firstUpcoming - 1
                                      : activeTimeIndex
                                  ].reminders[medicineIndex].doseStatus =
                                    doseStatus;
                                  return [...prev];
                                });
                              }}
                            >
                              <option value={0}>Pending</option>
                              <option value={1}>Completed</option>
                              <option value={2}>Not Required</option>
                              {/* <option value="Year">Year</option> */}
                            </select>
                          </div>
                          <div className={styles.buttons}>
                            <div className={styles.buttons_item}>
                              <p>Day</p>
                              <h4>
                                <span>
                                  {medicine.day?.split('/')?.[0] || ''}
                                </span>{' '}
                                of {medicine.day?.split('/')?.[1] || ''}
                              </h4>
                            </div>
                            <div className={styles.buttons_item}>
                              <p>Time of Medication</p>
                              <h4>{medicine.medicationTime || ''}</h4>
                            </div>
                            <div className={styles.buttons_item}>
                              <p>Timestamp</p>
                              <h4>
                                {' '}
                                {medicine.dosageTime
                                  ? new Date(
                                      medicine.dosageTime
                                    ).toLocaleString('en-US', {
                                      // day: "numeric",
                                      // month: "short",
                                      hour: 'numeric',
                                      minute: 'numeric',
                                      hour12: true,
                                    })
                                  : ''}
                              </h4>
                            </div>
                          </div>
                          <div className={styles.notes}>
                            <input
                              type="text"
                              placeholder="Notes (optional)"
                              value={medicine.note || ''}
                              onChange={async (
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                // console.log("timeline");
                                // console.log("event is", event.target.value);
                                const notes = event.target.value;
                                setReminderGroup((prev) => {
                                  prev[activeIndex].sort(compareDates)[
                                    activeTimeIndex == -1 && activeIndex == 0
                                      ? firstUpcoming && firstUpcoming - 1
                                      : activeTimeIndex
                                  ].reminders[medicineIndex].note = notes;
                                  return [...prev];
                                });
                              }}
                            />
                          </div>
                          {new Date(medicine.dosageTime || '').valueOf() <
                          Date.now() ? (
                            <button
                              className={styles.medicine_button}
                              onClick={() => {
                                const indexTime =
                                  activeTimeIndex == -1 && activeIndex == 0
                                    ? firstUpcoming && firstUpcoming - 1
                                    : activeTimeIndex;
                                const medicineUpdate: MedicineReminderType =
                                  reminderGroup[activeIndex].sort(compareDates)[
                                    indexTime
                                  ].reminders[medicineIndex];
                                  debouncedHandleSubmit(
                                  medicine.id || 0,
                                  {
                                    userID: user.id,
                                    note: medicineUpdate.note || '',
                                    doseStatus: medicineUpdate.doseStatus || 0,
                                  },
                                  activeIndex,
                                  indexTime
                                );
                              }}
                            >
                              Save
                            </button>
                          ) : (
                            ''
                          )}
                        </div>
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
