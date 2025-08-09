import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import pulseRateIcon from "./../../../../../src/assets/medicalCondition/ppulse_icon.png";
import temperatureIcon from "./../../../../../src/assets/medicalCondition/thermometer_icon.png";
import spo2Icon from "./../../../../../src/assets/medicalCondition/droplet_icon.png";
import bloodpressureIcon from "./../../../../../src/assets/medicalCondition/heart_icon.png";
import { Alerttype, vitalFunctionType } from "../../../../types";
import React from "react";
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
  page: {
    flexDirection: "column",
    padding: 30,
  },
  vitalsContainer1: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  vitalsContainer2: {
    flexDirection: "row",
    justifyContent: "center",
  },
  vitalBox1: {
    width: "30%",
    borderRadius: 10,
    borderColor: "#56abf5",
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  vitalHeaderText1: {
    fontSize: 15,
    color: "#56abf5",
    fontWeight: "bold",
    marginBottom: 5,
  },
  vitalDes: {
    fontSize: 12,
  },
  vitalValue1: {
    fontSize: 12,
    color: "#56abf5",
    fontWeight: "bold",
  },
  vitalBox2: {
    width: "30%",
    borderRadius: 10,
    borderColor: "#f56993",
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  vitalHeaderText2: {
    fontSize: 15,
    color: "#f56993",
    fontWeight: "bold",
    marginBottom: 5,
  },
  vitalValue2: {
    fontSize: 12,
    color: "#f56993",
    fontWeight: "bold",
  },
  vitalBox3: {
    width: "30%",
    borderRadius: 10,
    borderColor: "#60f7b3",
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  vitalHeaderText3: {
    fontSize: 15,
    color: "#60f7b3",
    fontWeight: "bold",
    marginBottom: 5,
  },
  vitalValue3: {
    fontSize: 12,
    color: "#60f7b3",
    fontWeight: "bold",
  },
  vitalBox4: {
    width: "30%",
    borderRadius: 10,
    borderColor: "#ca79fc",
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  vitalHeaderText4: {
    fontSize: 15,
    color: "#ca79fc",
    fontWeight: "bold",
    marginBottom: 20,
  },
  vitalValue4: {
    fontSize: 12,
    color: "#ca79fc",
    fontWeight: "bold",
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginVertical: 5,
  },
  alertTable: {
    marginTop: 20,
    width: "80%",
    marginLeft: 60,
    // borderWidth: 1,
    borderColor: "#d9fffc",
    padding: 5,
  },
  alertTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#98f5eb",
    borderLeftWidth: 1,
  },
  alertTableHeader: {
    fontWeight: "bold",
    backgroundColor: "#b2f7f4",
    padding: 5,
    borderRightWidth: 1,
  },
  alertTableCell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#98f5eb",
  },
  icon: {
    width: "auto",
    height: 30,
    marginLeft: 40,
  },
});

