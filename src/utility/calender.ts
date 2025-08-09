import moment from 'moment-timezone';

export const getCalenderOption: {
  [key: string]: Array<{ name: string; value: string }>;
} = {
  month: [
    { name: "Jan", value: "1" },
    { name: "Feb", value: "2" },
    { name: "Mar", value: "3" },
    { name: "Apr", value: "4" },
    { name: "May", value: "5" },
    { name: "Jun", value: "6" },
    { name: "Jul", value: "7" },
    { name: "Aug", value: "8" },
    { name: "Sep", value: "9" },
    { name: "Oct", value: "10" },
    { name: "Nov", value: "11" },
    { name: "Dec", value: "12" },
  ],
  year: Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { name: String(year), value: String(year) };
  }),
  // year: [
  //   { name: "2024", value: "2024" },
  //   { name: "2023", value: "2023" },
  // ],
};

export type dateObj = { month: string; year: string; week: string | null };
export const currentDateObj: dateObj = {
  month: String(new Date().getMonth() + 1),
  year: String(new Date().getFullYear()),
  week: null,
};


export const ONE_HOUR_MS = 60 * 60 * 1000;

export const canDeleteWithinOneHour = (addedOn?: string): boolean => {
  if (!addedOn) {
    return true;
  }

  const addedOnDate = moment(addedOn, 'YYYY-MM-DD HH:mm:ss').add(11, 'hours');
  const currentTime = moment.tz('Asia/Kolkata');

  const timeDifferenceMs = currentTime.diff(addedOnDate);

  return timeDifferenceMs <= ONE_HOUR_MS;
};