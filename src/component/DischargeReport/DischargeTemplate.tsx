import React, { useEffect, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import axios from "axios";
import { authFetch } from "../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { Alerttype, attachmentType, medicalHistoryFormType, PatientType, symptompstype, testType, vitalFunctionType } from "../../types";
import { Reminder } from "../../store/zustandstore";
import { setError } from "../../store/error/error.action";
import defaultTemplate from '../../assets/Default_Template.png';
import { useLocation } from "react-router-dom";
import html2canvas from 'html2canvas';
import Chart from 'chart.js/auto';

const medicineCategory = {
  capsules: 1,
  tablets: 2,
  injections: 3,
  syrups: 4,
  Tubing: 5,
} as const;

type HomecareVitalFunctionType = {
  message: string;
  heartRate?: { avg: string; min: string; max: string };
  temperature?: { avg: string; min: string; max: string };
  spo2?: { avg: string; min: string; max: string };
  respiratoryRate?: { avg: string; min: string; max: string };
  heartRateVariability?: { avg: string; min: string; max: string };
  batteryPercentage?: { avg: string; min: string; max: string };
};

const DischargeTemplate: React.FC<DischargeTemplateProps> = ({
  currentPatient,
  data,
  printSelectOptions,
}) => {
  const {
    reminder,
    symptoms,
    vitalFunction,
    selectedTestList,
    medicalHistory,
  } = data;
  const dispatch = useDispatch();
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");
  const isHomecarePatient = currentPatient?.role === "homecarepatient";

  const fetchVitalHistory = async (category: string): Promise<any[]> => {
    try {
      const hospitalID = isCustomerCare ? currentPatient.hospitalID : user.hospitalID;
      let response;
      if (isHomecarePatient) {
        response = await authFetch(`vitals/getHomecarePatientVitalFunctions/${currentPatient.id}`, user.token);
      } else {
        response = await authFetch(
          `vitals/${hospitalID}/${currentPatient.id}/singleVital?vital=${category}`,
          user.token
        );
      }

      if (response.message === "success") {
        if (isHomecarePatient) {
          const vitalData = response[category as keyof HomecareVitalFunctionType];
          return vitalData ? [vitalData] : [];
        }
        return response.vitals || [];
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${category} history:`, error);
      return [];
    }
  };

  const isApiTrigger = useRef(true);
  const user = useSelector(selectCurrentUser);

const generateVitalGraph = async (history: any[], category: string): Promise<ArrayBuffer> => {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '650px';
  tempDiv.style.height = '250px';
  tempDiv.style.backgroundColor = '#f5f5f5';
  tempDiv.style.padding = '10px';
  tempDiv.style.fontFamily = 'Roboto, sans-serif';
  document.body.appendChild(tempDiv);

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const title = `${
    category === 'bp' ? 'Blood Pressure' :
    category === 'temperature' ? 'Temperature' :
    category === 'pulse' || category === 'heartRate' ? 'Pulse' :
    category === 'oxygen' || category === 'spo2' ? 'Oxygen' :
    category === 'respiratoryRate' ? 'Respiratory Rate' :
    category === 'heartRateVariability' || category === 'hrv' ? 'HRV' :
    category === 'batteryPercentage' ? 'Battery Percentage' : category.charAt(0).toUpperCase() + category.slice(1)
  } History`;

  const titleDiv = document.createElement('div');
  titleDiv.style.textAlign = 'center';
  titleDiv.style.fontSize = '12px';
  titleDiv.style.fontWeight = '500';
  titleDiv.style.color = '#000';
  titleDiv.style.marginBottom = '5px';
  titleDiv.textContent = title;
  tempDiv.appendChild(titleDiv);

  const canvas = document.createElement('canvas');
  canvas.width = 650;
  canvas.height = 230;
  canvas.style.width = '650px';
  canvas.style.height = '230px';
  tempDiv.appendChild(canvas);

  const chartData = history
    .map((record, index) => {
      // For pulse, use pulseTime; fallback to addedOn
      let rawTime = category === 'pulse' ? (record.pulseTime || record.addedOn) : record[`${category}Time`] || record.addedOn;
      if (!rawTime) {
        console.warn(`No valid timestamp for ${category} at index ${index} (id: ${record.id}):`, record);
        return null;
      }

      let timestamp: number;
      if (typeof rawTime === 'number') {
        timestamp = rawTime < 1e12 ? rawTime * 1000 : rawTime;
      } else {
        timestamp = Date.parse(rawTime);
        if (isNaN(timestamp)) {
          console.warn(`Invalid timestamp for ${category} at index ${index} (id: ${record.id}):`, rawTime);
          return null;
        }
      }

      // Validate timestamp (e.g., exclude dates before 2025 if addedOn is 2025)
      const date = new Date(timestamp);
      const addedOnDate = new Date(record.addedOn);
      if (date.getFullYear() < addedOnDate.getFullYear() - 1) {
        console.warn(`Timestamp too old for ${category} at index ${index} (id: ${record.id}):`, rawTime);
        return null;
      }

      if (category === 'bp') {
        const bp = record.bp;
        if (!bp || typeof bp !== 'string' || bp === '') {
          console.warn(`Invalid or missing BP value at index ${index} (id: ${record.id}):`, bp);
          return null;
        }
        const bpValues = bp.split('/');
        const systolic = parseFloat(bpValues[0]);
        const diastolic = parseFloat(bpValues[1]);
        if (isNaN(systolic) || isNaN(diastolic) || systolic <= 0 || diastolic <= 0) {
          console.warn(`Invalid BP values at index ${index} (id: ${record.id}):`, bp);
          return null;
        }
        return { timestamp, systolic, diastolic };
      } else {
        let value: number = parseFloat(record[category]) || 0;
        if (isNaN(value) || value <= 0) {
          console.warn(`Invalid or zero value for ${category} at index ${index} (id: ${record.id}):`, record[category]);
          return null;
        }
        // Pulse-specific validation
        if (category === 'pulse') {
          if (value < 0 || value > 200) {
            console.warn(`Pulse out of range (0-200 bpm) at index ${index} (id: ${record.id}):`, value);
            return null;
          }
        }
        return { timestamp, value };
      }
    })
    .filter(data => data !== null) as { timestamp: number; value?: number; systolic?: number; diastolic?: number }[];

  // Sort by timestamp
  chartData.sort((a, b) => a.timestamp - b.timestamp);

  console.log(`Chart data for ${category}:`, chartData);
  console.log(`Chart dimensions: width=650px, height=230px`);

  if (chartData.length === 0) {
    console.warn(`No valid data for ${category} graph`);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, 650, 230);
      ctx.fillStyle = '#333';
      ctx.font = '16px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`No valid data available for ${category}`, 325, 115);
    }
    const imageDataUrl = canvas.toDataURL('image/png');
    const response = await fetch(imageDataUrl);
    const arrayBuffer = await response.arrayBuffer();
    document.head.removeChild(fontLink);
    document.body.removeChild(tempDiv);
    return arrayBuffer;
  }

  const getLineColor = (category: string, isSystolic = false) => {
    if (category === 'bp') {
      return isSystolic ? '#d32f2f' : '#1976d2';
    }
    const colorMap: { [key: string]: string } = {
      pulse: '#388e3c',
      heartRate: '#388e3c',
      temperature: '#f57c00',
      oxygen: '#0288d1',
      spo2: '#0288d1',
      respiratoryRate: '#7b1fa2',
      heartRateVariability: '#c2185b',
      hrv: '#c2185b',
      batteryPercentage: '#455a64',
    };
    return colorMap[category] || '#4db6ac';
  };

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Include year in labels
  const labels = chartData.map(data => new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

  const datasets = category === 'bp' ? [
    {
      label: 'Systolic BP',
      data: chartData.map(data => data.systolic),
      borderColor: getLineColor('bp', true),
      backgroundColor: getLineColor('bp', true),
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
    },
    {
      label: 'Diastolic BP',
      data: chartData.map(data => data.diastolic),
      borderColor: getLineColor('bp'),
      backgroundColor: getLineColor('bp'),
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
    },
  ] : [
    {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      data: chartData.map(data => data.value),
      borderColor: getLineColor(category),
      backgroundColor: getLineColor(category),
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
    },
  ];

  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: category === 'bp',
          position: 'bottom',
          labels: {
            font: { size: 10, family: 'Roboto, sans-serif' },
            color: '#000',
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#ffffff',
          titleFont: { size: 10, family: 'Roboto, sans-serif', weight: 'normal' },
          bodyFont: { size: 10, family: 'Roboto, sans-serif' },
          titleColor: '#333',
          bodyColor: '#555',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          cornerRadius: 4,
          padding: 8,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
            font: { size: 10, family: 'Roboto, sans-serif' },
            color: '#000',
          },
          ticks: {
            font: { size: 8, family: 'Roboto, sans-serif' },
            color: '#000',
          },
          grid: { color: '#e0e0e0', lineWidth: 1 },
        },
        y: {
          title: {
            display: true,
            text: category === 'pulse' ? 'Pulse (bpm)' : 'Value',
            font: { size: 10, family: 'Roboto, sans-serif' },
            color: '#000',
          },
          ticks: {
            font: { size: 8, family: 'Roboto, sans-serif' },
            color: '#000',
          },
          grid: { color: '#e0e0e0', lineWidth: 1 },
          beginAtZero: false,
        },
      },
      layout: {
        padding: { top: 10, right: 20, bottom: 10, left: 20 },
      },
    },
  });

  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const canvas = await html2canvas(tempDiv, {
      width: 650,
      height: 250,
      scale: 1,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    });
    const imageDataUrl = canvas.toDataURL('image/png');
    const response = await fetch(imageDataUrl);
    const arrayBuffer = await response.arrayBuffer();
    document.head.removeChild(fontLink);
    document.body.removeChild(tempDiv);
    return arrayBuffer;
  } catch (error) {
    document.head.removeChild(fontLink);
    document.body.removeChild(tempDiv);
    console.error('Error rendering chart:', error);
    throw error;
  }
};

  const generatePDF = async (imageUrl: string): Promise<void> => {
    try {
      console.log("Fetching image from:", imageUrl);
      let imageArrayBuffer: ArrayBuffer;
      let contentType: string;

      // Check if the imageUrl is the default template (local asset)
      if (imageUrl === defaultTemplate) {
        // Fetch the local image directly
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch local image: ${response.statusText}`);
        }
        imageArrayBuffer = await response.arrayBuffer();
        contentType = response.headers.get("content-type") || "image/png"; // Default to PNG if content-type is missing
      } else {
        // Use the proxy API for external URLs
        const encodedUrl = encodeURIComponent(imageUrl);
        const response = await axios.get(
          `http://localhost:3002/api/v1/template/proxyimage?url=${encodedUrl}`,
          { responseType: "arraybuffer" }
        );
        imageArrayBuffer = response.data;
        contentType = response.headers["content-type"];
      }

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
      const defaultTextSize = 10;
      const pageTextSize = 8;
      const patientInfoTextSize = 10;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      const rowHeight = 22;
      const tableWidth = width * 0.9;
      const tableStartX = (width - tableWidth) / 2;
      const mmToPoints = (mm: number): number => mm * 2.83465;
      const footerY = mmToPoints(20);
      const pageNumberY = mmToPoints(2);
      const paddingPx = 5;
      const bufferZone = mmToPoints(35);
  
      let currentPage: any;

      const tableStartYFirstPage: number = height - 280; // For first page with patient info
      const tableStartYSubsequent: number = height - mmToPoints(40); // 35mm from top for subsequent pages
      let pageNumber = 0;
      let currentY=0;
  
      const drawPatientInfo = (): void => {
        const boxX = 28;
        const boxY = height - 265;
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
        if (currentPatient.pID) {currentPage.drawText(`Report ID: ${currentPatient.pID}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.pName) {currentPage.drawText(`Patient Name: ${currentPatient.pName}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.pUHID) {currentPage.drawText(`Patient UHID: ${currentPatient.pUHID}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.dob) {currentPage.drawText(`Age: ${currentPatient.dob ? calculateAge(currentPatient.dob) : "0"}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.gender) {currentPage.drawText(`Gender: ${currentPatient.gender === 1 ? "Male" : "Female"}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.address) {currentPage.drawText(`Address: ${currentPatient.address || "N/A"}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.advice) {currentPage.drawText(`Advice: ${currentPatient.advice || "N/A"}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });}
  
        textStartX = boxX + colWidth + 10;
        textStartY = boxY + boxHeight - 34;
  
        if (currentPatient.doctorName) {currentPage.drawText(`Consultant: ${currentPatient.doctorName || "N/A"}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.id) {currentPage.drawText(`Admission No: ${currentPatient.id}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.startTime) {currentPage.drawText(`Admission Date: ${new Date(currentPatient.startTime).toLocaleDateString("en-US")}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.endTime) {currentPage.drawText(`Discharge Date: ${new Date(currentPatient.endTime).toLocaleDateString("en-US")}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.department) {currentPage.drawText(`Department: ${currentPatient.department}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.wardID) {currentPage.drawText(`Ward: ${currentPatient.wardID}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });
        textStartY -= lineSpacing;}
        if (currentPatient.referredBy) {currentPage.drawText(`Referred By: ${currentPatient.referredBy || "N/A"}`, { x: textStartX, y: textStartY, size: patientInfoTextSize, font });}
      };
  
      const addPage = (isFirstPage = false): void => {
        pageNumber += 1;
        currentPage = pdfDoc.addPage([width, height]);
        currentPage.drawImage(image, { x: 0, y: 0, width, height });
  
        if (isFirstPage) {
          drawPatientInfo();
          currentY = tableStartYFirstPage;
        } else {
          currentY = tableStartYSubsequent; // Starts 30mm from top
        }
        
        if (currentPatient.doctorName) {
          const doctorText = `Doctor: ${currentPatient.doctorName || "N/A"}`;
          const doctorTextWidth = font.widthOfTextAtSize(doctorText, defaultTextSize);
          currentPage.drawText(doctorText, {
            x: width - doctorTextWidth - 54,
            y: footerY + 5,
            size: defaultTextSize,
            font: boldFont,
          });
        }
  
        const pageNumberText = `Page No: ${pageNumber}`;
        const pageNumberWidth = font.widthOfTextAtSize(pageNumberText, pageTextSize);
        currentPage.drawText(pageNumberText, {
          x: (width - pageNumberWidth) / 2,
          y: pageNumberY - 2,
          size: pageTextSize,
          font,
        });
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
  
      const drawTableHeader = (headers: string[], startX: number, startY: number, colWidths: number[]): void => {
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
            x: xPos + paddingPx,
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
  
      const splitText = (text: string, maxWidth: number, fontSize: number): string[] => {
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";
  
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const width = font.widthOfTextAtSize(testLine, fontSize);
          if (width <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              lines.push(currentLine);
            }
            currentLine = word;
          }
        }
        if (currentLine) {
          lines.push(currentLine);
        }
        return lines;
      };
  
      const drawTableRow = (
        rowData: string[],
        startX: number,
        startY: number,
        colWidths: number[],
        rowHeightAdjustment = 0
      ): number => {
        let xPos = startX;
        let maxLines = 1;
  
        rowData.forEach((data, index) => {
          const lines = splitText(data, colWidths[index] - 2 * paddingPx, defaultTextSize);
          maxLines = Math.max(maxLines, lines.length);
          const lineHeight = defaultTextSize + 2;
          lines.forEach((line, lineIndex) => {
            currentPage.drawText(line, {
              x: xPos + paddingPx,
              y: startY - 15 - (lineIndex * lineHeight),
              size: defaultTextSize,
              font,
            });
          });
          xPos += colWidths[index];
        });
  
        xPos = startX;
        const totalHeight = Math.max(rowHeight, maxLines * (defaultTextSize + 2));
        rowData.forEach((_, index) => {
          currentPage.drawRectangle({
            x: xPos,
            y: startY - totalHeight,
            width: colWidths[index],
            height: totalHeight + rowHeightAdjustment,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
          });
          xPos += colWidths[index];
        });
  
        return totalHeight;
      };
  
      const drawSectionTitle = (title: string, startX: number, startY: number): void => {
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

      const drawVitalGraph = async (history: any[], category: string, startX: number, startY: number): Promise<number> => {
        if (history.length === 0) return 0;

        const graphArrayBuffer = await generateVitalGraph(history, category);
        const graphImage = await pdfDoc.embedPng(graphArrayBuffer);
        const graphWidth = tableWidth;
        const scale = graphWidth / 650;
        const scaledHeight = 250 * scale;

        if (startY - scaledHeight < bufferZone) {
          addPage();
          startY = currentY;
        }

        currentPage.drawImage(graphImage, {
          x: startX,
          y: startY - scaledHeight,
          width: graphWidth,
          height: scaledHeight,
        });

        return scaledHeight + 10;
      };
      const getUnit = (medicineType: number): string => {
        switch (medicineType) {
          case medicineCategory.capsules:
          case medicineCategory.tablets:
            return "mg";
          case medicineCategory.Tubing:
            return "g";
          default:
            return "ml";
        }
      };
  
      // Initialize the first page with patient info
      addPage(true); // First page with patient info
  
      const allSections = [
        "Symptoms",
        "Tests (Prescribed by Doctor)",
        "Vitals",
        "Treatments",
        "Medical History",
      ];
  
      const displayAll = printSelectOptions.length === allSections.length && 
        allSections.every(section => printSelectOptions.includes(section));
  
      // Symptoms Section
      if (displayAll || printSelectOptions.includes("Symptoms")) {
        drawSectionTitle("Symptoms", tableStartX, currentY);
        currentY -= 20;
        if (currentY < bufferZone + 20 + rowHeight) {
          addPage();
          drawSectionTitle("Symptoms", tableStartX, currentY);
          currentY -= 20;
        }
        const symptomColWidths: number[] = [tableWidth * 0.1, tableWidth * 0.5, tableWidth * 0.2, tableWidth * 0.2];
        drawTableHeader(["Sr. No.", "Symptom Name", "Date", "Time"], tableStartX, currentY, symptomColWidths);
        currentY -= rowHeight;
  
        if (!symptoms || symptoms.length === 0) {
          if (currentY < bufferZone) {
            addPage();
          }
          currentPage.drawText("No symptoms available", {
            x: tableStartX + (tableWidth - font.widthOfTextAtSize("No symptoms available", defaultTextSize)) / 2,
            y: currentY - 15,
            size: defaultTextSize,
            font,
          });
          currentY -= rowHeight;
        } else {
          symptoms.forEach((symptom: symptompstype, index: number) => {
            if (currentY < bufferZone + rowHeight) {
              addPage();
              drawSectionTitle("Symptoms (Continued)", tableStartX, currentY);
              currentY -= 20;
              drawTableHeader(["Sr. No.", "Symptom Name", "Date", "Time"], tableStartX, currentY, symptomColWidths);
              currentY -= rowHeight;
            }
            const addedDate = new Date(symptom.addedOn);
            const formattedDate = addedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
            const formattedTime = addedDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            const adjustedRowHeight = drawTableRow([`${index + 1}`, symptom.symptom, formattedDate, formattedTime], tableStartX, currentY, symptomColWidths);
            currentY -= adjustedRowHeight;
          });
        }
        currentY -= 10;
      }
  
      // Tests Section
      if (displayAll || printSelectOptions.includes("Tests (Prescribed by Doctor)")) {
        drawSectionTitle("Tests", tableStartX, currentY);
        currentY -= 20;
        if (currentY < bufferZone + 20 + rowHeight) {
          addPage();
          drawSectionTitle("Tests", tableStartX, currentY);
          currentY -= 20;
        }
        const testColWidths: number[] = [tableWidth * 0.1, tableWidth * 0.5, tableWidth * 0.2, tableWidth * 0.2];
        drawTableHeader(["Sr. No.", "Test Name", "Date", "Time"], tableStartX, currentY, testColWidths);
        currentY -= rowHeight;
  
        if (!selectedTestList || selectedTestList.length === 0) {
          if (currentY < bufferZone) {
            addPage();
          }
          currentPage.drawText("No tests available", {
            x: tableStartX + (tableWidth - font.widthOfTextAtSize("No tests available", defaultTextSize)) / 2,
            y: currentY - 15,
            size: defaultTextSize,
            font,
          });
          currentY -= rowHeight;
        } else {
          selectedTestList.forEach((test: testType, index: number) => {
            if (currentY < bufferZone + rowHeight) {
              addPage();
              drawSectionTitle("Tests (Continued)", tableStartX, currentY);
              currentY -= 20;
              drawTableHeader(["Sr. No.", "Test Name", "Date", "Time"], tableStartX, currentY, testColWidths);
              currentY -= rowHeight;
            }
            const addedDate = new Date(test.addedOn);
            const formattedDate = addedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
            const formattedTime = addedDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            const adjustedRowHeight = drawTableRow([`${index + 1}`, test.test, formattedDate, formattedTime], tableStartX, currentY, testColWidths);
            currentY -= adjustedRowHeight;
          });
        }
        currentY -= 10;
      }

      // Vitals Section
      if (displayAll || printSelectOptions.includes("Vitals")) {
        drawSectionTitle("Vitals", tableStartX, currentY);
        currentY -= 20;
        currentY -= 10;
        if (currentY < bufferZone + 20 + rowHeight) {
          addPage();
          drawSectionTitle("Vitals", tableStartX, currentY);
          currentY -= 20;
        }
        const vitalColWidths: number[] = [tableWidth * 0.33, tableWidth * 0.33, tableWidth * 0.34];

        if (!vitalFunction || Object.keys(vitalFunction).length === 0) {
          if (currentY < bufferZone) {
            addPage();
          }
          currentPage.drawText("No vitals available", {
            x: tableStartX + (tableWidth - font.widthOfTextAtSize("No vitals available", defaultTextSize)) / 2,
            y: currentY - 15,
            size: defaultTextSize,
            font,
          });
          currentY -= rowHeight;
        } else {
          const drawVitalTable = (label: string, avg: string | number, min: string | number, max: string | number): void => {
            if (currentY < bufferZone + rowHeight * 2) {
              addPage();
              drawSectionTitle("Vitals (Continued)", tableStartX, currentY);
              currentY -= 20;
              currentY -= 10;
            }
            drawSectionTitle(label, tableStartX, currentY);
            currentY -= 20;
            drawTableHeader(["Average", "Minimum", "Maximum"], tableStartX, currentY, vitalColWidths);
            currentY -= rowHeight;
            const adjustedRowHeight = drawTableRow([`${avg}`, `${min}`, `${max}`], tableStartX, currentY, vitalColWidths);
            currentY -= adjustedRowHeight + 10;
          };

          const drawVitalHistoryTable = async (title: string, history: any[], category: string): Promise<void> => {
            if (currentY < bufferZone + rowHeight * 2) {
              addPage();
            }

            drawSectionTitle(title, tableStartX, currentY);
            currentY -= 20;

            let headers: string[];
            let colWidths: number[];

            if (category === "bp") {
              headers = ["Date", "Time", "Systolic", "Diastolic"];
              colWidths = [tableWidth * 0.25, tableWidth * 0.25, tableWidth * 0.25, tableWidth * 0.25];
            } else {
              headers = ["Date", "Time", "Value"];
              colWidths = [tableWidth * 0.33, tableWidth * 0.33, tableWidth * 0.34];
            }

            drawTableHeader(headers, tableStartX, currentY, colWidths);
            currentY -= rowHeight;

            history.forEach((record) => {
              if (currentY < bufferZone + rowHeight) {
                addPage();
                drawTableHeader(headers, tableStartX, currentY, colWidths);
                currentY -= rowHeight;
              }

              const timeField = category === "temperature" && record.device ? "deviceTime" : `${category}Time`;
              const date = new Date(record[timeField] || record.deviceTime * 1000 || Date.now());
              const formattedDate = date.toLocaleDateString("en-US");
              const formattedTime = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

              let rowData: string[];
              if (category === "bp") {
                const bpValues = record.bp?.split('/') || ['N/A', 'N/A'];
                rowData = [formattedDate, formattedTime, bpValues[0], bpValues[1]];
              } else {
                const value = record[category] || record.avg || "N/A";
                rowData = [formattedDate, formattedTime, value.toString()];
              }

              const adjustedRowHeight = drawTableRow(rowData, tableStartX, currentY, colWidths);
              currentY -= adjustedRowHeight;
            });

            currentY -= 10;

            const graphHeightUsed = await drawVitalGraph(history, category, tableStartX, currentY);
            currentY -= graphHeightUsed;
          };

          console.log("Vital Function Structure:", vitalFunction);

          // Mapping of vital keys to display labels
          const vitalLabels: { [key: string]: string } = {
            pulse: "Pulse",
            temperature: "Temperature",
            oxygen: "Oxygen",
            bp: "Blood Pressure",
            respiratoryRate: "Respiratory Rate",
            hrv: "HRV",
            heartRate: "Pulse",
            spo2: "Oxygen",
            heartRateVariability: "HRV",
            batteryPercentage: "Battery Percentage",
          };

          const allVitals = isHomecarePatient
            ? ['heartRate', 'temperature', 'spo2', 'respiratoryRate', 'heartRateVariability', 'batteryPercentage']
            : ['pulse', 'temperature', 'oxygen', 'bp', 'respiratoryRate', 'hrv'];

          for (const key of allVitals) {
            const history = await fetchVitalHistory(key);
            if (history.length > 0 && history[0]) {
              const label = vitalLabels[key] || key;
              const vitalData = history[0];
              drawVitalTable(
                label,
                vitalData.avg || vitalFunction[key]?.[`avg${key.charAt(0).toUpperCase() + key.slice(1)}`] || "N/A",
                vitalData.min || vitalFunction[key]?.[`min${key.charAt(0).toUpperCase() + key.slice(1)}`] || "N/A",
                vitalData.max || vitalFunction[key]?.[`max${key.charAt(0).toUpperCase() + key.slice(1)}`] || "N/A"
              );
              if (isCustomerCare) {
                await drawVitalHistoryTable(`${label} History`, history, key);
              }
            }
          }
        }
        currentY -= 10;
      }

      // Treatment Plan Section
      if (displayAll || printSelectOptions.includes("Treatments")) {
        drawSectionTitle("Treatment Plan", tableStartX, currentY);
        currentY -= 20;
        if (currentY < bufferZone + 20 + rowHeight) {
          addPage();
          drawSectionTitle("Treatment Plan", tableStartX, currentY);
          currentY -= 20;
        }
        const treatmentColWidths: number[] = [
          tableWidth * 0.05,
          tableWidth * 0.25,
          tableWidth * 0.20,
          tableWidth * 0.20,
          tableWidth * 0.30,
        ];
        drawTableHeader(["", "Medicine Name", "Dose", "No. Days", "Medication Time"], tableStartX, currentY, treatmentColWidths);
        currentY -= rowHeight;
  
        if (!reminder || reminder.length === 0) {
          if (currentY < bufferZone) {
            addPage();
          }
          currentPage.drawText("No treatment plan available", {
            x: tableStartX + (tableWidth - font.widthOfTextAtSize("No treatment plan available", defaultTextSize)) / 2,
            y: currentY - 15,
            size: defaultTextSize,
            font,
          });
          currentY -= rowHeight;
        } else {
          reminder.forEach((each: Reminder) => {
            if (currentY < bufferZone + rowHeight) {
              addPage();
              drawSectionTitle("Treatment Plan (Continued)", tableStartX, currentY);
              currentY -= 20;
              drawTableHeader(["", "Medicine Name", "Dose", "No. Days", "Medication Time"], tableStartX, currentY, treatmentColWidths);
              currentY -= rowHeight;
            }
            const medicineTypeText = (() => {
              switch (each.medicineType) {
                case medicineCategory.capsules: return "Cap";
                case medicineCategory.tablets: return "Tab";
                case medicineCategory.injections: return "Inj";
                case medicineCategory.syrups: return "Syr";
                default: return "";
              }
            })();
            const doseText = `${each?.doseCount ? each.doseCount : ""} ${getUnit(each.medicineType)}`;
            const daysText = `${each?.daysCount ? each.daysCount : ""} days`;
            const adjustedRowHeight = drawTableRow(
              [medicineTypeText, each.medicineName, doseText, daysText, each.medicationTime],
              tableStartX,
              currentY,
              treatmentColWidths
            );
            currentY -= adjustedRowHeight;
          });
        }
        currentY -= 10;
      }
  
      // Medical History Section
      if (displayAll || printSelectOptions.includes("Medical History")) {
        drawSectionTitle("Medical History", tableStartX, currentY);
        currentY -= 20;
        if (currentY < bufferZone + 20 + rowHeight) {
          addPage();
          drawSectionTitle("Medical History", tableStartX, currentY);
          currentY -= 20;
        }
  
        if (!medicalHistory) {
          if (currentY < bufferZone) {
            addPage();
          }
          currentPage.drawText("No medical history available", {
            x: tableStartX + (tableWidth - font.widthOfTextAtSize("No medical history available", defaultTextSize)) / 2,
            y: currentY - 15,
            size: defaultTextSize,
            font,
          });
          currentY -= rowHeight;
        } else {
          const basicInfoColWidths: number[] = [tableWidth * 0.33, tableWidth * 0.33, tableWidth * 0.34];
          drawTableHeader(["History Given By", "Mobile Number", "Relation With Patient"], tableStartX, currentY, basicInfoColWidths);
          currentY -= rowHeight;
          const basicInfoRowHeight = drawTableRow(
            [medicalHistory.givenName || "N/A", medicalHistory.givenPhone || "N/A", medicalHistory.givenRelation || "N/A"],
            tableStartX,
            currentY,
            basicInfoColWidths
          );
          currentY -= basicInfoRowHeight + 10;
  
          if (currentY < bufferZone + 20 + rowHeight) {
            addPage();
          }
          currentPage.drawText("Group 1: Specific Health Conditions", {
            x: tableStartX,
            y: currentY - 15,
            size: defaultTextSize,
            font: boldFont,
          });
          currentY -= rowHeight;
          const group1ColWidths: number[] = [tableWidth * 0.5, tableWidth * 0.5];
          drawTableHeader(["Condition", "Status"], tableStartX, currentY, group1ColWidths);
          currentY -= rowHeight;
          const group1Data = [
            ["Hepatitis C", medicalHistory.infections?.split(",").includes("Hepatitis C") ? "Yes" : "No"],
            ["HIV", medicalHistory.infections?.split(",").includes("HIV") ? "Yes" : "No"],
            ["Hepatitis B", medicalHistory.infections?.split(",").includes("Hepatitis B") ? "Yes" : "No"],
            ["Pregnant", medicalHistory.pregnant ? "Yes" : "No"],
          ];
          group1Data.forEach(([condition, status]) => {
            if (currentY < bufferZone + rowHeight) {
              addPage();
              currentPage.drawText("Group 1: Specific Health Conditions (Continued)", {
                x: tableStartX,
                y: currentY - 15,
                size: defaultTextSize,
                font: boldFont,
              });
              currentY -= rowHeight;
              drawTableHeader(["Condition", "Status"], tableStartX, currentY, group1ColWidths);
              currentY -= rowHeight;
            }
            const adjustedRowHeight = drawTableRow([condition, status], tableStartX, currentY, group1ColWidths);
            currentY -= adjustedRowHeight;
          });
          currentY -= 10;
  
          if (currentY < bufferZone + 20 + rowHeight) {
            addPage();
          }
          currentPage.drawText("Group 2: Neurological, Heart, and Addictions", {
            x: tableStartX,
            y: currentY - 15,
            size: defaultTextSize,
            font: boldFont,
          });
          currentY -= rowHeight;
          const group2ColWidths: number[] = [tableWidth * 0.5, tableWidth * 0.5];
          drawTableHeader(["Condition", "Status"], tableStartX, currentY, group2ColWidths);
          currentY -= rowHeight;
          const group2Data = [
            ["Epilepsy or Neurological Disorder", medicalHistory.neurologicalDisorder ? "Yes" : "No"],
            ["Heart Problems", medicalHistory.heartProblems ? "Yes" : "No"],
            ["Chest Pain", medicalHistory.chestCondition ? "Yes" : "No"],
            ["Any Addictions", medicalHistory.drugs ? "Yes" : "No"],
          ];
          group2Data.forEach(([condition, status]) => {
            if (currentY < bufferZone + rowHeight) {
              addPage();
              currentPage.drawText("Group 2: Neurological, Heart, and Addictions (Continued)", {
                x: tableStartX,
                y: currentY - 15,
                size: defaultTextSize,
                font: boldFont,
              });
              currentY -= rowHeight;
              drawTableHeader(["Condition", "Status"], tableStartX, currentY, group2ColWidths);
              currentY -= rowHeight;
            }
            const adjustedRowHeight = drawTableRow([condition, status], tableStartX, currentY, group2ColWidths);
            currentY -= adjustedRowHeight;
          });
          currentY -= 10;
  
          if (currentY < bufferZone + 20 + rowHeight) {
            addPage();
          }
          currentPage.drawText("Group 3: Mental Health and Physical Conditions", {
            x: tableStartX,
            y: currentY - 15,
            size: defaultTextSize,
            font: boldFont,
          });
          currentY -= rowHeight;
          const group3ColWidths: number[] = [tableWidth * 0.5, tableWidth * 0.5];
          drawTableHeader(["Condition", "Status"], tableStartX, currentY, group3ColWidths);
          currentY -= rowHeight;
          const group3Data = [
            ["Any Mental Health Problems", medicalHistory.mentalHealth ? "Yes" : "No"],
            ["Any Bone/Joint Disease", "No"],
            ["Been Through Cancer", medicalHistory.cancer ? "Yes" : "No"],
            ["Lumps Found", medicalHistory.lumps ? "Yes" : "No"],
          ];
          group3Data.forEach(([condition, status]) => {
            if (currentY < bufferZone + rowHeight) {
              addPage();
              currentPage.drawText("Group 3: Mental Health and Physical Conditions (Continued)", {
                x: tableStartX,
                y: currentY - 15,
                size: defaultTextSize,
                font: boldFont,
              });
              currentY -= rowHeight;
              drawTableHeader(["Condition", "Status"], tableStartX, currentY, group3ColWidths);
              currentY -= rowHeight;
            }
            const adjustedRowHeight = drawTableRow([condition, status], tableStartX, currentY, group3ColWidths);
            currentY -= adjustedRowHeight;
          });
          currentY -= 10;
  
          if (currentY < bufferZone + 20 + rowHeight) {
            addPage();
          }
          currentPage.drawText("Group 4: Known Family Diseases", {
            x: tableStartX,
            y: currentY - 15,
            size: defaultTextSize,
            font: boldFont,
          });
          currentY -= rowHeight;
          const group4ColWidths: number[] = [tableWidth * 0.5, tableWidth * 0.5];
          drawTableHeader(["Relative", "Known Diseases"], tableStartX, currentY, group4ColWidths);
          currentY -= rowHeight;
          const group4Data = [
            ["Father", medicalHistory.hereditaryDisease?.includes("Father") ? "Yes" : "No"],
            ["Mother", medicalHistory.hereditaryDisease?.includes("Mother") ? "Yes" : "No"],
            ["Siblings", medicalHistory.hereditaryDisease?.includes("Siblings") ? "Yes" : "No"],
          ];
          group4Data.forEach(([relative, status]) => {
            if (currentY < bufferZone + rowHeight) {
              addPage();
              currentPage.drawText("Group 4: Known Family Diseases (Continued)", {
                x: tableStartX,
                y: currentY - 15,
                size: defaultTextSize,
                font: boldFont,
              });
              currentY -= rowHeight;
              drawTableHeader(["Relative", "Known Diseases"], tableStartX, currentY, group4ColWidths);
              currentY -= rowHeight;
            }
            const adjustedRowHeight = drawTableRow([relative, status], tableStartX, currentY, group4ColWidths);
            currentY -= adjustedRowHeight;
          });
        }
      }
  
      const pdfBytes = await pdfDoc.save();
      downloadPDF(pdfBytes);
    } catch (error) {
      console.error("Error generating PDF:", error);
      dispatch(setError("Error generating PDF. Please try again."));
    }
  };
  
  
  
  const fetchTemplates = async (): Promise<void> => {
    try {
      const hospitalID = isCustomerCare ? currentPatient.hospitalID : user.hospitalID;
      const response = await authFetch(`template/${hospitalID}/${user.id}`, user.token);
      console.log("Templates response:", response);

      if (response?.templates?.length > 0) {
        const filterData = response.templates.filter(
          (each: { category: string }) => each.category === "Report"
        );

        if (filterData.length > 0) {
          const DischargeImgurl: string = filterData[0].fileURL;
          await generatePDF(DischargeImgurl);
        } else {
          console.log("No Report template found, using default template from assets:", defaultTemplate);
          await generatePDF(defaultTemplate);
        }
      } else {
        console.log("No templates found, using default template from assets:", defaultTemplate);
        await generatePDF(defaultTemplate);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      dispatch(setError("Error fetching templates. Please try again."));
    }
};

  useEffect(() => {
    if (isApiTrigger.current) {
      fetchTemplates();
      isApiTrigger.current = false;
    }
  }, []);

  const downloadPDF = (pdfBytes: Uint8Array): void => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = isCustomerCare 
      ? "Patient_Vitals_Report.pdf" 
      : "Patient_Discharge_Report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return null;
};

export default DischargeTemplate;

interface Data {
  reminder: Reminder[];
  medicalHistory: medicalHistoryFormType | null;
  symptoms: symptompstype[];
  vitalAlert: Alerttype[];
  vitalFunction: vitalFunctionType | null;
  reports?: attachmentType[];
  selectedTestList: testType[];
  previousMedHistoryList: any[];
}

interface DischargeTemplateProps {
  currentPatient: PatientType;
  data: Data;
  printSelectOptions: string[];
}