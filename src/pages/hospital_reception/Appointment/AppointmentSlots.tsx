import React, { useEffect, useState } from "react";
import styles from "./AppointmentSlots.module.scss";
import PersonIcon from "@mui/icons-material/Person";

interface Slot {
  date: string;
  time: string;
  bookedIds: string[];
  availableSlots: number;
}

interface SlotTiming {
  to: string;
  day: string;
  from: string;
  hours: number;
  persons: number;
  date: string;
  slots: Slot[];
}

interface DayToggles {
  [day: string]: boolean;
}

interface AppointmentEntry {
  id: number;
  doctorID: number;
  hospitalID: number;
  slotTimings: SlotTiming[];
  dayToggles: DayToggles;
  addedOn: string;
  updatedOn: string;
  addedBy: number;
}

interface SlotWithDay extends Slot {
  day: string;
}

interface AppointmentSlotsProps {
  data: AppointmentEntry[];
  handleSlotChange: (slot: SlotWithDay) => void; // Updated to include day
}

const AppointmentSlots: React.FC<AppointmentSlotsProps> = ({
  data,
  handleSlotChange,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    time: string;
  } | null>(null);
  const [sortSlotData, setSortSlotData] = React.useState<SlotTiming[]>([]);

  const handleSlotClick = (day: string, slot: Slot) => {
    const selectedSlot: SlotWithDay = { ...slot, day }; // Create a SlotWithDay object
    setSelectedSlot({ day, time: slot.time }); // Update state with day and time
    handleSlotChange(selectedSlot); // Pass the SlotWithDay object
  };

  console.log("data", data);

  useEffect(() => {
    const sortSlotData = data[0].slotTimings.sort((a, b) => {
      const dateA = Date.parse(a.slots[0]?.date); // Get the first slot's date
      const dateB = Date.parse(b.slots[0]?.date);

      return dateA - dateB; // Ascending order
    });
    setSortSlotData(sortSlotData);
    console.log("sortSlotData", sortSlotData);
  }, []);

  return (
    <div className={styles["appointment-slots"]}>
      <table className={styles["slots-table"]}>
        <thead>
          <tr>
            {sortSlotData.map((day, index) => (
              <th key={index} className={styles["day-header"]}>
                {day.day} ({day.slots[0]?.date.split("-")[2] || "N/A"})
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {sortSlotData.map((slotData) => {
              const day = slotData.day;
              const slotTiming = data[0].slotTimings.find(
                (slot) => slot.day === day
              );
              const isDayActive = data[0].dayToggles[day];

              return (
                <td key={day} className={styles["day-column"]}>
                  {slotTiming && isDayActive ? (
                    <>
                      {slotTiming.slots.map((slot, index) => (
                        <div
                          key={index}
                          className={`${styles.slot} 
                            ${
                              slot.availableSlots === 0
                                ? styles.noAvailable
                                : ""
                            } 
                            ${
                              selectedSlot?.day === day &&
                              selectedSlot?.time === slot.time
                                ? styles.selected
                                : ""
                            }`}
                          onClick={() => {
                            if (slot.availableSlots > 0)
                              handleSlotClick(day, slot);
                          }}
                        >
                          <span
                           style={{
                            color: `${
                              slot.availableSlots === 0||( selectedSlot?.day === day &&
                              selectedSlot?.time === slot.time)
                                ? "white"
                                : "green"
                            }`,
                          }}
                            className={`${
                              slot.availableSlots === 0
                                ? styles.noAvailableTime
                                : styles.time
                            } `}
                          >
                            {slot.time}
                          </span>
                          <span className={styles.person}>
                            {slot.availableSlots === 0 ? (
                              <PersonIcon
                                style={{ fontSize: "20px", color: "white" }}
                              />
                            ) : (
                              <PersonIcon
                                style={{
                                  fontSize: "20px",
                                  color: `${
                                    selectedSlot?.day === day &&
                                    selectedSlot?.time === slot.time
                                      ? "white"
                                      : "green"
                                  }`,
                                }}
                              />
                            )}
                          </span>
                          <span
                          style={{
                            color: `${
                              slot.availableSlots === 0||( selectedSlot?.day === day &&
                              selectedSlot?.time === slot.time)
                                ? "white"
                                : "green"
                            }`,
                          }}
                            className={`${
                              slot.availableSlots === 0
                                ? styles.noAvailableTime
                                : styles.available
                            } `}
                          >
                            {slot.availableSlots}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className={styles["no-slot"]}>No slots available</div>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentSlots;
