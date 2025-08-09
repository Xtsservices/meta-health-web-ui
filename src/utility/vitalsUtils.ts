import { authFetch } from "../axios/useAuthFetch";

type Vital = {
  bpTime?: string | null;
  oxygenTime?: string | null;
  temperatureTime?: string | null;
  pulseTime?: string | null;
  respiratoryRateTime?: string | null;
};

type User = {
  hospitalID: string | number;
  token: string;
};

export const checkExistingVitals = async (
    time: string,
    patientID: number,
    user: User,
    vitalType: keyof Vital
  ): Promise<boolean> => {
    try {
      const response = await authFetch(
        `vitals/${user.hospitalID}/${patientID}`,
        user.token
      );
  
      if (response.message === "success" && response.vitals) {
        const submittedLocalTime = time; // e.g., "17:02"
        console.log("Submitted Local Time (HH:MM):", submittedLocalTime);
  
        return response.vitals.some((vital: Vital) => {
          const vitalTime = vital[vitalType];
          if (!vitalTime) return false;
  
          // Convert stored UTC time to local time (assuming UTC+5:30 offset)
          const vitalDate = new Date(vitalTime);
          const offsetHours = 5; // Adjust based on your timezone
          const offsetMinutes = 30;
          vitalDate.setUTCHours(vitalDate.getUTCHours() + offsetHours);
          vitalDate.setUTCMinutes(vitalDate.getUTCMinutes() + offsetMinutes);
  
          const vitalLocalTime = `${vitalDate
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${vitalDate
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}`;
          console.log(`Comparing: ${vitalLocalTime} === ${submittedLocalTime}`);
          return vitalLocalTime === submittedLocalTime;
        });
      }
      return false;
    } catch (error) {
      console.error("Error checking existing vitals:", error);
      return false;
    }
  };