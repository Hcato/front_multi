import {useEffect} from 'react';
import SunCalc from 'suncalc';

const LunarPhase = ({ setMoonPhase }) => {
  useEffect(() => {
    const date = new Date();
    const moonIllumination = SunCalc.getMoonIllumination(date);
    const phase = moonIllumination.phase;

    let phaseName = '';
    if (phase < 0.03) {
      phaseName = 'Luna Nueva';
    } else if (phase < 0.25) {
      phaseName = 'Creciente';
    } else if (phase < 0.75) {
      phaseName = 'Llena';
    } else {
      phaseName = 'Menguante';
    }

    setMoonPhase(phaseName); 
  }, [setMoonPhase]);

  return null;
};

export default LunarPhase;
