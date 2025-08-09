import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./ViewHospitalHubs.module.scss";
import device_icon from "./../../../../src/assets/cardiology_icon.png";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { useParams } from "react-router-dom";

interface Device {
  deviceName: string;
}

function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const user = useSelector(selectCurrentUser);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await authFetch(
          `/device/sAdmin/hospital/${id}`,
          user.token
        );

        if (response && response.message === "success") {
          setDevices(response.devices);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDevices();
  }, [id, user.token]);

  return (
    <>
      {devices.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <p style={{ margin: 0 }}>
            <b>List of Devices</b>
          </p>
        </div>
      )}
      <div>
        {devices.length === 0 ? (
          <p>No devices available.</p>
        ) : (
          <div className={styles.container}>
            {devices.map((device, index) => (
              <Card key={index} sx={{ borderRadius: "20px", width: "12vw" }}>
                <CardContent>
                  <div
                    className={styles.image}
                    style={{ border: "4px solid blue" }}
                  >
                    <img
                      src={device_icon}
                      alt="Device Image"
                      className={styles.img}
                    />
                  </div>
                  <Typography sx={{ textAlign: "center" }} variant="body1">
                    {device.deviceName}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Devices;
