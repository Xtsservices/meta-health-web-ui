import React from "react";
import styles from "./videos.module.scss";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

const VideoStaff: React.FC = () => {
  const navigate = useNavigate();
  const videoData = [
    {
      title: "NV-CORE",
      url: "https://www.youtube.com/embed/JtjKnw9wNuY",
    },
    {
      title: "V-TRACK",
      url: "https://www.youtube.com/embed/KmHqIfE3J4I",
    },
    {
      title: "V TRACK",
      url: "https://www.youtube.com/embed/KmHqIfE3J4I",
    },
  ];

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ marginRight: "10px" }}>
          <IconButton aria-label="delete" onClick={() => navigate("..")}>
            <ArrowBackIosIcon />
          </IconButton>
        </h3>
        <h2 style={{ flex: "1", justifyContent: "center" }}>Videos</h2>
      </div>

      {videoData.map((video, index) => (
        <div key={index}>
          <h3 style={{ margin: "0", textAlign: "center", flex: "1" }}>
            {video.title}
          </h3>
          <iframe
            width="560"
            height="315"
            src={video.url}
            frameBorder="0"
            allowFullScreen
            title={video.title}
          ></iframe>
        </div>
      ))}
    </div>
  );
};

export default VideoStaff;
