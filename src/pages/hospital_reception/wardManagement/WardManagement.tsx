import { Floor } from "../../../types";
import Dropdown from "../../dashboard_reception/DropdownCustom/Dropdown";
import styles from "./WardManagement.module.scss";

const wardData: Floor[] = [
  {
    id: "floor-0",
    name: "Ground Floor",
    wards: [
      {
        id: "ward-0-1",
        name: "Executive Ward",
        beds: [
          { id: "bed-0-1-1", name: "EW-01", status: "occupied" },
          { id: "bed-0-1-2", name: "EW-02", status: "available" },
          { id: "bed-0-1-3", name: "EW-03", status: "available" },
          { id: "bed-0-1-4", name: "EW-04", status: "occupied" },
          { id: "bed-0-1-5", name: "EW-05", status: "occupied" },
          { id: "bed-0-1-6", name: "EW-06", status: "occupied" },
          { id: "bed-0-1-7", name: "EW-07", status: "available" },
          { id: "bed-0-1-8", name: "EW-08", status: "occupied" },
          { id: "bed-0-1-9", name: "EW-09", status: "available" },
          { id: "bed-0-1-10", name: "EW-10", status: "occupied" },
          { id: "bed-0-1-11", name: "EW-11", status: "available" },
          { id: "bed-0-1-12", name: "EW-12", status: "occupied" },
          { id: "bed-0-1-13", name: "EW-13", status: "available" },
          { id: "bed-0-1-14", name: "EW-14", status: "occupied" },
          { id: "bed-0-1-15", name: "EW-15", status: "available" },
          { id: "bed-0-1-16", name: "EW-16", status: "occupied" },
          { id: "bed-0-1-17", name: "EW-17", status: "available" },
          { id: "bed-0-1-18", name: "EW-18", status: "occupied" },
          { id: "bed-0-1-19", name: "EW-19", status: "available" },
          { id: "bed-0-1-20", name: "EW-20", status: "occupied" },
        ],
        details: {
          rent: 5000,
          peopleAllowed: 1,
          amenities: [
            "Air conditioned",
            "Automatic bed",
            "Attached washroom with shower",
            "Refrigerator",
            "WIFI (internet)",
          ],
        },
      },
      {
        id: "ward-0-2",
        name: "Intensive Ward",
        beds: [
          { id: "bed-0-2-1", name: "IW-01", status: "occupied" },
          { id: "bed-0-2-2", name: "IW-02", status: "occupied" },
        ],
        details: {
          rent: 3000,
          peopleAllowed: 2,
          amenities: [
            "Manual bed",
            "Common washroom",
            "Sink",
            "LED Television",
            "Water Purifier",
          ],
        },
      },
      {
        id: "ward-0-3",
        name: "Maternity Ward",
        beds: [
          { id: "bed-0-3-1", name: "MW-01", status: "available" },
          { id: "bed-0-3-2", name: "MW-02", status: "available" },
        ],
        details: {
          rent: 4000,
          peopleAllowed: 1,
          amenities: [
            "Coffee and Tea Machine",
            "Books and board games",
            "Choice of Multi cuisine diet",
            "Microwave",
            "Separate living and dining area",
          ],
        },
      },
    ],
  },
  {
    id: "floor-1",
    name: "1st Floor",
    wards: [
      {
        id: "ward-1-1",
        name: "Neonatal Ward",
        beds: [
          { id: "bed-1-1-1", name: "NW-01", status: "available" },
          { id: "bed-1-1-2", name: "NW-02", status: "occupied" },
        ],
        details: {
          rent: 4500,
          peopleAllowed: 1,
          amenities: [
            "Incubator",
            "Patient Attendant bed",
            "Air conditioned",
            "Nurse Call",
            "Sofa set for guest",
          ],
        },
      },
      {
        id: "ward-1-2",
        name: "Pediatric Ward",
        beds: [
          { id: "bed-1-2-1", name: "PW-01", status: "available" },
          { id: "bed-1-2-2", name: "PW-02", status: "occupied" },
        ],
        details: {
          rent: 3500,
          peopleAllowed: 1,
          amenities: [
            "TV",
            "Wifi",
            "Play Area",
            "Refrigerator",
            "Attached washroom with shower",
          ],
        },
      },
    ],
  },
  {
    id: "floor-2",
    name: "2nd Floor",
    wards: [
      {
        id: "ward-2-1",
        name: "Executive Ward",
        beds: [
          { id: "bed-2-1-1", name: "EW-01", status: "occupied" },
          { id: "bed-2-1-2", name: "EW-02", status: "available" },
          { id: "bed-2-1-3", name: "EW-03", status: "available" },
          { id: "bed-2-1-4", name: "EW-04", status: "occupied" },
          // Continue similar updates for other beds
        ],
        details: {
          rent: 5000,
          peopleAllowed: 1,
          amenities: [
            "Air conditioned",
            "Automatic bed",
            "Attached washroom with shower",
            "frige",
            "WIFI (internet)",
          ],
        },
      },
    ],
  },
];



const WardManagement = () => {
  return (
    <div className={styles.container}>
      <h3 style ={{fontWeight:"500"}}>Ward Management</h3>
      {wardData.map((floor) => (
        <Dropdown key={floor.id} title={floor.name} wards={floor.wards} />
      ))}
    </div>
  );
};

export default WardManagement;
