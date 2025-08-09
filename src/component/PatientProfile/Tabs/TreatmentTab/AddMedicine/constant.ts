import { ChecklistItemUrinaryCentralCatheter,TimeUnit } from "../../../../../interfaces/procedures";
import o2 from "../../../../../assets/treatmentPlan/procedures/ventilator/o2.png";
import IFRUpdated from "../../../../../assets/treatmentPlan/procedures/ventilator/IFRUpdated.png";
import tidal from "../../../../../assets/treatmentPlan/procedures/ventilator/tidal.png";
import respiratory from "../../../../../assets/treatmentPlan/procedures/ventilator/respiratory.png";
import peep from "../../../../../assets/treatmentPlan/procedures/ventilator/peep.png";
import PIP from "../../../../../assets/treatmentPlan/procedures/ventilator/PIP.png";
import lowPressure from "../../../../../assets/treatmentPlan/procedures/ventilator/lowPressure.png"
import highPressure from "../../../../../assets/treatmentPlan/procedures/ventilator/highPressure.png"
import timeAtHighPressure from "../../../../../assets/treatmentPlan/procedures/ventilator/timeAtHighPressure.png"
import timeAtLowPressure from "../../../../../assets/treatmentPlan/procedures/ventilator/timeAtLowPressure.png"
import TMV from "../../../../../assets/treatmentPlan/procedures/ventilator/TMV.png"
import PSL from "../../../../../assets/treatmentPlan/procedures/ventilator/PSL.png"
import ventilator_management_banner from "../../../../../assets/treatmentPlan/procedures/ventilator/ventilator_management.png"
import cpr_icon from "../../../../../assets/treatmentPlan/procedures/ventilator/cpr_icon.png"
import central_line_icon from "../../../../../assets/treatmentPlan/procedures/ventilator/central_line_icon.png"
import Urinary_Catheter_Insertion from "../../../../../assets/treatmentPlan/procedures/ventilator/Urinary_Catheter_Insertion.png"

export const ventilatorCheckboxOptions = [
  "Adherence to hand hygiene",
  "Assessing PUD (peptic ulcer disease) prophylaxis",
  "Reading for ventilator removal",
  "Maintain Head of Bed (HOB) at 30-45 degrees",
  "Perform oral care with chlorhexidine",
  "Perform Endotracheal (ET) suction ensuring the catheter does not exceed the ET tube level",
  "Apply Deep Vein Thrombosis (DVT) prophylaxis",
  "Assess readiness for weaning from the ventilator and interruption of sedation daily",
  "Ensure cuff pressure is intact"
];

export const proceduresOptions = [
  {
  procedureType : "Ventilator Management" , 
  imgSrc : ventilator_management_banner  
},
  {procedureType : "Cardiopulmonary Resuscitation (CPR)", 
    imgSrc : cpr_icon 
  }
  ,
  {
   procedureType: "Central Line Insertion", 
  imgSrc : central_line_icon }
  ,

 {procedureType: "Urinary Catheter Insertion", 
  imgSrc : Urinary_Catheter_Insertion
  } 
];

export const ventilationModes = [
  "Volume-Controlled Ventilation (VCV)",
  "Airway Pressure Release Ventilation (APRV)",
  "Adaptive Support Ventilation (ASV)",
  "Pressure Support Ventilation (PSV)",
  "Synchronized Intermittent Mandatory Ventilation (SIMV)",
  "Pressure-Controlled Ventilation (PCV)"
];

export const initialCentralLineCheckList: ChecklistItemUrinaryCentralCatheter[] =
  [
    { id: 1, label: "Daily aseptic care with hand hygiene", checked: false },
    {
      id: 2,
      label: "Daily aseptic care with alcohol hub decontamination",
      checked: false
    },
    {
      id: 3,
      label: "Using Chlorhexidine 0.5% w/v for dressing changes",
      checked: false
    },
    { id: 4, label: "Monitoring infection signs", checked: false },
    { id: 5, label: "Monitoring documenting dressing changes", checked: false },
    { id: 6, label: "Readiness for central line removal", checked: false }
  ];

