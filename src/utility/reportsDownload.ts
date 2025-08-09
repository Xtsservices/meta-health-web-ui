
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const downloadFile = async (fileUrl: string, fileName: string, mimeType: string) => {
  console.log("I am being called");
  try {
    console.log("Downloading File:", fileName, "with MimeType:", mimeType); // Log the mimeType
    const encodedUrl = encodeURIComponent(fileUrl);

    const response = await axios.get(
      `${BASE_URL}attachment/proxypdf?url=${encodedUrl}&mimeType=${mimeType}`,
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

