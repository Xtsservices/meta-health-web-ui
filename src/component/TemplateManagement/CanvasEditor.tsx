import { fabric } from "fabric";
import React, { useEffect, useRef, useState } from "react";
import template1 from "../../assets/templateManagment/IPD.png";
import template2 from "../../assets/templateManagment/Pathology.png";
import template3 from "../../assets/templateManagment/Radiology.png";
import template4 from "../../assets/templateManagment/Pharmacy.png";
import selecttemplate from "../../assets/templateManagment/selecttemplate.png";
import logoimg from "../../assets/templateManagment/addlogo.png";
import textcolors from "../../assets/templateManagment/colors.png";
import text from "../../assets/templateManagment/text.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authPost } from "../../axios/useAuthPost";
import styles from "./UploadPreview.module.css";

import {
  Button,
  Grid,
} from "@mui/material";

import TextFormating from "./TextFormating";
import { debounce, DEBOUNCE_DELAY } from "../../utility/debounce";

interface UploadPreviewProps {
  category: string;
  fetchTemplates: () => void;
}

const CanvasEditor: React.FC<UploadPreviewProps> = ({ category,fetchTemplates }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const watermarkRef = useRef<fabric.Image | null>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const user = useSelector(selectCurrentUser);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.2);

  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );
  const [textColor, setTextColor] = useState<string>("#4CAF50");
  const [fontSize, ] = useState<number>(24);
  const [rows, setRows] = useState<number>(1);
  const [columns, setColumns] = useState<number>(1);

  // Undo/Redo Logic
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const [activeActionValue, setActiveActionValue] = useState<string>(template4);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // states for tools
  const [activeAction, setActiveAction] = React.useState<string | null>(null);

  const colorInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (colorInputRef.current) {
      colorInputRef.current.click(); // Auto-click to open color picker
    }
  }, []);

  const handleAction = (action: string) => {
    setActiveAction(action);
    if (action === "logo") {
      addLogo();
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return; // Ensure canvasRef is available

    const canvas = new fabric.Canvas(canvasRef.current as HTMLCanvasElement, {
      selection: true,
    });
    canvasInstance.current = canvas;

    // Set canvas dimensions (100% height, 95% width)
    const updateCanvasSize = () => {
      const width = window.innerWidth * 0.34;
      const height = window.innerHeight;
      canvas.setDimensions({ width, height });
    };

    // Initial setup
    updateCanvasSize();

    // Load sample template as background (fit to defined dimensions)
    fabric.Image.fromURL(
      activeActionValue,
      (img: fabric.Image) => {
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Scale image proportionally to fit inside the canvas
        const scaleX = canvasWidth / img.width!;
        const scaleY = canvasHeight / img.height!;
        const scale = Math.min(scaleX, scaleY); // Ensures full image fits

        img.set({
          selectable: false,
          scaleX: scale,
          scaleY: scale,
          top: 0, // Center Vertically
          left: 0, // Center Horizontally
        });

        // Set the image as the background and render the canvas
        canvas.setBackgroundImage(img, canvas?.renderAll?.bind(canvas));

        saveState(); // Save initial state
      },
      { crossOrigin: "anonymous" } // Ensure cross-origin compatibility for external images
    );

    // Resize canvas on window resize
    window.addEventListener("resize", updateCanvasSize);

    // Capture selected object for editing
    canvas.on("selection:created", (event: any) => {
      setSelectedObject(event.selected?.[0] || null);
    });

    canvas.on("selection:cleared", () => setSelectedObject(null));

    return () => {
      canvas.dispose(); // Cleanup on unmount
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [activeActionValue,activeIndex]);

  // Save canvas state
  const saveState = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      setUndoStack((prev) => [...prev, JSON.stringify(canvas.toJSON())]);
      setRedoStack([]);
    }
  };

  // Add Multiline Text
  const addText = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const text = new fabric.Textbox("Editable Text Here", {
        left: 100,
        top: 100,
        width: 250,
        fontSize,
        fill: textColor,
        editable: true,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      saveState(); // Save state after adding text
    }
  };

  // Add Logo
  const addLogo = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const logoInput = document.createElement("input");
      logoInput.type = "file";
      logoInput.accept = "image/*";
      logoInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (f) => {
            fabric.Image.fromURL(f.target?.result as string, (img: any) => {
              img.set({
                left: 450,
                top: 20,
                scaleX: 0.4, // Improved scaling
                scaleY: 0.4,
              });
              canvas.add(img);
              canvas.renderAll();
              saveState(); // Save canvas state after adding logo
            });
          };
          reader.readAsDataURL(file);
        }
      };
      logoInput.click(); // Trigger file upload dialog
    }
  };

  const addWatermark = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const logoInput = document.createElement("input");
      logoInput.type = "file";
      logoInput.accept = "image/png, image/jpeg"; // Restrict file types
      logoInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // Validate file type
          const allowedTypes = ["image/png", "image/jpeg"];
          if (!allowedTypes.includes(file.type)) {
            alert("Please upload a PNG or JPG image.");
            return;
          }

          const reader = new FileReader();
          reader.onload = (f) => {
            fabric.Image.fromURL(
              f.target?.result as string,
              (img: fabric.Image) => {
                img.set({
                  left: 200,
                  top: 400,
                  scaleX: 0.5,
                  scaleY: 0.5,
                  opacity: watermarkOpacity,
                });

                canvas.add(img);
                canvas.sendToBack(img);
                canvas.renderAll();

                watermarkRef.current = img; // Store watermark reference
                saveState();
              }
            );
          };
          reader.readAsDataURL(file);
        }
      };
      logoInput.click();
    }
  };

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (canvas && watermarkRef.current) {
      watermarkRef.current.set({ opacity: watermarkOpacity });
      canvas.renderAll();
    }
  }, [watermarkOpacity]);
  // Add Table
  const addTable = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const tableGroup = new fabric.Group([], {
        left: 100,
        top: 100,
        selectable: true,
      });

      const cellWidth = 100;
      const cellHeight = 50;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          const cell = new fabric.Rect({
            width: cellWidth,
            height: cellHeight,
            left: j * cellWidth,
            top: i * cellHeight,
            fill: "#ffffff",
            stroke: "#000000",
            strokeWidth: 0.1,
            selectable: false,
          });

          const text = new fabric.Textbox("", {
            left: j * cellWidth + 5,
            top: i * cellHeight + 5,
            width: cellWidth - 10,
            height: cellHeight - 10,
            fontSize: 14,
            fill: "#000000",
            editable: true,
            selectable: true,
          });

          tableGroup.addWithUpdate(cell);
          tableGroup.addWithUpdate(text);
        }
      }

      canvas.add(tableGroup);
      canvas.setActiveObject(tableGroup);
      canvas.renderAll();
      saveState(); // Save state after adding table
    }
  };

  // Undo
  const handleUndo = () => {
    const canvas = canvasInstance.current;
    if (canvas && undoStack.length > 0) {
      const lastState = undoStack.pop();
      if (lastState) {
        setRedoStack([...redoStack, JSON.stringify(canvas.toJSON())]);
        canvas.loadFromJSON(lastState, canvas.renderAll.bind(canvas));
      }
    }
  };

  // Redo
  const handleRedo = () => {
    const canvas = canvasInstance.current;
    if (canvas && redoStack.length > 0) {
      const nextState = redoStack.pop();
      if (nextState) {
        setUndoStack([...undoStack, JSON.stringify(canvas.toJSON())]);
        canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
      }
    }
  };

  const handleTextChange = (
    property: keyof fabric.IText,
    value: string | number
  ) => {
    const canvas = canvasInstance.current;
    if (selectedObject && selectedObject.type === "textbox") {
      selectedObject.set(property as keyof fabric.Object, value); // Cast to keyof fabric.Object
      selectedObject.setCoords(); // Fix positioning issues
      selectedObject.dirty = true; // Ensure update
      canvas?.renderAll();
      saveState();
    }
  };

  //updating into database
  const saveTemplate = async () => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0, // Maximum quality
    });

    // Convert dataURL to Blob
    const blob = await (await fetch(dataURL)).blob();

    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, `template_${Date.now()}.png`);
    formData.append("templateName", `template_${Date.now()}.png`);
    formData.append("templateType", "image/png");
    formData.append("category", category);

    const response = await authPost(
      `template/${user.hospitalID}/${user.id}`,
      formData,
      user.token
    );
    console.log("response", response);
    fetchTemplates();

  };

    const debouncedSaveHandler = debounce(saveTemplate, DEBOUNCE_DELAY);
  

  const handleSave = () => {
    debouncedSaveHandler();
  };

  return (
    <Grid container spacing={2} sx={{ minHeight: "85vh" }}>
      <Grid item xs={6} className={styles.preview}>
        <Grid className={styles.previewSubcontainer}>
          Preview
          {activeAction && (
            // <canvas ref={canvasRef} style={{ border: "1px solid #ddd" }} />

            <>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ border: "1px solid #ddd" }}
              />
            </>
          )}
        </Grid>
      </Grid>
      <Grid item xs={6} className={styles.tools}>
        <ul className={styles.ullist}>
          <li className={styles.listItem}>
            {activeAction === "template" ? (
              <ul className={styles.sampleTemplateul}>
                <li
                  onClick={() => {
                    setActiveActionValue(template1);
                    setActiveIndex(1);
                  }}
                >
                  <img
                    className={`${
                      activeIndex && activeIndex === 1
                        ? styles.sampleTemplateHilight
                        : styles.sampleTemplate
                    }`}
                    src={template1}
                  />
                </li>
                <li
                  onClick={() => {
                    setActiveActionValue(template2);
                    setActiveIndex(2);
                  }}
                >
                  <img
                    className={`${
                      activeIndex && activeIndex === 2
                        ? styles.sampleTemplateHilight
                        : styles.sampleTemplate
                    }`}
                    src={template2}
                  />
                </li>
                <li
                  onClick={() => {
                    setActiveActionValue(template3);
                    setActiveIndex(3);
                  }}
                >
                  <img
                    className={`${
                      activeIndex && activeIndex === 3
                        ? styles.sampleTemplateHilight
                        : styles.sampleTemplate
                    }`}
                    src={template3}
                  />
                </li>
                <li
                  onClick={() => {
                    setActiveActionValue(template4);
                    setActiveIndex(4);
                  }}
                >
                  <img
                    className={`${
                      activeIndex && activeIndex === 4
                        ? styles.sampleTemplateHilight
                        : styles.sampleTemplate
                    }`}
                    src={template4}
                  />
                </li>
              </ul>
            ) : (
              <>
                <div onClick={() => handleAction("template")}>
                  <img className={styles.listItemimg} src={selecttemplate} />
                </div>
                <div>Select The Template</div>
              </>
            )}
          </li>

          <li className={styles.listItem} onClick={() => handleAction("logo")}>
            <div>
              <img className={styles.listItemimg} src={logoimg} />
            </div>
            <div>Add Logo</div>
          </li>

          <li
            className={styles.listItem}
            onClick={() => {
              handleAction("colors");
            }}
          >
            {activeAction === "colors" ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1>Colours</h1>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  {/* Add spacing here */}
                  <label
                    style={{
                      fontSize: "16px",
                      marginRight: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Select Color
                  </label>
                  {/* Hidden input field */}
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      handleTextChange("fill", e.target.value);
                    }}
                    style={{
                      opacity: 0,
                      position: "absolute",
                      width: "0",
                      height: "0",
                    }}
                  />
                  {/* Color preview button */}
                  <div
                    onClick={() => colorInputRef.current?.click()} // Opens color picker when clicked
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "2px solid #ccc",
                      backgroundColor: textColor,
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <img className={styles.listItemimg} src={textcolors} />
                </div>
                <div>Try other colors</div>
              </>
            )}
          </li>

          <li className={styles.listItem} onClick={() => handleAction("text")}>
            {activeAction === "text" ? (
              <TextFormating
                addText={addText}
                addTable={addTable}
                addWatermark={addWatermark}
                handleTextChange={handleTextChange}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                rows={rows}
                columns={columns}
                setRows={setRows}
                setColumns={setColumns}
                watermarkOpacity={watermarkOpacity}
                setWatermarkOpacity={setWatermarkOpacity}
              />
            ) : (
              <>
                <div>
                  <img className={styles.listItemimg} src={text} />
                </div>
                <div>Text Formatting</div>
              </>
            )}
          </li>

          {/* <li className={styles.listItem} onClick={() => handleAction("print")}>
            {activeAction === "print" ? (
              <h1>print</h1>
            ) : (
              <>
                <div>
                  <img className={styles.listItemimg} src={print} />
                </div>
                <div>Print Adjustments</div>
              </>
            )}
          </li> */}

          <li style={{ marginTop: "3rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                style={{ marginRight: "1rem" }}
                onClick={() => fetchTemplates()}
              >
                cancel
              </Button>
              <Button
                style={{ borderRadius: "50px", width: "90px" }}
                variant="contained"
                onClick={() => handleSave()}
              >
                Save
              </Button>
            </div>
          </li>
        </ul>
      </Grid>
    </Grid>
  );
};

export default CanvasEditor;