export const initialUrinaryCheckList: ChecklistItemUrinaryCentralCatheter[] = [
  { id: 1, label: "Closed Drainage system", checked: false },
  { id: 2, label: "Proper catheter care hand hygiene", checked: false },
  { id: 3, label: "Proper catheter meatal care", checked: false },
  { id: 4, label: "Use of gloves while emptying", checked: false },
  { id: 5, label: "Avoiding jug contact", checked: false },
  { id: 6, label: "Using separate jugs", checked: false },
  {
    id: 7,
    label: "Assessing readiness for catheter removal",
    checked: false
  }
];

export const initialCatheterList: ChecklistItemUrinaryCentralCatheter[] = [
  {
    id: 1,
    label: "Check clinical indication for catheter retention",
    checked: false
  },
  {
    id: 2,
    label: "Maintain hand hygiene and adhere to standard precautions",
    checked: false
  },
  {
    id: 3,
    label:
      "Ensure a continuous closed drainage system and secure catheter placement",
    checked: false
  },
  {
    id: 4,
    label:
      "Ensure the catheter is below bladder level and does not rest on the floor",
    checked: false
  },
  {
    id: 5,
    label: "Regularly empty the urine collection bag",
    checked: false
  },
  { id: 6, label: "Using separate jugs", checked: false },
  {
    id: 7,
    label: "Assessing readiness for catheter removal",
    checked: false
  }
];

export const measurementConfig = [
  {
    key: "FIO2",
    title: "Fraction of inspired Oxygen (FIO2)",
    unit: "%",
    imageSrc: o2,
    altText: "FI02",
    bgColor: "#E1F1FB"
  },
  {
    key: "IFR",
    title: "Inspiratory Flow Rate (IFR)",
    unit: "L/minute",
    imageSrc: IFRUpdated,
    altText: "IFR",
    bgColor: "#E7EFFE"
  },
  {
    key: "tidalVolume",
    title: "Tidal Volume",
    unit: "mL",
    imageSrc: tidal,
    altText: "tidal card",
    bgColor: "#FFF9DA"
  },
  {
    key: "PIP",
    title: "Peek Inspiratory Pressure (PIP)",
    unit: "cmH20",
    imageSrc: PIP,
    altText: "Peep Image",
    bgColor: "#FFD1E4"
  },
  {
    key: "RR",
    title: "Respiratory rate (RR)",
    unit: "Breaths/min",
    imageSrc: respiratory,
    altText: "Respiratory image",
    bgColor: "#FEE7F9"
  },
  {
    key: "PEEP",
    title: "Positive End-Expiratory Pressure (PEEP)",
    unit: "cmH20",
    imageSrc: peep,
    altText: "Peep Image",
    bgColor: "#FDE8DE"
  },
  {
    key : "LPL", 
    title : "Low Pressure Level (LPL)", 
    unit : "cmH20", 
    imageSrc : lowPressure, 
    altText: "LPL Image",
    bgColor:"#ECFFDA" 
  }, 
  {
    key :"HPL", 
    title:"High Pressure Level (HPL)", 
    unit :"cmH20", 
    imageSrc:highPressure,
    altText: "HPL Image", 
    bgColor :"#DAFFFF"
  }, 
  {
    key : "THP", 
    title: "Time at High Pressure (THP)", 
    unit : "seconds (s)", 
    imageSrc: timeAtHighPressure, 
    altText: "THP Image",
    bgColor:"#E9D2F9"
  },
  {
    key : "TLP", 
    title : "Time at Low Pressure (TLP)",
    unit :"seconds (s)", 
    imageSrc:timeAtLowPressure ,
    bgColor:"#FFDBF4"
  }, 
  {
    key :"TMV",
    title:"Target Minute Ventilation (TMV)", 
    unit :"cmH20", 
    imageSrc:TMV, 
    altText : "TMV Image", 
    bgColor: "#FFF6EE"
  }, 
  {
    key :"PSL", 
    title : "Presure Support Level (PSL)", 
    unit : "cmH20", 
    imageSrc: PSL, 
    altText : "PSL Image", 
    bgColor:"#F9D9D2"
  }

];
export const modeConfig = {
  "Volume-Controlled Ventilation (VCV)": ["FIO2", "IFR", "tidalVolume","PSL", "RR", "PEEP"],
  "Airway Pressure Release Ventilation (APRV)": ["FIO2", "LPL", "HPL", "THP", "TLP", "IFR"],
  "Adaptive Support Ventilation (ASV)": ["FIO2", "IFR", "tidalVolume", "TMV", "RR", "PEEP"],
  "Pressure Support Ventilation (PSV)": ["FIO2", "PEEP", "PSL"],
   "Synchronized Intermittent Mandatory Ventilation (SIMV)": ["FIO2","tidalVolume", "PSL", "RR", "PEEP"],
   "Pressure-Controlled Ventilation (PCV)": ["FIO2", "IFR", "tidalVolume", "PIP", "RR","PEEP"]
};


