import { Grid, FormControl, Button } from "@mui/material";
import React, { useEffect } from "react";
import { MedicineType } from "../../../../../types";
import { timeOfMedication } from "../../../../../utility/list";

type MedicationTimeProps = {
  length: number;
  setMedicineData: React.Dispatch<React.SetStateAction<MedicineType[]>>;
  index: number;
  medicineData?: MedicineType[];
};

const MedicationTime: React.FC<MedicationTimeProps> = ({
  length,
  setMedicineData,
  index,
  medicineData
}) => {
  const [medicationTime, setMedicationTime] = React.useState<string[]>([]);

  useEffect(() => {
    setMedicineData((prevData) => {
      const newData = [...prevData];
      if (newData[index] && medicationTime.includes("As Per Need")) {
        newData[index] = {
          ...newData[index],
          Frequency: 1,
          daysCount: 0,
          medicationTime: "As Per Need"
        };
      } else {
        newData[index] = {
          ...newData[index],
          medicationTime: medicationTime.join(",")
        };
      }
      return newData;
    });
  }, [medicationTime]);

  const handleMedicationTimeClick = (each: string) => {
    if (
      medicineData &&
      medicineData[index] &&
      typeof medicineData[index].Frequency === "number"
    ) {
      const maxSelectable: number = medicineData[index].Frequency;

      setMedicationTime((prev) => {
        const newMedicationTime = [...prev];
        const itemIndex = newMedicationTime.indexOf(each);

        if (itemIndex === -1) {
          if (newMedicationTime.length < maxSelectable) {
            newMedicationTime.push(each);
          }
        } else {
          newMedicationTime.splice(itemIndex, 1);
        }

        return newMedicationTime;
      });
    } else {
      console.error("Invalid medicine data or frequency");
    }
  };

  return (
    <>
      {Array.from({ length }).map((_, index1) => (
        <React.Fragment key={index1}>
          <Grid xs={12} style={{ display: "flex" }} item>
            <FormControl fullWidth required>
              <p
                style={{ fontSize: "14px", color: "gray", fontWeight: "100" }}
                id={`demo-multiple-select-label-${index1}`}
              >
                Time of Medication
              </p>
              <Grid xs={12} style={{ display: "flex" }} item>
                {timeOfMedication.map((each, idx) => (
                  <Button
                    key={idx}
                    style={{
                      margin: "3px",
                      fontWeight: 500,
                      fontSize: "10px",
                      color: medicationTime.includes(each) ? "white" : "gray"
                    }}
                    variant={
                      medicationTime.includes(each) ? "contained" : "outlined"
                    }
                    onClick={() => handleMedicationTimeClick(each)}
                  >
                    {each}
                  </Button>
                ))}
              </Grid>
            </FormControl>
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
};

export default MedicationTime;