// const alerts = [
//   { slNo: 1, time: "09:00 AM", temp: "38.5°C", alert: "Fever" },
//   { slNo: 2, time: "10:30 AM", temp: "39.2°C", alert: "High Fever" },
//   { slNo: 3, time: "02:15 PM", temp: "37.8°C", alert: "Normal" },
//   { slNo: 4, time: "04:45 PM", temp: "38.9°C", alert: "Fever" },
// ];
type propType = {
  vitalFunction: vitalFunctionType | null;
  vitalAlert: Alerttype[];
};
const Vitals = ({ vitalFunction, vitalAlert }: propType) => {
  type alertType = {
    slNo: number;
    time: string;
    temp: string | number;
    alert: string;
  };
  const [alerts, setAlert] = React.useState<alertType[]>([]);
  React.useEffect(() => {
    setAlert(
      vitalAlert.map((el) => ({
        slNo: 1,
        time: el.addedOn
          ? String(new Date(el.addedOn).toLocaleDateString("en-GB"))
          : "No Data",
        temp: el.alertValue,
        alert: el.alertMessage,
      }))
    );
  }, [vitalAlert]);
  // console.log("vitals function", vitalFunction);

  return (
    <div>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>VITALS</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.vitalsContainer1}>
        <View style={styles.vitalBox1}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.vitalHeaderText1}>Pulse Rate</Text>
            <Image style={styles.icon} src={pulseRateIcon} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalDes}>Average</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Minimum</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Maximum</Text>
            </View>
            <View style={{ marginLeft: "auto" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vitalValue1}>
                  {vitalFunction?.pulse.avgPulse
                    ? Number(vitalFunction?.pulse.avgPulse).toFixed(1)
                    : "No Data"}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue1}>
                  {vitalFunction?.pulse.maxPulse
                    ? vitalFunction?.pulse.maxPulse.toFixed(1)
                    : "No Data"}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue1}>
                  {vitalFunction?.pulse.minPulse
                    ? vitalFunction?.pulse.minPulse.toFixed(1)
                    : "No Data"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.vitalBox2}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.vitalHeaderText2}>Temperature</Text>
            <Image style={styles.icon} src={temperatureIcon} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalDes}>Average</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Minimum</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Maximum</Text>
            </View>
            <View style={{ marginLeft: "auto" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vitalValue2}>
                  {vitalFunction?.temperature.avgTemperature
                    ? vitalFunction?.temperature.avgTemperature.toFixed(1) +
                      "°Celsius"
                    : "No Data"}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue2}>
                  {vitalFunction?.temperature.maxTemperature
                    ? vitalFunction?.temperature.maxTemperature.toFixed(1) +
                      "°Celsius"
                    : "No Data"}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue2}>
                  {vitalFunction?.temperature.minTemperature
                    ? vitalFunction?.temperature.minTemperature.toFixed(1) +
                      "°Celsius"
                    : "No Data"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.vitalsContainer2}>
        <View style={styles.vitalBox3}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.vitalHeaderText3}>
              Oxygen Saturation (SpO2)
            </Text>
            <Image style={styles.icon} src={spo2Icon} />
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalDes}>Average</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Minimum</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Maximum</Text>
            </View>
            <View style={{ marginLeft: "auto" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vitalValue3}>
                  {vitalFunction?.oxygen.avgOxygen
                    ? Number(vitalFunction?.oxygen.avgOxygen).toFixed(1) + "%"
                    : "No Data"}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue3}>
                  {vitalFunction?.oxygen.minOxygen
                    ? vitalFunction?.oxygen.maxOxygen.toFixed(1) + "%"
                    : "No Data"}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue3}>
                  {vitalFunction?.oxygen.minOxygen
                    ? vitalFunction?.oxygen.minOxygen.toFixed(1) + "%"
                    : "No Data"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.vitalBox4}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.vitalHeaderText4}>Blood Pressure</Text>
            <Image style={styles.icon} src={bloodpressureIcon} />
          </View>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalDes}>Average</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Minimum</Text>
              <View style={styles.underline}></View>
              <Text style={styles.vitalDes}>Maximum</Text>
            </View>
            <View style={{ marginLeft: "auto" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vitalValue4}>
                  {vitalFunction?.bp.avgBp
                    ? vitalFunction?.bp.avgBp + "mm Hg"
                    : "No Data"}{" "}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue4}>
                  {vitalFunction?.bp.maxBp
                    ? vitalFunction?.bp.maxBp + "mm Hg"
                    : "No Data"}
                </Text>
                <View style={styles.underline}></View>
                <Text style={styles.vitalValue4}>
                  {vitalFunction?.bp.minBp
                    ? vitalFunction?.bp.minBp + "mm Hg"
                    : "No Data"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View>
        {alerts.length ? (
          <View style={styles.alertTable}>
            <View style={styles.alertTableRow}>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                SL.No
              </Text>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                Time
              </Text>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                Temp
              </Text>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                Alert
              </Text>
            </View>
            {alerts.slice(0, 13).map((alert, index) => (
              <View style={styles.alertTableRow} key={index}>
                <Text style={styles.alertTableCell}>{alert.slNo}</Text>
                <Text style={styles.alertTableCell}>
                  {alert.time
                    ? new Date(alert.time).toLocaleString("en-US", {
                        // day: "numeric",
                        // month: "short",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                    : "----"}
                </Text>
                <Text style={styles.alertTableCell}>
                  {alert.temp ? Number(alert.temp).toFixed(1) : ""}
                </Text>
                <Text style={styles.alertTableCell}>{alert.alert}</Text>
              </View>
            ))}
          </View>
        ) : (
          ""
        )}
      </View>
      {alerts.slice(13).length > 0 && (
        <View>
          <View style={styles.alertTable}>
            <View style={styles.alertTableRow}>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                SL.No
              </Text>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                Time
              </Text>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                Temp
              </Text>
              <Text style={[styles.alertTableHeader, styles.alertTableCell]}>
                Alert
              </Text>
            </View>
            {alerts.slice(13).map((alert, index) => (
              <View style={styles.alertTableRow} key={index}>
                <Text style={styles.alertTableCell}>{alert.slNo}</Text>
                <Text style={styles.alertTableCell}>
                  {" "}
                  {alert.time
                    ? new Date(alert.time).toLocaleString("en-US", {
                        // day: "numeric",
                        // month: "short",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                    : "----"}
                </Text>
                <Text style={styles.alertTableCell}>
                  {" "}
                  {alert.temp ? Number(alert.temp).toFixed(1) : ""}
                </Text>
                <Text style={styles.alertTableCell}>{alert.alert}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </div>
  );
};
export default Vitals;