export const timeUnits:TimeUnit[] = [
  { singular: "Hour", plural: "Hours" },
  { singular: "Day", plural: "Days" },
  { singular: "Week", plural: "Weeks" }
];


export const dropdownOptions = {
  patientPreparation: [
    { value: "Trendelenburg (IJ/Subclavian)", label: "Trendelenburg (IJ/Subclavian)" },
    { value: "Supine (Femoral)", label: "Supine (Femoral)" },
  ],
  insertionSite: [
    { value: "Internal Jugular Vein", label: "Internal Jugular Vein" },
    { value: "Subclavian Vein", label: "Subclavian Vein" },
    { value: "Femoral Vein", label: "Femoral Vein" },
  ],
  lumenType: [
    { value: "Single Lumen", label: "Single Lumen" },
    { value: "Double Lumen", label: "Double Lumen" },
    { value: "Triple Lumen", label: "Triple Lumen" },
    {value :"Quadruple Lumen", label:"Quadruple Lumen"}
  ],
  localAnesthesiaGuidewireInsertion: [
    {value : "Local Anesthesia Used (Auto-selected if applicable: Lignocaine 1-2%)", label :"Local Anesthesia Used (Auto-selected if applicable: Lignocaine 1-2%)"},
    {value : "Guidewire & Dilator Inserted", label: "Guidewire & Dilator Inserted"}, 
    {value :"Catheter Advanced (~15-25cm)", label :"Catheter Advanced (~15-25cm)"}
  ]
};


export const dailyMaintainanceCheckList:ChecklistItemUrinaryCentralCatheter[] = [
  {id:1, label:"Perform daily aseptic hand hygiene", checked:false},
  {id : 2, label: 
  "Conduct daily aseptic insertion site care", checked:false
  },
  {id : 3, label:
  "Perform dressing changes using chlorhexidine 0.5% w/v and sterile technique", checked:false
  },
  {id:4, label :
  "Check securement device integrity",checked:false},
  {id:5, label:
  "Assess catheter patency through flushing", checked:false},
  {id:6, label: 
  "Monitor for local and systemic infection signs",checked:false},
  {id:7, label:
  "Monitor and document dressing changes", checked:false},
  {id:8, label: 
  "Assess daily for central line removal readiness", checked:false}
]

