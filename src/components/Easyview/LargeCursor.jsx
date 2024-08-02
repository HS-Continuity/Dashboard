import React, { useState, useEffect } from "react";

const LargeCursor = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = e => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: cursorPosition.x,
        top: cursorPosition.y,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "rgba(252, 179, 22, 0.4)",
        border: "1px solid black",
        pointerEvents: "none",
        zIndex: 9998,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default LargeCursor;
