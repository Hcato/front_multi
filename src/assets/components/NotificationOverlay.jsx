import React from "react";
import rainOverlay from "../multimedia/lluvia.webp";

export const NotificationOverlay = ({ isRaining }) => {
  if (!isRaining) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${rainOverlay})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        pointerEvents: "none",
        zIndex: 1000
      }}
    />
  );
};