export const initialProcedureSpecificChecklist:ChecklistItemUrinaryCentralCatheter[]= [
  { id: 101, label: "Monitor for air embolism signs", checked: false },
  { id: 102, label: "Verify catheter tip placement post-insertion", checked: false },
  { id: 103, label: "Perform hand hygiene before procedure", checked: false },
  { id: 104, label: "Complete sterile prep", checked: false },
  { id: 105, label: "Apply Chlorhexidine 2% and let dry", checked: false },
  { id: 106, label: "Total Parenteral Nutrition (TPN)", checked: false },
  { id: 107, label: "Hemodialysis", checked: false },
  { id: 108, label: "Frequent Blood Draws", checked: false },
  { id: 109, label: "Long-term Antibiotic Therapy", checked: false },
  { id: 110, label: "Other (Free-text field)", checked: false },
  { id: 111, label: "Apply full draping", checked: false },
  { id: 112, label: "Apply sutures/securement device", checked: false },
  { id: 113, label: "Apply dressing", checked: false },
  { id: 114, label: "Placement confirmed (X-ray/ECG)", checked: false }
];

export const  dropdownOptionsCatheterInsertion = {
  catheterSizes: [
    {value : "Single Lumen", label :"Single Lumen"},
    {value :"Adult Female: 12-14 Fr", label : "Adult Female: 12-14 Fr"},
    {value :"Adult Male: 14-16 Fr", label :"Adult Male: 14-16 Fr"},
    {value :"Patients with clots/hematuria: 18-24 Fr", label: "Patients with clots/hematuria: 18-24 Fr"}
  ],
  typesOfUrinaryCatheter: [
    
      { value: "indwelling", label: "Indwelling (Foley) Catheter" },
      { value: "intermittent", label: "Intermittent (Straight) Catheter" },
      { value: "external", label: "External (Condom) Catheter" },
      { value: "suprapubic", label: "Suprapubic Catheter" },
      { value: "coude", label: "Coude (Curved-Tip) Catheter" }
    
    
  ],
  patientPositioningAsepticSetup:[
    {
      value: "position_patient",
      label: "Position patient properly (Male: supine, Female: dorsal recumbent)"
    },
    {
      value: "hand_hygiene",
      "label": "Perform hand hygiene & wear sterile gloves"
    },
    {
      value: "manual_input",
      label: "Clean perineal/genital area with antiseptic",
      allowManualInput: true
    }
  ]
}

export const initialDailyMaintainanceCheckListUrinaryCatheter:ChecklistItemUrinaryCentralCatheter[]= [
  {id:201, label:"Perform hand hygiene before and after care", checked:false},
  {id : 202, label: 
  "Ensure continuous closed drainage system", checked:false
  },
  {id : 203, label:
  "Position drainage bag below bladder level, off the floor", checked:false
  },
  {id:204, label :
  "Empty drainage bag regularly using gloves, avoiding contamination",checked:false},
  {id:205, label:
  "Use separate collection containers (jugs) per patient", checked:false},
  {id:206, label: 
  "Perform regular meatal hygiene",checked:false},
  {id:207, label:
  "Monitor urine output, color, discomfort, retention, and signs of infection", checked:false},
  {id:208, label: 
  "Assess daily for central line removal readiness", checked:false}
]

export const initialProcedureSpecificChecklistUrinaryCatheter:ChecklistItemUrinaryCentralCatheter[] = [
  { id: 301, label: "Verify physician’s order & clinical need for catheter", checked: false },
  { id: 302, label: "Explain procedure & obtain consent", checked: false },
  { id: 303, label: "Gather supplies (catheter kit, gloves, antiseptic, lubricant, collection bag)", checked: false },
  { id: 304, label: "Maintain sterile insertion technique", checked: false },
  { id: 305, label: "Apply sterile drapes & lubricate catheter tip", checked: false },
  { id: 306, label: "Insert catheter and inflate balloon as per guidelines", checked: false },
  { id: 307, label: "Secure catheter to prevent dislodgement", checked: false },
  { id: 308, label: "Remove catheter when no longer needed", checked: false },
  { id: 309, label: "Deflate balloon and remove gently", checked: false },
  { id: 310, label: "Educate patient on post-removal care", checked: false },
  { id: 311, label: "Document insertion, maintenance, removal, patient tolerance, and any complications", checked: false }
];
