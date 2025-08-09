import styles from './TriageGCSScore.module.scss';

const getBgColor = (score: number) => {
  if (score === 0) return 'lightgrey';
  if (score < 8) return '#ffc1c1';
  else if (score > 13) return '#c1ffc4';
  else return '#fff3c4';
};

const getTextColor = (score: number) => {
  if (score === 0) return 'gray';
  if (score < 8 && score > 0) return '#a30a0a';
  else if (score > 13) return '#006605';
  else return '#997b00';
};

const getBorderColor = (score: number) => {
  if (score === 0) return 'lightgray';
  if (score < 8 && score > 0) return '#a30a0a';
  else if (score > 13) return '#006605';
  else return '#997b00';
};

const GcsScoreIndicator = ({ score }: { score: number }) => {
  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: getBgColor(score),
        color: getTextColor(score),
        borderColor: getBorderColor(score),
      }}
    >
      <span>GCS Score&nbsp;:&nbsp;</span>
      <span>{score}</span>
    </div>
  );
};

export default GcsScoreIndicator;
