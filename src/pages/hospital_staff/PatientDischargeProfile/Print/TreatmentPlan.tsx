import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Reminder } from "../../../../store/zustandstore";
interface GroupedReminder {
  dosageTime: string;
  medicine: Reminder[];
}
const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3c54f0",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 5,
    marginTop: 20,
  },
  headerText: {
    fontSize: 12,
    color: "white",
  },
  timelineContainer: {
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 5,
    width: "80%",
  },
  timelineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    // alignItems: "center",
  },
  timelineTime: {
    fontSize: 10,
    color: "#333",
    // textAlign: "center"
  },
  timelineMedicine: {
    fontSize: 10,
    color: "#333",
    flex: 1,
  },
  medicineName: {
    flex: 2,
  },

  underline: {
    borderBottom: "1px solid #ccc",
    marginBottom: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  headerText2: {
    flex: 1,
    marginTop: 10,
    fontSize: 10,
    color: "grey",
  },
  headerMedicine: {
    flex: 2,
  },
});
type propType = {
  medicineReminder: Reminder[];
};
const TreatmentPlan = ({ medicineReminder }: propType) => {
  // const timelineData = [
  //   {
  //     date: "2023-08-08",
  //     time: "08:00 AM",
  //     medicine: "Medicine A",
  //     dose: "1-1-1",
  //     nurse: "Nurse ABC",
  //   },
  //   {
  //     date: "2023-08-08",
  //     time: "01:00 PM",
  //     medicine: "Medicine B",
  //     dose: "1-0-0",
  //     nurse: "Nurse XYZ",
  //   },
  //   {
  //     date: "2023-08-08",
  //     time: "09:00 PM",
  //     medicine: "Medicine C",
  //     dose: "1-1-0",
  //     nurse: "Nurse ABC",
  //   },
  //   {
  //     date: "2023-08-09",
  //     time: "06:00 PM",
  //     medicine: "Medicine C",
  //     dose: "1-1-0",
  //     nurse: "Nurse ABC",
  //   },
  //   {
  //     date: "2023-08-09",
  //     time: "09:00 PM",
  //     medicine: "Medicine C",
  //     dose: "1-1-0",
  //     nurse: "Nurse XYZ",
  //   },
  // ];

  const [groupMedicine, setGroupMedicine] = React.useState<GroupedReminder[]>(
    []
  );
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
  console.log("grouped in print inpateint", groupMedicine);
  return (
    <div>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>TREATMENT PLAN</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.timelineContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText2}>Date</Text>
          <Text style={styles.headerText2}>Time</Text>
          <Text style={[styles.headerText2, styles.headerMedicine]}>
            Medicine Name
          </Text>
          <Text style={styles.headerText2}>Dose</Text>
          <Text style={styles.headerText2}>Nurse Name</Text>
        </View>
        {groupMedicine.map((grouped, index) => {
          return (
            <View key={index}>
              {grouped.medicine.map((medicine) => {
                return (
                  <>
                    <View style={styles.timelineRow}>
                      <Text
                        style={[styles.timelineTime, styles.timelineMedicine]}
                      >
                        {grouped.dosageTime
                          ? String(
                              new Date(grouped.dosageTime).toLocaleDateString(
                                "en-GB"
                              )
                            )
                          : ""}
                      </Text>

                      <Text
                        style={[styles.timelineTime, styles.timelineMedicine]}
                      >
                        {medicine.dosageTime
                          ? String(
                              new Date(medicine.dosageTime).toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                }
                              )
                            )
                          : ""}
                      </Text>
                      <Text
                        style={[styles.timelineMedicine, styles.medicineName]}
                      >
                        {medicine.medicineName}
                      </Text>
                      <Text style={styles.timelineMedicine}>
                        {" "}
                        {medicine.day ? medicine.day?.split("/")[0] : "-"}
                      </Text>
                      <Text style={styles.timelineMedicine}>
                        {medicine.firstName &&
                          medicine.firstName.slice(0, 1).toUpperCase() +
                            medicine.firstName.slice(1).toLowerCase()}
                      </Text>
                    </View>
                  </>
                );
              })}
              <View style={styles.underline} />
            </View>
          );
        })}
      </View>
    </div>
  );
};

export default TreatmentPlan;
