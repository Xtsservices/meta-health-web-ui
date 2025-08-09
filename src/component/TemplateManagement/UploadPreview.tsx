import { useEffect, useState } from "react";
import styles from "./UploadPreview.module.css";
import { Button } from "@mui/material";
import { authPost } from "../../axios/useAuthPost";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
// import { debounce, DEBOUNCE_DELAY } from "../../utility/debounce";
import { authFetch } from "../../axios/useAuthFetch";
import { authDelete } from "../../axios/authDelete";

interface UploadPreviewProps {
  heading: string;
  category: string;
}

const fetchTemplates = async (
  hospitalID: number,
  userID: number,
  token: string,
  setUploadedFiles: any,
  category: string
) => {
  try {
    const response = await authFetch(
      `template/${category}/${hospitalID}/${userID}`,
      token
    );

    if (response && response.templates && response.templates.length > 0) {
      const template = response.templates[0]; // Only one template is allowed
      const templateData = {
        srNo: 1,
        fileName: template.templateName.replace(/"/g, ""),
        templateType: template.templateType || "N/A",
        fileURL: template.fileURL, // Assuming API provides file URL
      };

      setUploadedFiles([templateData]);
    } else {
      console.error("Invalid response structure:", response);
    }
  } catch (error) {
    console.error("Error fetching templates:", error);
  }
};

const UploadPreview: React.FC<UploadPreviewProps> = ({ heading, category }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user?.hospitalID && user?.id && user?.token) {
      fetchTemplates(
        user.hospitalID,
        user.id,
        user.token,
        setUploadedFiles,
        category
      );
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if a file already exists in the table
    if (uploadedFiles.length > 0) {
      alert("Only one template is allowed!");
      return;
    }
  
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUploadBoxClick = () => {
    // Check if a file already exists in the table
    if (uploadedFiles.length > 0) {
      alert("Only one template is allowed!");
      return;
    }
  
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const saveTemplate = async () => {
    if (!file) return;

    if (uploadedFiles.length > 0) {
      alert("Only one template is allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("templateName", file.name);
    formData.append("templateType", file.type);
    formData.append("category", category);

    try {
      const response = await authPost(
        `template/${category}/${user.hospitalID}/${user.id}`,
        formData,
        user.token
      );

      if (response) {
        const newFileData = {
          srNo: 1,
          fileName: file.name,
          templateType: file.type,
          fileURL: URL.createObjectURL(file), 
        };
  
        setUploadedFiles([newFileData]);
        setFile(null);
        setPreviewUrl(null);
      } else {
        console.error("Error saving template:", response);
      }
    } catch (error) {
      console.error("Error in saveTemplate:", error);
    }
  };

  // const debouncedSaveHandler = debounce(saveTemplate, DEBOUNCE_DELAY);

const handleSave = () => {
  saveTemplate(); 
};


  const handleDelete = async () => {
    const response = await authDelete(
      `template/${category}/${user.hospitalID}/${user.id}`,
      user.token
    );
    if(response.status == 200){
      console.log("Template deleted successfully");
    }
    setUploadedFiles([]);
  };

  return (
    <div className={styles.uploadPreviewMainContainer}>
      <h2 className={styles.uploadTitle}>{heading}</h2>
      <hr className={styles.headingLine} />

      {/* Uploaded File Table */}
      {uploadedFiles.length > 0 && (
        <div className={styles.tableContainer}>
          <h3>Uploaded File</h3>
          <table className={styles.uploadedFilesTable}>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Template Type</th>
                <th>Template Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((fileData, index) => (
                <tr key={index}>
                  <td>{fileData.srNo}</td>
                  <td>{fileData.templateType}</td>
                  <td>{fileData.fileName}</td>
                  <td>
                    <div className={styles.uploaded_box_buttons}>
                      <a
                        href={fileData.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className={styles.viewButton}>View</button>
                      </a>
                      <button
                        className={styles.deleteButton}
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.uploadPreviewContainer}>
        {/* Upload Section */}
        <div className={styles.uploadSection}>
          <p className={styles.uploadDescription}>
            Upload PDF File of Letter Head
          </p>
          <div
            className={styles.uploadBox}
            onClick={handleUploadBoxClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (uploadedFiles.length > 0) {
                alert("Only one template is allowed!");
                return;
              }
              const droppedFile = e.dataTransfer.files[0];
              if (droppedFile) {
                setFile(droppedFile);
                setPreviewUrl(URL.createObjectURL(droppedFile));
              }
            }}
          >
            <input
              type="file"
              accept="application/pdf, image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
              id="fileInput"
              hidden
            />
            <label>Browse or Drag & Drop File Here</label>
          </div>
          <div className={styles.uploadButtonBox}>
            <button className={styles.uploadButton} disabled={!file}>
              Preview
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className={styles.rightSectionPreview}>
          <div
            className={`${styles.previewSection} ${
              previewUrl ? styles.hasPreview : ""
            }`}
          >
            {previewUrl ? (
              file?.type === "application/pdf" ? (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  style={{ width: "100%", height: "500px" }}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={styles.previewImage}
                />
              )
            ) : (
              <p className={styles.previewText}>Select a File for Preview</p>
            )}
          </div>

          {/* Buttons Section */}
          <div className={styles.buttonContainer}>
            <Button
              variant="text"
              onClick={handleCancel}
              disabled={!file}
              className={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!file}
              className={styles.saveButton}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPreview;
