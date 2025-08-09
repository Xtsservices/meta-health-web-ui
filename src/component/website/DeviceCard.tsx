import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import vtrack from "../../assets/website/v_track.png";
import vitals from "../../assets/website/vitals.png";
import cpap from "../../assets/website/CPAP.png";
import nvcore from "../../assets/website/nv_core_new.jpeg";

interface DeviceProps {
  index: number;
  updateScroll: (newCount: number) => void;
}

const DeviceCard: React.FC<DeviceProps> = ({ index, updateScroll }) => {
  const handleScroll = (num: number) => {
    updateScroll(num);
  };
  const devices = [
    {
      image: nvcore,
      title: "NV-Core",
      alt: "NV-Core"
    },
    {
      image: vtrack,
      title: "V-Track",
      alt: "V-Track"
    },
    {
      image: vitals,
      title: "Vitals",
      alt: "Vitals"
    },
    {
      image: cpap,
      title: "CPAP",
      alt: "CPAP"
    }
  ];
  return (
    <div onClick={() => handleScroll(index)} className="device-container">
      <Card style={{ borderRadius: "20px" }}>
        <CardMedia
          component="img"
          alt="Card 1 Image"
          style={{ height: "250px" }}
          image={devices[index].image}
        />
        <CardContent>
          <Typography variant="h6" align="center">
            <b>{devices[index].title}</b>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceCard;
