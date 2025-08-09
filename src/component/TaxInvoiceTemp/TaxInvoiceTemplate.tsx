import React, { useEffect, useRef, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import axios from "axios";
import { authFetch } from "../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { PatientType } from "../../types";
const BASE_URL = import.meta.env.VITE_BASE_URL;

interface MedicineItem {
  medicineName: string;
  name: string;
  medicineType: number;
  Frequency: number;
  daysCount: number;
  discount:Discount[] | null;
  hsn:string;
  gst:string | number;
  sellingPrice: number;
  addedOn?: string;
  category:string;
}

interface Discount {
    discount: number;
    discountReason: string;
    discountReasonID: string;
  }

interface Test {
  testID: number;
  testName: string;
  name:string;
  testPrice: number;
  gst: number;
  loinc_num_:string;
}

interface TaxInvoiceTemplateProps {
  currentPatient: PatientType;
  medicineList: any;
  order:any;
  onPdfGenerated: (pdfBlob: Blob) => void; 
}

const TaxInvoiceTemplate: React.FC<TaxInvoiceTemplateProps> = ({
  currentPatient,
  medicineList,
  order,
  onPdfGenerated,
}) => {
  const [, setPdfBlob] = useState<Blob | null>(null);
  const user = useSelector(selectCurrentUser);
 const templateapitrigger = useRef(true);
  console.log("Patient Data In Tax Invoice Template",currentPatient);
  console.log("Medicine Or Test Data In Tax Invoice Template",medicineList);

  const generatePDF = async (imageUrl: string) => {
    try {
      console.log("Fetching image from:", imageUrl);
      const encodedUrl = encodeURIComponent(imageUrl);
      const response = await axios.get(
        `${BASE_URL}template/proxyimage?url=${encodedUrl}`,
        { responseType: "arraybuffer" }
      );
  
      const imageArrayBuffer = response.data;
      const contentType = response.headers["content-type"];
  
      const pdfDoc = await PDFDocument.create();
      let image: any;
  
      if (contentType.includes("png")) {
        image = await pdfDoc.embedPng(imageArrayBuffer);
      } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        image = await pdfDoc.embedJpg(imageArrayBuffer);
      } else {
        throw new Error(`Unsupported image format: ${contentType}`);
      }
  
      const { width, height } = image.scale(1);
      const defaultTextSize = 12;
      const patientInfoTextSize = 10;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      const rowHeight = 22;
      const tableWidth = width * 0.9;
      const tableStartX = (width - tableWidth) / 2;
      const footerHeight = 40;
  
      let currentPage: any, tableStartY: any;
  
      const addPage = () => {
        currentPage = pdfDoc.addPage([width, height]);
        tableStartY = height - 280;
        currentPage.drawImage(image, { x: 0, y: 0, width, height });

        const boxX = 28;
        const boxY = height - 268;
        const boxWidth = width - 55;
        const boxHeight = 160;
        const colWidth = boxWidth / 2;
  
        currentPage.drawRectangle({
          x: boxX,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          borderWidth: 1,
          borderColor: rgb(0.5, 0.5, 0.5),
          color: rgb(1, 1, 1),
        });
  
        let textStartX = boxX + 10;
        let textStartY = boxY + boxHeight - 16;
        const lineSpacing = 18;
  
        currentPage.drawText("Patient Information", {
          x: textStartX,
          y: textStartY,
          size: patientInfoTextSize + 2,
          font: boldFont,
        });
        textStartY -= lineSpacing;
        if (currentPatient.pID != null) {
            currentPage.drawText(`Report ID: ${currentPatient.pID}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.pName != null) {
            currentPage.drawText(`Patient Name: ${currentPatient.pName}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.pUHID != null) {
            currentPage.drawText(`Patient UHID: ${currentPatient.pUHID}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.dob != null) {
            currentPage.drawText(`Age: ${calculateAge(currentPatient.dob)}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.gender != null) {
            currentPage.drawText(`Gender: ${currentPatient.gender === 1 ? "Male" : "Female"}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.address != null) {
            currentPage.drawText(`Address: ${currentPatient.address}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.advice != null) {
            currentPage.drawText(`Advice: ${currentPatient.advice}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.phoneNumber != null) {
            currentPage.drawText(`Phone Number: ${currentPatient.phoneNumber}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          
  
          // Right column - only show fields when non-null
          textStartX = boxX + colWidth + 10;
          textStartY = boxY + boxHeight - 34;
  
          if (currentPatient.doctorName != null) {
            currentPage.drawText(`Consultant: ${currentPatient.doctorName}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.city != null) {
            currentPage.drawText(`City: ${currentPatient.city}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }

          if (currentPatient.id != null) {
            currentPage.drawText(`Admission No: ${currentPatient.id}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.startTime != null || currentPatient.addedOn != null) {
            currentPage.drawText(
              `Admission Date: ${new Date(currentPatient.startTime || currentPatient.addedOn).toLocaleDateString("en-US")}`,
              { x: textStartX, y: textStartY, size: patientInfoTextSize, font }
            );
            textStartY -= lineSpacing;
          }
          if (currentPatient.endTime != null || currentPatient.addedOn != null) {
            currentPage.drawText(
              `Discharge Date: ${new Date(currentPatient.endTime || currentPatient.addedOn).toLocaleDateString("en-US")}`,
              { x: textStartX, y: textStartY, size: patientInfoTextSize, font }
            );
            textStartY -= lineSpacing;
          }
          if (currentPatient.department != null) {
            currentPage.drawText(`Department: ${currentPatient.department}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.wardID != null) {
            currentPage.drawText(`Ward: ${currentPatient.wardID}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          if (currentPatient.referredBy != null) {
            currentPage.drawText(`Referred By: ${currentPatient.referredBy}`, { 
              x: textStartX, 
              y: textStartY, 
              size: patientInfoTextSize, 
              font 
            });
            textStartY -= lineSpacing;
          }
          };
  
      const calculateAge = (dob: string): string => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age.toString();
      };
  
      const drawTableHeader = (headers: string[], startX: number, startY: number, colWidths: number[]) => {
        let xPos = startX;
        headers.forEach((header, index) => {
          currentPage.drawRectangle({
            x: xPos,
            y: startY - rowHeight,
            width: colWidths[index],
            height: rowHeight,
            color: rgb(0.827, 0.827, 0.827),
          });
          currentPage.drawText(header, {
            x: xPos + 5,
            y: startY - 15,
            size: defaultTextSize,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
          currentPage.drawRectangle({
            x: xPos,
            y: startY - rowHeight,
            width: colWidths[index],
            height: rowHeight,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
          });
          xPos += colWidths[index];
        });
      };
  
      const drawTableRow = (rowData: string[], startX: number, startY: number, colWidths: number[]) => {
        let xPos = startX;
        rowData.forEach((data, index) => {
          currentPage.drawText(data, {
            x: xPos + 5,
            y: startY - 15,
            size: defaultTextSize,
            font,
          });
          currentPage.drawRectangle({
            x: xPos,
            y: startY - rowHeight,
            width: colWidths[index],
            height: rowHeight,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
          });
          xPos += colWidths[index];
        });
      };
  
      const drawSectionTitle = (title: string, startX: number, startY: number) => {
        currentPage.drawRectangle({
          x: startX,
          y: startY - 20,
          width: tableWidth,
          height: 20,
          color: rgb(0.098, 0.467, 0.953),
        });
        currentPage.drawText(title, {
          x: startX + 8,
          y: startY - 15,
          size: defaultTextSize,
          font: boldFont,
          color: rgb(1, 1, 1),
        });
      };
  
      addPage();
      let currentY = tableStartY;
  
  
      // Define column widths for Test (3 columns)
      const testColWidths = [
        tableWidth * 0.10, // Sr. No
        tableWidth * 0.10, // Test ID
        tableWidth * 0.48, // Test Name
        tableWidth * 0.08, // GST
        tableWidth * 0.12, // Charges (Price without GST)
        tableWidth * 0.12, // Test Price (Price with GST)
      ];
  
      let totalPrice = 0;
      let lastItemType: "test" | "medicine" | null = null;
  
      medicineList.forEach((item: MedicineItem | Test, index: number) => {
        if (currentY < footerHeight + rowHeight * 2) {
          addPage();
          currentY = tableStartY;
        }
  
        const isTest = "testPrice" in item;
        const currentItemType = isTest ? "test" : "medicine";
  
        // Draw section title only if it's the first item or the item type changes
        if (index === 0 || currentItemType !== lastItemType) {
          drawSectionTitle(
            isTest ? "Test Plan" : "Medicine Plan",
            tableStartX,
            currentY
          );
          currentY -= 21;
        }
  
        if (isTest) {
          // Draw header for Test items (only once per section or page)
          if (
            index === 0 ||
            currentItemType !== lastItemType ||
            currentY === tableStartY - 20
          ) {
            drawTableHeader(
              ["Sr. No", "Test ID", "Test Name", "GST", "Charges", "Test Price"],
              tableStartX,
              currentY,
              testColWidths
            );
            currentY -= rowHeight;
          }
  
          const testPrice = item.testPrice; // Base price (without GST)
          const gstPercentage = Number(item.gst) || 0; // Convert GST to number
          const gstAmount = testPrice * (gstPercentage / 100);
          const totalTestPrice = testPrice + gstAmount; // Price including GST

          const rowData = [
            (index + 1).toString(), // Sr. No
            item.testID?.toString() || item.loinc_num_ || "N/A", // Test ID (optional)
            item.testName || item.name || "N/A", // Test Name
            `${gstPercentage}%`, // GST
            `${testPrice.toFixed(2)}`, // Charges
            `${totalTestPrice.toFixed(2)}`, // Test Price
        ];
  
          drawTableRow(rowData, tableStartX, currentY, testColWidths);
          currentY -= rowHeight;
  
          totalPrice += totalTestPrice; // Add test price to total
        } else {
          // Draw header for MedicineItem items (only once per section or page)
          if (
            index === 0 ||
            currentItemType !== lastItemType ||
            currentY === tableStartY - 20
          ) {
            // Dynamically adjust headers and column widths based on whether daysCount exists
            const hasDaysCount = "daysCount" in item && item.daysCount !== undefined && item.daysCount !== null;
            const medicineHeaders = [
              "Sr. No",
              "HSN Code",
              "Medicine",
              "Category",
              "Quantity",
              ...(hasDaysCount ? ["No. of Days"] : []),
              "Price",
              "Total Price",
            ];
            const medicineColWidths = [
              tableWidth * 0.08, // Sr. No
              tableWidth * 0.11, // HSN Code
              tableWidth * 0.25, // Medicine
              tableWidth * 0.10, // Category
              tableWidth * 0.10, // Quantity
              ...(hasDaysCount
                ? [tableWidth * 0.13] // No. of Days
                : []),
              tableWidth * 0.10, // Price (without GST)
              tableWidth * 0.13, // Total Price (with GST)
            ];
        
            drawTableHeader(medicineHeaders, tableStartX, currentY, medicineColWidths);
            currentY -= rowHeight;
          }
  
          const basePrice =
            (item.sellingPrice || 0) * (item.Frequency || 1) * (item.daysCount || 1); // Price without GST
          const gstPercentage = Number(item.gst) || 0; // Convert GST to number
          const gstAmount = basePrice * (gstPercentage / 100);
          const totalMedicinePrice = basePrice + gstAmount; // Price including GST

        const hasDaysCount = "daysCount" in item && item.daysCount !== undefined && item.daysCount !== null;
        const rowData = [
            (index + 1).toString(), // Sr. No (using index + 1 for simplicity)
            item.hsn || "N/A", // HSN Code
            item.medicineName || item.name || "N/A", // Medicine
            item.medicineType?.toString() || item.category || "N/A", // Category
            item.Frequency?.toString() || "1", // Quantity
            ...(hasDaysCount ? [item.daysCount?.toString() || "N/A"] : []), // No. of Days (only if present)
            `${basePrice.toFixed(2)}`, // Price (without GST)
            `${totalMedicinePrice.toFixed(2)}`, // Total Price (with GST)
        ];

          console.log(rowData, "Row Data");

          const medicineColWidthsDynamic = [
            tableWidth * 0.08, // Sr. No
            tableWidth * 0.11, // HSN Code
            tableWidth * 0.25, // Medicine
            tableWidth * 0.10, // Category
            tableWidth * 0.10, // Quantity
            ...(hasDaysCount ? [tableWidth * 0.13] : []), // No. of Days (only if present)
            tableWidth * 0.10, // Price (without GST)
            tableWidth * 0.13, // Total Price (with GST)
          ];

          drawTableRow(rowData, tableStartX, currentY, medicineColWidthsDynamic);
          currentY -= rowHeight;
  
          totalPrice += totalMedicinePrice;
        }
  
        lastItemType = currentItemType; // Update the last item type
      });
  
      currentY -= 30;
      // Get discount from currentPatient (assuming it's in patient data as shown in your example)
    let discountPercentage = 0;
    let discountAmount = 0;
    let finalTotalPrice = totalPrice;

    if (order.discount && Array.isArray(order.discount) && order.discount.length > 0) {
    discountPercentage = order.discount[0].discount || 0;
    discountAmount = totalPrice * (discountPercentage / 100);
    finalTotalPrice = totalPrice - discountAmount;

    // Draw Subtotal
    currentPage.drawText(`Subtotal: ${totalPrice.toFixed(2)}`, {
        x: tableStartX + tableWidth - 200,
        y: currentY,
        size: defaultTextSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    currentY -= 20;

    // Draw Discount
    currentPage.drawText(`Discount (${discountPercentage}%): -${discountAmount.toFixed(2)}`, {
        x: tableStartX + tableWidth - 200,
        y: currentY,
        size: defaultTextSize,
        font,
        color: rgb(0, 0, 0),
    });
    currentY -= 20;

    // Draw Total after discount
    currentPage.drawText(`Total Price after Discount: ${finalTotalPrice.toFixed(2)}`, {
        x: tableStartX + tableWidth - 200,
        y: currentY,
        size: defaultTextSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    } else {
    // If no discount, just show total price
    currentPage.drawText(`Total Price: ${totalPrice.toFixed(2)}`, {
        x: tableStartX + tableWidth - 200,
        y: currentY,
        size: defaultTextSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    }
  
      currentPage.drawText(`Doctor: ${currentPatient.doctorName || "N/A"}`, {
        x: tableStartX,
        y: footerHeight - 20,
        size: defaultTextSize,
        font: boldFont,
      });
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setPdfBlob(blob);
      onPdfGenerated(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  const fetchTemplates = async (): Promise<void> => {
    try {
      const response = await authFetch(
        `template/${user.hospitalID}/${user.id}`,
        user.token
      );
      if (response?.templates?.length > 0) {
        const imgurl: string = response.templates[1].fileURL;
        await generatePDF(imgurl);
      } else {
        console.warn("No templates found.");
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    if(templateapitrigger.current && templateapitrigger.current == true){
        fetchTemplates();
        templateapitrigger.current = false;
    }
    
  }, []);

  return null; // No UI needed since the parent handles the download
};

export default TaxInvoiceTemplate;