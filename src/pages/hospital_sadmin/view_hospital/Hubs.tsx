import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./ViewHospitalHubs.module.scss";
import hubIcon from "./../../../../src/assets/sadmin/device_icon.jpeg";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { useParams } from "react-router-dom";

interface Hub {
  hubName: string;
}

function Hubs() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const user = useSelector(selectCurrentUser);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const response = await authFetch(`/hub/sAdmin/${id}`, user.token);

        if (response && response.message === "success") {
          setHubs(response.hubs);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchHubs();
  }, [id, user.token]);

  return (
    <>
      {hubs.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <p style={{ margin: 0 }}>
            <b>List of Hubs</b>
          </p>
        </div>
      )}
      <div>
        {hubs.length === 0 ? (
          <p>No hubs available.</p>
        ) : (
          <div className={styles.container}>
            {hubs.map((hub, index) => (
              <Card key={index} sx={{ borderRadius: "20px", width: "12vw" }}>
                <CardContent>
                  <div
                    className={styles.image}
                    style={{ border: "4px solid blue" }}
                  >
                    <img src={hubIcon} alt="Hub Image" className={styles.img} />
                  </div>
                  <Typography sx={{ textAlign: "center" }} variant="body1">
                    {hub.hubName}
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

export default Hubs;
