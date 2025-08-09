// export const getAge = (dateString: string) => {
//   if (dateString) {
//     const birthDate = new Date(dateString);
//     const currentDate = new Date();

import { patientStatus } from "./role";

//     const utcBirthDate = Date.UTC(
//       birthDate.getFullYear(),
//       birthDate.getMonth(),
//       birthDate.getDate()
//     );
//     const utcCurrentDate = Date.UTC(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       currentDate.getDate()
//     );

//     const ageInMilliseconds = utcCurrentDate - utcBirthDate;

//     const ageYears = Math.floor(
//       ageInMilliseconds / (1000 * 60 * 60 * 24 * 365)
//     );
//     const remainingMilliseconds =
//       ageInMilliseconds - ageYears * 1000 * 60 * 60 * 24 * 365;

//     const ageMonths = Math.floor(
//       remainingMilliseconds / (1000 * 60 * 60 * 24 * 30)
//     );
//     const remainingMillisecondsAfterMonths =
//       remainingMilliseconds - ageMonths * 1000 * 60 * 60 * 24 * 30;

//     const ageDays = Math.floor(
//       remainingMillisecondsAfterMonths / (1000 * 60 * 60 * 24)
//     );

//     let ageString = "";

//     if (ageYears >= 1) {
//       ageString += `${ageYears} year${ageYears > 1 ? "s" : ""}`;
//     }

//     if (ageMonths >= 1) {
//       if (ageString !== "") {
//         ageString += ", ";
//       }
//       ageString += `${ageMonths} month${ageMonths > 1 ? "s" : ""}`;
//     }

//     if (ageDays >= 1) {
//       if (ageString !== "") {
//         ageString += ", ";
//       }
//       ageString += `${ageDays} day${ageDays > 1 ? "s" : ""}`;
//     }

//     return ageString;
//   }
// };

