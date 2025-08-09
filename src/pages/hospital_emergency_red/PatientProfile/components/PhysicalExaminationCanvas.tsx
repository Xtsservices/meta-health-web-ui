/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./physicalExaminationForm.module.scss";
import { Button, Input, Slider } from "@mui/material";
import { NotInterested, Redo, Undo } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authPost } from "../../../../axios/useAuthPost";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { setSuccess } from "../../../../store/error/error.action";
import PhysicalExamination from "../../../../assets/body_physical_examination.jpg";

const IMAGES = [PhysicalExamination];

interface Stroke {
  lineWidth: number;
  color: string;
  path: string;
}

// Currently the canvas Aspect Ratio is fixed at 1
// The drawing height and width are kept 600 at all times
// The actual height and width toggle between 300 and 600 as per screen size
// drawingAreaHeight denotes the default 600
// canvasHeight denotes the actual bounding rect height

const PhysicalExaminationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [lineWidth, setLineWidth] = useState(2);
  const [canvasBounds, setCanvasBounds] = useState({ h: 0, w: 0 });
  const [drawingArea, setDrawingArea] = useState({ h: 600, w: 600 });
  const [color, setColor] = useState("#000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const [newImg, setNewImg] = useState("");
  const dispatch = useDispatch();
  const isCustomerCare = location.pathname.includes("customerCare");


  const scaleUpX = useCallback(
    (val: number) => {
      return val * drawingArea.w;
    },
    [drawingArea]
  );
  const scaleUpY = useCallback(
    (val: number) => {
      return val * drawingArea.h;
    },
    [drawingArea]
  );
  const scaleDownX = useCallback(
    (val: number) => {
      return val / canvasBounds.h;
    },
    [canvasBounds]
  );

  const scaleDownY = useCallback(
    (val: number) => {
      return val / canvasBounds.w;
    },
    [canvasBounds]
  );

  useEffect(() => {
    // Sets drawing area
    setDrawingArea({
      h: canvasRef.current!.height,
      w: canvasRef.current!.width
    });
    const bounds = canvasRef.current!.getBoundingClientRect();
    setCanvasBounds({
      h: bounds.height,
      w: bounds?.width
    });
  }, []);

  const clearCanvas = useCallback(() => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current.height);
    }
  }, [ctx]);

  useEffect(() => {
    const I = new Image();
    I.crossOrigin = "anonymous";
    I.src = IMAGES[0];
    I.onload = () => setBgImage(I); // load bg image from s3 bucket
  }, []);

  const resetCanvas = useCallback(() => {
    clearCanvas();
    setIsDrawing(false);
    setStrokes([]);
    setRedoStack([]);
  }, [clearCanvas]);

  const redrawCanvas = useCallback(() => {
    if (ctx && bgImage) {
      clearCanvas();
      const width = canvasRef.current?.width ?? 600; // Default width if null
      const height = canvasRef.current?.height ?? 600; // Default height if null

      ctx.drawImage(bgImage, 0, 0, width, height);
      strokes.forEach((stroke) => {
        ctx.lineWidth = stroke.lineWidth;
        ctx.strokeStyle = stroke.color;

        let path = "";
        let isX = true;
        const list = stroke.path.split(" ");
        list.forEach((token) => {
          if (token === "L" || token === "M") path += token;
          else {
            path += isX ? scaleUpX(Number(token)) : scaleUpY(Number(token));
            isX = !isX;
          }
          path += " ";
        });

        const path2D = new Path2D(path);
        ctx.stroke(path2D);
      });
    }
  }, [bgImage, clearCanvas, ctx, strokes, scaleUpX, scaleUpY]);

  const undoShape = useCallback(() => {
    if (strokes.length === 0) return;
    const newStrokes = strokes.slice(0, -1);
    setRedoStack((stack) => [...stack, strokes[strokes.length - 1]]);
    setStrokes(newStrokes);
    redrawCanvas();
  }, [strokes, redrawCanvas]);

  const redoShape = useCallback(() => {
    if (redoStack.length === 0) return;
    const restoredStroke = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));
    setStrokes((strokes) => [...strokes, restoredStroke]);
    redrawCanvas();
  }, [redoStack, redrawCanvas]);

  useEffect(() => {
    if (ctx) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
    }
  }, [ctx, lineWidth, color]);

  useEffect(() => {
    redrawCanvas();
  }, [redoStack, redrawCanvas, undoShape, strokes, bgImage]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      setIsDrawing(true);
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = scaleDownX(e.clientX - rect.left);
      const y = scaleDownY(e.clientY - rect.top);
      const path = `M ${x} ${y}`;
      setStrokes((strokes) => [...strokes, { lineWidth, color, path }]);
    },
    [color, lineWidth, scaleDownX, scaleDownY]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setRedoStack([]);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDrawing && strokes.length) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = scaleDownX(e.clientX - rect.left);
        const y = scaleDownY(e.clientY - rect.top);
        const newStrokes = [...strokes];
        newStrokes[newStrokes.length - 1].path += ` L ${x} ${y}`;
        setStrokes(newStrokes);
        redrawCanvas();
      }
    },
    [isDrawing, redrawCanvas, strokes, scaleDownX, scaleDownY]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      const touch = e.touches[0];
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = scaleDownX(touch.clientX - rect.left);
      const y = scaleDownY(touch.clientY - rect.top);
      const path = `M ${x} ${y}`;
      setStrokes((strokes) => [...strokes, { lineWidth, color, path }]);
    },
    [color, lineWidth, scaleDownX, scaleDownY]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDrawing(false);
    setRedoStack([]);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (isDrawing && strokes.length) {
        const touch = e.touches[0];
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = scaleDownX(touch.clientX - rect.left);
        const y = scaleDownY(touch.clientY - rect.top);
        const newStrokes = [...strokes];
        newStrokes[newStrokes.length - 1].path += ` L ${x} ${y}`;
        setStrokes(newStrokes);
        redrawCanvas();
      }
    },
    [isDrawing, redrawCanvas, strokes, scaleDownX, scaleDownY]
  );

  const keyDownEventListeners = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") undoShape();
      else if (e.ctrlKey && e.key === "y") redoShape();
      else if (e.ctrlKey && e.key === "c") resetCanvas();
    },
    [undoShape, redoShape, resetCanvas]
  );

  const handleSave = useCallback(async () => {
    if (!canvasRef.current) return;

    // Get the canvas data URL
    const canvasDataUrl = canvasRef.current.toDataURL("image/png", 1.0);

    // Convert the data URL to a Blob
    const response = await fetch(canvasDataUrl);
    const blob = await response.blob();

    // Create FormData and append the image blob
    const forms = new FormData();
    forms.append("photo", blob, "canvas-drawing.png"); // Add a filename
    forms.append("image", "Canvas drawing or any additional text"); // Example of additional data

    // Dispatch action to save data or directly call API

    try {
      const data = await authPost(
        `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/${currentPatient.id}/redzone/physicalExaminationImage`,
        forms,
        user.token
      );

      dispatch(setSuccess(data?.message));
    } catch (error) {
      console.error("Error saving canvas data:", error);
    }
  }, [canvasRef, user]);

  useEffect(() => {
    if (canvasRef.current) {
      document.addEventListener("keydown", keyDownEventListeners);
      return () => {
        document.removeEventListener("keydown", keyDownEventListeners);
      };
    }
  }, [keyDownEventListeners]);

  useEffect(() => {
    if (!newImg && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: false
      });
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      setCtx(canvas.getContext("2d"));

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    newImg
  ]);

  useEffect(() => {
    const handleResize = () => {
      const bounds = canvasRef.current!.getBoundingClientRect();
      setCanvasBounds({
        h: bounds.height,
        w: bounds?.width
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleReset = () => {
    setNewImg("");
  };

  const getData = useCallback(async () => {
    try {
      const response = await authFetch(
        `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/${currentPatient.id}/redzone/physicalExaminationImage`,
        user.token
      );
      if (response && response.imageURL) {
        setNewImg(response.imageURL);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }, [user, currentPatient]);

  useEffect(() => {
    getData(); // Call the function when the component mounts or user/currentPatient change
  }, [getData]);

  return (
    <>
      <div className={styles.injuryMarkerContainer}>
        <div className={styles.canvasContainer}>
          {newImg && newImg !== "" ? (
            <div>
              <img
                src={newImg}
                alt="img"
                style={{
                  height: "600px",
                  width: "600px",
                  border: "1px solid #000",
                  borderRadius: "0.5rem"
                }}
              />
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{ border: "1px solid #000", borderRadius: "0.5rem" }}
              width={600}
              height={600}
            />
          )}
        </div>
        <div className={styles.navbar}>
          {IMAGES.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              className={styles.thumbnail}
              //   onClick={() => setCurrentImage(image)}
            />
          ))}
          <div className={styles.controlsContainer}>
            <Input type="color" onChange={(e) => setColor(e.target.value)} />
            <Slider
              value={lineWidth}
              onChange={(_, newValue) => setLineWidth(newValue as number)}
              aria-labelledby="line-width-slider"
              min={1}
              max={12}
              orientation="vertical"
              valueLabelDisplay="auto"
              style={{ height: 100, marginBlock: 4 }}
            />
            <Button disabled={strokes.length === 0} onClick={undoShape}>
              <Undo color={strokes.length > 0 ? "inherit" : "disabled"} />
            </Button>
            <Button disabled={redoStack.length === 0} onClick={redoShape}>
              <Redo color={redoStack.length > 0 ? "inherit" : "disabled"} />
            </Button>
            <Button onClick={resetCanvas}>
              <NotInterested />
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {newImg && (
          <Button variant="contained" onClick={handleReset}>
            Reset
          </Button>
        )}
        {!isCustomerCare && <Button variant="contained" onClick={handleSave}>
          Save
        </Button>}
      </div>
    </>
  );
};

export default PhysicalExaminationCanvas;
