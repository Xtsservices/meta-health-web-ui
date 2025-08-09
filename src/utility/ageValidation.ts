
export const validateAgeAndUnit = (ageValue: number, ageUnit: string, category: string): { isValid: boolean; message: string } => {
    if (!ageValue || !ageUnit) {
      return { isValid: false, message: "This field is required" };
    }

    console.log("Category :",category);
  
    switch (category) {
      case "neonate":
        if (ageUnit !== "days") {
          return { isValid: false, message: "Neonate age should be in days" };
        }
        if (ageValue < 0 || ageValue > 28) {
          return { isValid: false, message: "Neonate age should be between 0 to 28 days" };
        }
        break;
      
        case "1":
          if (ageUnit !== "days") {
            return { isValid: false, message: "Neonate age should be in days" };
          }
          if (ageValue < 0 || ageValue > 28) {
            return { isValid: false, message: "Neonate age should be between 0 to 28 days" };
          }
          break;
  
      case "child":
        if (ageUnit === "days" && ageValue <= 28) {
          return { isValid: false, message: "Child age should be more than 28 days" };
        }
        if (ageUnit === "years" && ageValue > 18) {
          return { isValid: false, message: "Child age should be less than 18 years" };
        }
        if (ageUnit !== "days" && ageUnit !== "years") {
          return { isValid: false, message: "Child age should be in days or years" };
        }
        break;

        case "2":
          if (ageUnit === "days" && ageValue <= 28) {
            return { isValid: false, message: "Child age should be more than 28 days" };
          }
          if (ageUnit === "years" && ageValue > 18) {
            return { isValid: false, message: "Child age should be less than 18 years" };
          }
          if (ageUnit !== "days" && ageUnit !== "years") {
            return { isValid: false, message: "Child age should be in days or years" };
          }
          break;
  
      case "adult":
        if (ageUnit !== "years") {
          return { isValid: false, message: "Adult age should be in years" };
        }
        if (ageValue <= 18) {
          return { isValid: false, message: "Adult age should be more than 18 years" };
        }
        break;

        case "3":
          if (ageUnit !== "years") {
            return { isValid: false, message: "Adult age should be in years" };
          }
          if (ageValue <= 18) {
            return { isValid: false, message: "Adult age should be more than 18 years" };
          }
          break;
  
      default:
        return { isValid: false, message: "Invalid category" };
    }
  
    return { isValid: true, message: "" };
  };