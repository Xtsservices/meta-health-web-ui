import React from "react";
import styles from "./WardCard.module.scss";
import { Ward } from "../../../types";

import airConditionar from "../../../assets/reception/airconditioner.png";
import automaticbed from "../../../assets/reception/automaticbed.png";
import balanceddite from "../../../assets/reception/balanceddiet.png";
import bathroom from "../../../assets/reception/bathroom.png";
import booksshelf from "../../../assets/reception/bookshelf.png";
import coffee from "../../../assets/reception/coffee.png";
import manualbed from "../../../assets/reception/manualbed.png";
import oven from "../../../assets/reception/oven.png";
import fridge from "../../../assets/reception/refrigerator.png";
import sink from "../../../assets/reception/sink.png";
import smarttv from "../../../assets/reception/smarttv.png";
import waterpurifier from "../../../assets/reception/waterpurifier.png";
import wifi from "../../../assets/reception/wifi.png";
import sofa from "../../../assets/reception/sofa.png";
import defaultImage from "../../../assets/reception/defaultImage.png"; // Default image

interface WardCardProps {
  ward: Ward;
}

// Map amenities to images
const amenityImages: { [key: string]: string } = {
  "Air conditioned": airConditionar,
  "Automatic bed": automaticbed,
  "Choice of Multi cuisine diet": balanceddite,
  "Attached washroom with shower": bathroom,
  "Books and board games": booksshelf,
  "Coffee and Tea Machine": coffee,
  "WIFI (internet)": wifi,
  "Manual bed": manualbed,
  Microwave: oven,
  Refrigerator: fridge,
  Sink: sink,
  "LED Television": smarttv,
  "Water Purifier": waterpurifier,
  "Patient Attendant bed": manualbed,
  "Sofa set for guest": sofa,
  "Common washroom": bathroom,
  // Add more mappings as needed
};

const WardCard: React.FC<WardCardProps> = ({ ward }) => {
  const { rent, peopleAllowed, amenities } = ward.details;

  // Helper function to find the correct image for an amenity
  const getAmenityImage = (amenity: string) => {
    const matchedKey = Object.keys(amenityImages).find((key) =>
      key.toLowerCase().includes(amenity.toLowerCase())
    );
    return matchedKey ? amenityImages[matchedKey] : defaultImage;
  };

  return (
    <div className={styles.wardCard}>
      <ul className={styles.detailList}>
        <li className={styles.detailItem}> 
          <p className={styles.text_style}>Rent</p>
          <p className={styles.text_style}>{rent}$</p>
          </li>
        <hr style={{ border: "1px solid #0000001A", width: "100%", opacity:"50%" }} />

        <li className={styles.detailItem}>
          <p className={styles.text_style}>People Allowed  </p>
          <p className={styles.text_style}>{peopleAllowed} {peopleAllowed>1 ? "Members" : "Member"} only </p>
          </li>
        <hr style={{  border: "1px solid #0000001A", width: "100%", opacity:"50%" }} />

        <li className={styles.detailItem}>
          Amenities
         
          <ul className={styles.amenitiesList}>
            {amenities.map((amenity, index) => (
              <li key={index} className={styles.amenityItem}>
                <img
                  src={getAmenityImage(amenity)} // Use helper function
                  alt={amenity}
                  className={styles.amenityImage}
                />
                {/* <span>{amenity}</span> */}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default WardCard;
