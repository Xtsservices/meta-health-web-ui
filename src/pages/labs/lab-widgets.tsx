import styles from './lab-widgets.module.scss';
import { useNavigate } from 'react-router-dom';

type widgetProps = {
  heading: string;
  link?: string;
  paragraph: string;
  icon: string;
  color: string;
};
function Widget({ heading, link, paragraph, icon, color }: widgetProps) {
  const navigate = useNavigate();
  const clickNavigate = (heading: string) => {
    navigate(`${heading.toLowerCase()}`);
  };

  return (
    <div className={`${styles.widzet_box + ' ' + styles[color]}`}>
      <img src={icon} alt="" className="" />
      <div className={styles.heading}>{heading}</div>
      <div className={styles.paragraph}>{paragraph}</div>
      <div
        className={styles.dashboard}
        onClick={() => {
          clickNavigate(link ? link : heading);
        }}
      >
        View Dashboard
      </div>
    </div>
  );
}

function LabWidgets() {
  return (
    <div className={styles.widzet}>
      <Widget heading="Radiology" paragraph="Lab" icon="" color="purple" />
      <Widget heading="Pathology" paragraph="Lab" icon="" color="white" />
    </div>
  );
}

export default LabWidgets;
