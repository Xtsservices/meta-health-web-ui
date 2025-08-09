import styles from './TriageTraumaType.module.scss';

import ShieldBolt from '/src/assets/triage/ShieldBolt.svg';
import Shield from '/src/assets/triage/Shield.svg';
import { useNavigate } from 'react-router-dom';

function TriageTrauma() {
  const navigate = useNavigate();
  const handleTrauma = () => navigate('./../trauma');
  const handleNonTrauma = () => navigate('./../non-trauma');
  const next = () => navigate('./../zone-form');
  const back = () => navigate(-1);

  return (
    <div className={styles.container}>
      <div className={styles.container_wrapper}>
        <div className={styles.container_options}>
          <div
            className={styles.card}
            style={{ backgroundColor: 'orangered' }}
            onClick={handleTrauma}
          >
            <img src={ShieldBolt} width={50} alt="Trauma" />
            <span>Trauma</span>
          </div>
          <div
            className={styles.card}
            style={{ backgroundColor: 'gray' }}
            onClick={handleNonTrauma}
          >
            <img src={Shield} width={50} alt="Non Trauma" />
            <span>Non Trauma</span>
          </div>
        </div>
      </div>
      <div className={styles.container_bottom}>
        <button onClick={back}>back</button>
        <button onClick={next}>next</button>
      </div>
    </div>
  );
}

export default TriageTrauma;
