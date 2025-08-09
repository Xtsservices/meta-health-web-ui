import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import img1 from "../../assets/website/img1.png";
import img2 from "../../assets/website/img2.png";
import img3 from "../../assets/website/img3.png";
import img4 from "../../assets/website/img4.png";
import img5 from "../../assets/website/img5.png";
import img6 from "../../assets/website/img6.png";
import img7 from "../../assets/website/img7.png";
import img8 from "../../assets/website/img8.png";
import "./sponserCard.scss";
interface DeviceProps {
  index: number;
}

const SponserCard: React.FC<DeviceProps> = ({ index }) => {
  const devices = [
    {
      image: img1
    },
    {
      image: img2
    },
    {
      image: img3
    },
    {
      image: img4
    },
    {
      image: img5
    },
    {
      image: img6
    },
    {
      image: img7
    },
    {
      image: img8
    }
  ];
  return (
    <div className="sponser-container">
      <Card style={{ borderRadius: "20px" }}>
        <CardMedia component="img" image={devices[index].image} />
      </Card>
    </div>
  );
};

export default SponserCard;
