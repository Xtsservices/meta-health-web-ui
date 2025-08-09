import 
{ useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useOTConfig, {
  OTScreenType,
} from '../../store/formStore/ot/useOTConfig';

const OTScreenTypeWrapper = () => {
  const { setScreenType } = useOTConfig();
  const l = useLocation();
  useEffect(() => {
    const path = l.pathname.split('/')[3].toUpperCase();
    if (path === OTScreenType.EMERGENCY) setScreenType(OTScreenType.EMERGENCY);
    else if (path === OTScreenType.ELECTIVE)
      setScreenType(OTScreenType.ELECTIVE);
  }, [l, setScreenType]);
  return <Outlet />;
};

export default OTScreenTypeWrapper;