export const getAge = (dateString: string) => {
  if (dateString) {
    const birthDate = new Date(dateString);
    const currentDate = new Date();

    const utcBirthDate = Date.UTC(
      birthDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    const utcCurrentDate = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const ageInMilliseconds = utcCurrentDate - utcBirthDate;

    const ageYears = Math.floor(
      ageInMilliseconds / (1000 * 60 * 60 * 24 * 365)
    );
    const remainingMilliseconds =
      ageInMilliseconds - ageYears * 1000 * 60 * 60 * 24 * 365;

    const ageMonths = Math.floor(
      remainingMilliseconds / (1000 * 60 * 60 * 24 * 30)
    );
    const remainingMillisecondsAfterMonths =
      remainingMilliseconds - ageMonths * 1000 * 60 * 60 * 24 * 30;

    const ageDays = Math.floor(
      remainingMillisecondsAfterMonths / (1000 * 60 * 60 * 24)
    );

    let ageString = "";

    if (ageYears > 0) {
      ageString += `${ageYears} year${ageYears > 1 ? "s" : ""}`;
    } else if (ageMonths > 0) {
      ageString += `${ageMonths} month${ageMonths > 1 ? "s" : ""}`;
    } else if (ageDays > 0) {
      ageString += `${ageDays} day${ageDays > 1 ? "s" : ""}`;
    }

    return ageString;
  }
};

/////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
export function formatDate(inputDate: string) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const inputDateObj = new Date(inputDate);

  if (inputDateObj.toDateString() === today.toDateString()) {
    return `Today, ${String(
      inputDateObj.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    )}`;
  } else if (inputDateObj.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${String(
      inputDateObj.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })
    )}`;
  } else {
    return inputDateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }
}

export function formatDate2(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  // return str.charAt(0).toUpperCase() + str.slice(1);
  return str
    .split("_")
    .map(
      (el: string) => el.slice(0, 1).toUpperCase() + el.slice(1).toLowerCase()
    )
    .join(" ");
}

export const generateColorArray = (length: number) => {
  const dynamicColorArray: string[] = [];

  const isTooCloseToWhite = (color: string) => {
    const hexColor = color.substring(1); // Remove the '#' character
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Adjust these threshold values based on your preference
    const threshold = 200;
    return r > threshold && g > threshold && b > threshold;
  };

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  for (let i = 0; i < length; i++) {
    let newColor = generateRandomColor();

    // Check if the color is too close to white or transparent
    while (isTooCloseToWhite(newColor)) {
      newColor = generateRandomColor();
    }

    dynamicColorArray.push(newColor);
  }

  return dynamicColorArray;
};

export const getMonthName = (month: number): string | null => {
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (month >= 1 && month <= 12) {
    return months[month - 1];
  } else {
    // Handle the case where the input is not a valid month number
    return null;
  }
};

export const getWeek = (month: number): string | null => {
  const months = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (month >= 1 && month <= 7) {
    return months[month - 1];
  } else {
    // Handle the case where the input is not a valid month number
    return null;
  }
};

type dataProp = {
  filter_value: number;
  count: number;
};
interface DataItem {
  x: string;
  y: number;
}
export const createWeekYearMonthObj = (
  filter: string,
  dataList: dataProp[]
): DataItem[] | undefined => {
  // type objProp:data = {
  //   [key: string]: number;
  // };
  const obj: DataItem[] | undefined = [];
  if (filter == "year") {
    const arrayYear = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    arrayYear.forEach((month: string, i) => {
      const singleData = dataList.find((el) => el.filter_value == i + 1);
      if (singleData) {
        obj.push({ x: month, y: singleData.count });
      } else {
        obj.push({ x: month, y: 0 });
      }
    });
    return obj;
  }
  if (filter == "week") {
    const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weeks.forEach((week: string, i) => {
      const singleData = dataList.find((el) => el.filter_value == i + 1);
      if (singleData) {
        obj.push({ x: week, y: singleData.count });
      } else {
        obj.push({ x: week, y: 0 });
      }
    });
    return obj;
  } else {
    const currentDate = new Date();
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const newArray = new Array(lastDay).fill(1);
    // console.log("lasssst day", lastDay, newArray, dataList);
    newArray.forEach((_, i) => {
      const singleData = dataList.find((el) => el.filter_value == i + 1);
      if (singleData) {
        obj.push({ x: String(i + 1), y: singleData.count });
      } else {
        obj.push({ x: String(i + 1), y: 0 });
      }
    });
    return obj;
  }
};

export const createWeekYearMonthObjOpd = (
  filter: string,
  dataList: dataProp[]
): DataItem[] | undefined => {
  const obj: DataItem[] | undefined = [];
  
  if (filter == "year") {
    // If only year is selected, display all months
    const arrayYear = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    arrayYear.forEach((month: string, i) => {
      const singleData = dataList.find((el) => el.filter_value == i + 1);
      if (singleData) {
        obj.push({ x: month, y: singleData.count });
      } else {
        obj.push({ x: month, y: 0 });
      }
    });

    return obj;
  }

  if (filter == "week") {
    // Handle week case
    const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weeks.forEach((week: string, i) => {
      const singleData = dataList.find((el) => el.filter_value == i + 1);
      if (singleData) {
        obj.push({ x: week, y: singleData.count });
      } else {
        obj.push({ x: week, y: 0 });
      }
    });

    return obj;
  }

  if (filter === "") {
    // Handle the case where no month is selected (only year selected)
    const arrayYear = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    arrayYear.forEach((month: string, i) => {
      const singleData = dataList.find((el) => el.filter_value == i + 1);
      if (singleData) {
        obj.push({ x: month, y: singleData.count });
      } else {
        obj.push({ x: month, y: 0 });
      }
    });

    return obj;
  } else {
    // Handle daily data for specific month
    const currentDate = new Date();
    const selectedMonth = parseInt(filter, 10); // Convert selected month to number
    const lastDay = new Date(currentDate.getFullYear(), selectedMonth, 0).getDate();
    const newArray = new Array(lastDay).fill(1);
    
    newArray.forEach((_, i) => {
      const singleData = dataList.find((el) => el.filter_value == i + 1);
      if (singleData) {
        obj.push({ x: String(i + 1), y: singleData.count });
      } else {
        obj.push({ x: String(i + 1), y: 0 });
      }
    });

    return obj;
  }
};


///////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
export const findCorrectRoute = (option: number) => {
  switch (option) {
    case patientStatus.inpatient:
      return "inpatient/list";
    case patientStatus.discharged:
      return "inpatient/dischargepatient";
    case patientStatus.outpatient:
      return "opd/list";
    case patientStatus.emergency:
      return "emergency/list";
  }
};

// export const getDate = (date: string) => {
//   const dateObj = new Date(date);
//   const formattedDate = dateObj.toLocaleString("en-US", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//     // hour: "2-digit",
//     // minute: "2-digit",
//     // second: "2-digit",
//     // hour12: false,
//   });
//   return formattedDate;
// };

export const getDepartmentName = (departmentID: number) => {
  if (departmentID == 1) {
    return "OPD";
  } else if (departmentID == 2) {
    return "IPD";
  } else if (departmentID == 3) {
    return "Emergency";
  }
};
