import { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Search, Notifications, NotificationsOff } from "@mui/icons-material";
import styles from "./MedicationSelector.module.scss";
import usePatientFileStore from "../../../../../../store/formStore/ot/usePatientFileForm";
import Capsule_icon_svg from "../../../../../../assets/reception/svgIcons/capsule_icon_svg";
import Syrups_svg from "../../../../../../assets/PatientProfile/syrups_svg";
import Tablet_svg from "../../../../../../assets/PatientProfile/tablet_svg";
import Injection_svg from "../../../../../../assets/PatientProfile/injection_svg";
import Tube_svg from "../../../../../../assets/PatientProfile/tube_svg";
import Topical_svg from "../../../../../../assets/PatientProfile/topical_svg";
import Drop_svg from "../../../../../../assets/PatientProfile/drops_sv";
import Spray_svg from "../../../../../../assets/PatientProfile/spray_svg";
import Frame_svg from "../../../../../../assets/PatientProfile/frame_svg";

const MedicationSelector = () => {
  const [selectedType, setSelectedType] = useState<string>("capsules");
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleMenuClick = (type: string, id: number) => {
    setSelectedType(type);
    setTabIndex(id);
  };

  const { medications } = usePatientFileStore();

  type TabButtonProps = {
    index: number;
    placeholder: string;
  };

  const TabButton: React.FC<TabButtonProps> = ({ index }) => {
    return (
      <button
        style={{
          background: `${index == tabIndex ? "#F90" : "#F0F0F0"}`,
          transition: "all 0.5s",
          height:"30",
          width:"30",
          border: "none",
        }}
      >
        <div>
          {index == 0 && (
            <Capsule_icon_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 1 && (
            <Syrups_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 2 && (
            <Tablet_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 3 && (
            <Injection_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 5 && (
            <Tube_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 6 && (
            <Topical_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 7 && (
            <Drop_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 8 && (
            <Spray_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 4 && (
            <Frame_svg
              fill={index == tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index == tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
        </div>
      </button>
    );
  };

  return (
    <Container className={styles.medicationContainer}>
      <Typography variant="h5" gutterBottom>
        Select Medication
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card className={styles.menuCard}>
            <CardContent>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "capsules" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("capsules", 0)}
              >
                {" "}
                <TabButton index={0} placeholder="Capsules" />
                Capsules
              </div>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "syrups" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("syrups", 1)}
              >
                <TabButton index={1} placeholder="Syrups" />
                Syrups
              </div>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "tablets" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("tablets", 2)}
              >
                <TabButton index={2} placeholder="Tablets" />
                Tablets
              </div>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "injections" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("injections", 3)}
              >
                <TabButton index={3} placeholder="Injections" />
                Injections
              </div>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "ivLine" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("ivLine", 4)}
              >
                <TabButton index={4} placeholder="IV Line" />
                IV Line
              </div>

              <div
                className={`${styles.menuItem} ${
                  selectedType === "Tubing" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("Tubing", 5)}
              >
                <TabButton index={5} placeholder="Tubing" />
                Tubing
              </div>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "Topical" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("Topical", 6)}
              >
                <TabButton index={6} placeholder="Topical" />
                Topical
              </div>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "Drops" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("Drops", 7)}
              >
                <TabButton index={7} placeholder="Drops" />
                Drops
              </div>
              <div
                className={`${styles.menuItem} ${
                  selectedType === "Spray" ? styles.active : ""
                }`}
                onClick={() => handleMenuClick("Spray", 8)}
              >
                <TabButton index={8} placeholder="Spray" />
                Spray
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Card>
            <CardContent>
              <div className={styles.header}>
                <Typography variant="h6">
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </Typography>
                <div className={styles.searchContainer}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search"
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <Search />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
              </div>
              <table className={styles.medicationTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>No. of days</th>
                    <th>Dosage</th>
                    <th>Time of Medication</th>
                    <th>Notify</th>
                  </tr>
                </thead>
                <tbody>
                  {medications &&
                    medications[selectedType]?.map((med, index) => (
                      <tr key={index}>
                        <td>{med.name}</td>
                        <td>
                          <TextField
                            variant="outlined"
                            size="small"
                            type="number"
                            defaultValue={med.days}
                          />
                        </td>
                        <td>
                          <TextField
                            variant="outlined"
                            size="small"
                            type="number"
                            defaultValue={med.dosage}
                          />
                        </td>
                        <td>
                          <TextField
                            select
                            variant="outlined"
                            size="small"
                            defaultValue={med.time}
                          >
                            <MenuItem value="Before BreakFast">
                              Before BreakFast
                            </MenuItem>
                            <MenuItem value="After BreakFast">
                              After BreakFast
                            </MenuItem>
                            <MenuItem value="Before Lunch">
                              Before Lunch
                            </MenuItem>
                            <MenuItem value="After Lunch">After Lunch</MenuItem>
                            <MenuItem value="Before Dinner">
                              Before Dinner
                            </MenuItem>
                            <MenuItem value="After Dinner">
                              After Dinner
                            </MenuItem>
                          </TextField>
                        </td>
                        <td>
                          <IconButton>
                            {med.notify ? (
                              <Notifications />
                            ) : (
                              <NotificationsOff />
                            )}
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Save button not available as Patient file is read only */}
              {/* <Button
                variant="contained"
                color="primary"
                className={styles.saveButton}
              >
                Save
              </Button> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MedicationSelector;
