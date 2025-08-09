import Capsule_icon_svg from "../../../../assets/reception/svgIcons/capsule_icon_svg";
import Tablet_svg from "../../../../assets/PatientProfile/tablet_svg";
import Syrups_svg from "../../../../assets/PatientProfile/syrups_svg";
import Injection_svg from "../../../../assets/PatientProfile/injection_svg";
import Frame_svg from "../../../../assets/PatientProfile/frame_svg";
import { medicineCategory } from "../../../../utility/medicine";
type propType = {
  backgroundColor: string;
  medicineType: number;
};
function CreateIcon({ backgroundColor, medicineType }: propType) {
  return (
    <p
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: darkenColor(backgroundColor, 20),
        height: "2.5rem",
        width: "2.5rem",
        borderRadius: "50%",
        marginRight: "5px",
      }}
    >
      {medicineCategory.capsules == medicineType ? (
        <Capsule_icon_svg fill="white" rect="transparent" />
      ) : (
        ""
      )}
      {medicineCategory.injections == medicineType ? (
        <Injection_svg fill="white" rect="transparent" />
      ) : (
        ""
      )}
      {medicineCategory.ivLine == medicineType ? (
        <Frame_svg fill="white" rect="transparent" />
      ) : (
        ""
      )}
      {medicineCategory.syrups == medicineType ? (
        <Syrups_svg fill="white" rect="transparent" />
      ) : (
        ""
      )}
      {medicineCategory.tablets == medicineType ? (
        <Tablet_svg fill="white" rect="transparent" />
      ) : (
        ""
      )}
    </p>
  );
}

export default CreateIcon;
function darkenColor(color: string, factor: number) {
  // Parse the color code into its RGB components
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);

  // Calculate the darker RGB values
  const newRed = Math.max(0, red - factor);
  const newGreen = Math.max(0, green - factor);
  const newBlue = Math.max(0, blue - factor);

  // Convert the darker RGB values back to a color code
  const newColor = `#${newRed.toString(16).padStart(2, "0")}${newGreen
    .toString(16)
    .padStart(2, "0")}${newBlue.toString(16).padStart(2, "0")}`;

  return newColor;
}
