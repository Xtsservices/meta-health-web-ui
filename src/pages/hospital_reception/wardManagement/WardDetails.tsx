import { Ward } from "../../../types";
import WardBeds from "./WardBeds";
import WardCard from "./WardCard";
import styles from "./WardDetails.module.scss";

interface WardDetailsProps {
  wardId: string | null;
  wards: Ward[];
}

const WardDetails: React.FC<WardDetailsProps> = ({ wardId, wards }) => {
  // Find the selected ward based on wardId
  const selectedWard = wards.find((ward) => ward.id === wardId);

  if (!selectedWard) {
    return null; // If no ward is selected, don't render anything
  }

  return (
    <div className={styles.container}>
      <div className={styles.container__bed}>
        <WardBeds beds={selectedWard.beds} />
      </div>

      <div className={styles.container__card}>
        <WardCard ward={selectedWard} />
      </div>
    </div>
  );
};

export default WardDetails;
