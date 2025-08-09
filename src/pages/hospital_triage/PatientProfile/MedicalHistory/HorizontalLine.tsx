type Line = {
  x2: number;
  top: number;
  left: number;
  Iscircle: boolean;
};
const LineBetweenPointsHorizontal = ({
  x2,
  top,
  left,
  Iscircle = false,
}: Line) => {
  const pointA = { x: 6, y: 6 };
  const pointC = { x: x2, y: 6 };
  const pathData = `M${pointA.x},${pointA.y} L${pointC.x},${pointC.y}`;
  const viewBoxWidth = Math.max(pointA.x, pointC.x) + 20;
  const viewBoxHeight = Math.max(pointA.y, pointC.y) + 20;
  return (
    <div
      style={{
        height: `${viewBoxHeight}px`,
        position: "absolute",
        zIndex: 1000,
        backgroundColor: "transparent",
        top: top,
        left: left,
      }}
    >
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width={viewBoxWidth}
        height={viewBoxHeight}
        style={{
          backgroundColor: "transparent",
        }}
      >
        <path
          d={pathData}
          fill="none"
          stroke="#1977f3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Circle at Point A */}
        {Iscircle && (
          <circle cx={pointA.x} cy={pointA.y} r={5} fill="#1977f3" />
        )}

        {/* Circle at Point B */}
        {/* <circle cx={pointB.x} cy={pointB.y} r={2} fill="blue" /> */}

        {/* Circle at Point C */}
        {!Iscircle && (
          <circle cx={pointC.x} cy={pointC.y} r={3} fill="#1977f3" />
        )}
      </svg>
    </div>
  );
};

export default LineBetweenPointsHorizontal;
