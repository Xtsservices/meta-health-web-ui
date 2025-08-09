import React from "react";
import styles from "./AddReport.module.scss";
import file_icon from "./../../../../../src/assets/addstaff/file_icon.png";
import pdf from "../../../../../src/assets/pdf.png";
import { useDispatch } from "react-redux";
import { setError } from "../../../../store/error/error.action";

type reportType = {
  files: File[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
};

function AddReport({ files, setFiles }: reportType) {
  const [fileURLs, setFileURLs] = React.useState<(string | ArrayBuffer)[]>([]);
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const [para, setPara] = React.useState("Drag and Drop or Browse");
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!fileURLs.length) setFiles([]);
  }, [fileURLs, setFiles]);

  React.useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setPara("Release to upload");
    };

    const handleDragLeave = () => {
      setPara("Drag and Drop or Browse");
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      setPara("Drag and Drop or Browse");
      const files = event.dataTransfer?.files;
      if (files) {
        Array.from(files).forEach((file) => handleFile(file));
      }
    };

    const label = labelRef.current;
    if (label) {
      label.addEventListener("dragover", handleDragOver);
      label.addEventListener("dragleave", handleDragLeave);
      label.addEventListener("drop", handleDrop);

      return () => {
        label.removeEventListener("dragover", handleDragOver);
        label.removeEventListener("dragleave", handleDragLeave);
        label.removeEventListener("drop", handleDrop);
      };
    }
  }, []);

  const handleFile = (file: File) => {
    setFiles((prev) => (prev ? [...prev, file] : [file]));

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = reader.result;
      if (fileData) {
        setFileURLs((prev) => [...prev, fileData]);
      }
    };

    if (file.type === "application/pdf") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.uploadDialog}>
      <p>Please Upload the document</p>
      <label
        className={styles.upload_container}
        htmlFor="uploadFile"
        ref={labelRef}
      >
        <img src={file_icon} alt="File Icon" />
        <p>{para}</p>
      </label>
      <input
        type="file"
        className=""
        id="uploadFile"
        style={{ visibility: "hidden" }}
        accept=".pdf, image/*,audio/mpeg,video/mp4"
        multiple
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            Array.from(files).forEach((file) => {
              if (file.type === "video/mp4" && file.size > 25 * 1024 * 1024) {
                dispatch(
                  setError(
                    `The file ${file.name} exceeds the 25MB limit for video files.`
                  )
                );
              } else if (
                file.type === "audio/mpeg" &&
                file.size > 1 * 1024 * 1024
              ) {
                dispatch(
                  setError(
                    `The file ${file.name} exceeds the 1MB limit for audio files.`
                  )
                );
              } else {
                handleFile(file);
              }
            });
          }
        }}
      />
      Supported formats: Pdf, Jpeg, Jpg, Mp3,Mp4
      {fileURLs.length ? <h4 className="">Uploaded Documents</h4> : ""}
      <div className="" style={{ display: "flex" }}>
        {fileURLs?.map((url, index) => {
          const fileType = files?.[index]?.type;
          const isImage = fileType?.startsWith("image/");
          const isPdf = fileType === "application/pdf";

          return (
            <div className={styles.uploaded_box} key={index}>
              <div className={styles.uploaded_box_file}>
                {isImage ? (
                  <img
                    src={url as string}
                    style={{
                      height: "4rem",
                      width: "4rem",
                      objectFit: "cover",
                    }}
                    alt="Image Preview"
                  />
                ) : isPdf ? (
                  <img
                    src={pdf}
                    alt="PDF"
                    style={{ height: "4rem", width: "4rem" }}
                  />
                ) : null}
              </div>
              <h5
                style={{
                  fontSize: "12px",
                  width: "5rem",
                }}
              >
                {files?.[index].name
                  .slice(0, -files?.[index].type.split("/")[1].length - 1)
                  .slice(
                    0,
                    files?.[index].name.length > 12
                      ? 12
                      : files?.[index].name.length
                  )}
              </h5>
              <div className={styles.uploaded_box_buttons}>
                <button
                  className=""
                  onClick={() => {
                    if (isImage) {
                      const previewWindow = window.open("");
                      if (previewWindow) {
                        previewWindow.document.write(
                          `<img src="${url}" alt="Preview" style="width: 300px; height: auto;" />`
                        );
                      }
                    } else if (isPdf) {
                      const pdfBlob = new Blob(
                        [fileURLs[index] as ArrayBuffer],
                        {
                          type: "application/pdf",
                        }
                      );
                      const pdfUrl = URL.createObjectURL(pdfBlob);
                      const embedElement = document.createElement("embed");
                      embedElement.setAttribute("type", "application/pdf");
                      embedElement.setAttribute("width", "1200");
                      embedElement.setAttribute("height", "700");
                      embedElement.setAttribute("src", pdfUrl);
                      const previewDiv = document.createElement("div");
                      previewDiv.appendChild(embedElement);
                      const previewWindow = window.open("", "_blank");
                      if (previewWindow) {
                        previewWindow.document.body.appendChild(previewDiv);
                      }
                    }
                  }}
                >
                  View
                </button>
                <button
                  className={styles.delete}
                  onClick={() => {
                    fileURLs.splice(index, 1);
                    files?.splice(index, 1);
                    setFileURLs(() => [...fileURLs]);
                    setFiles(() => {
                      if (files) return [...files];
                      else return [];
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AddReport;
