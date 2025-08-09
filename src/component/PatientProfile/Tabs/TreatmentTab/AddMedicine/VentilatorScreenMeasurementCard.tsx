import { useState } from "react";
import { TextField, IconButton, Stack } from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { VentilatorScreenMeasurementCardProps } from "../../../../../interfaces/procedures";
import styles from "../TreatmentTab.module.scss";

const VentilatorScreenMeasurementCard = ({
  title,
  unit,
  imageSrc,
  altText,
  onChange,
  style,
  bgColor,
  value,
}: VentilatorScreenMeasurementCardProps) => {
  const [activeButton, setActiveButton] = useState<"increment" | "decrement">(
    "decrement"
  );

  const handleIncrement = () => {
    setActiveButton("increment");
    onChange({ target: { value: value + 1 } } as any);
  };

  const handleDecrement = () => {
    setActiveButton("decrement");
    onChange({ target: { value: Math.max(0, value - 1) } } as any);
  };
  
  return (
    <li className={style} style={{ backgroundColor: bgColor }}>
      <div style={{ display: "flex" }} className={styles.card_top_text}>
        <p className={styles.text_on_cards}>{title}</p>
        <p className={styles.texting_style_for_units}>{unit}</p>
      </div>
      <div
        className={styles.counter_image_container}
        style={{ position: "absolute", top: 35 }}
      >
        <img src={imageSrc} alt={altText} className={styles.image_adjustment} />
        <Stack direction="row" spacing={3} alignItems="center">
          <TextField
            type="number"
            onChange={onChange}
            value={value}
            inputProps={{
              min: 0,
              step: 1,
              style: {
                fontSize: "32px",
                fontWeight: "bold",
                textAlign: "center",
              },
            }}
            sx={{
              width: "60%",
              border: "none",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              "& input[type=number]": {
                MozAppearance: "textfield",
              },
            }}
            fullWidth
            required
          />
          <Stack direction="column" spacing={-2.5} alignItems="center">
            <IconButton
              onClick={handleIncrement}
              sx={{
                padding: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <ArrowDropUp
                fontSize="large"
                sx={{
                  color: activeButton === "increment" ? "#1977F3" : "#999999",
                }}
              />
            </IconButton>
            <IconButton
              onClick={handleDecrement}
              sx={{
                padding: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <ArrowDropDown
                fontSize="large"
                sx={{
                  color: activeButton === "decrement" ? "#1977F3" : "#999999",
                }}
              />
            </IconButton>
          </Stack>
        </Stack>
      </div>
    </li>
  );
};

export default VentilatorScreenMeasurementCard;
