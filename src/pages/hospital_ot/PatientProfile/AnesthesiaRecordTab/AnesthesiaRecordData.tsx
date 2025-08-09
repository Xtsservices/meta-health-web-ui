import BreathingForm from './AnesthesiaRecordTabItems/BreathingForm/BreathingForm';
import Monitors from './AnesthesiaRecordTabItems/Monitors/Monitors';
const breathingSystemOptions = ['Circle', 'Other', 'T-Pipe', 'Bain'];
const filterOptions = ['Filter', 'HME', 'Active Humidifier', 'Bain'];
const ventilationOptions = ['Spont Vent', 'IPPV', 'CPAP', 'PEEP'];

const AnesthesiaRecordData = [
  {
    id: 1,
    text: 'Breathing/Ventilation',
    value: (
      <BreathingForm
        breathingSystemOptions={breathingSystemOptions}
        filterOptions={filterOptions}
        ventilationOptions={ventilationOptions}
      />
    ),
  },
  {
    id: 2,
    text: 'Monitors',
    value: <Monitors />,
  },
];
export default AnesthesiaRecordData;
