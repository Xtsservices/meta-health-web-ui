import React from "react";
import "./CircularProgress.css";

type circularProps = {
  percentage1: number;
  percentage2: number;
  percentage3: number;
};

const CircularProgress = ({
  percentage1,
  percentage2,
  percentage3,
}: circularProps) => {
  const [isAllZero, setIsAllZero] = React.useState(false);
  const [gradientStop1, setGradientStop1] = React.useState("0%");
  const [gradientStop2, setGradientStop2] = React.useState("0%");
  const [gradientStop3, setGradientStop3] = React.useState("0%");
  React.useEffect(() => {
    setIsAllZero(
      Number(percentage1) === 0 &&
      Number(percentage2) === 0 &&
      Number(percentage3) === 0
    );
    setGradientStop1(`${Number(percentage1)}%`);
    setGradientStop2(`${Number(percentage1) + Number(percentage2)}%`);
    setGradientStop3(
      `${Number(percentage1) + Number(percentage2) + Number(percentage3)}%`
    );
  }, [percentage1, percentage2, percentage3]);
  return (
    <div className="circular-progress">
      <div className="circle-mask">
        {isAllZero ? (
          <div
            className="circle-fill"
            style={{
              background: "#ccc",
            }}
          />
        ) : (
          <div
            className="circle-fill"
            style={{
              background: `conic-gradient(
                #a855f7 0% ${gradientStop1},
                #2e87fd ${gradientStop1} ${gradientStop2},
                #3ce7b3 ${gradientStop2} ${gradientStop3},
                #3ce7b3 ${gradientStop3} 100%
              )`,
            }}
          />
        )}
        <div className="inner-circle" />
      </div>
      <span className="percentage">

        Percentage
        <br style={{ marginBottom: "5px" }} />

      </span>
      <span className="percentage">

        <br style={{ marginBottom: "5px" }} />

      </span>
      <span className="percentage">
        {/* {name3} */}
        <br style={{ marginBottom: "5px" }} />
        {/* {percentage3}% */}
      </span>
    </div>
  );
};

export default CircularProgress;
