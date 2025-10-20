import React, { useState, useEffect } from "react";
import "./noticebord.css";

const NoticeBoard = ({ images, interval = 8000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className="notice-board">
      <div className="notice-box">
        <img
          src={images[currentIndex]}
          alt={`notice-${currentIndex}`}
          className="notice-image"
        />
      </div>
    </div>
  );
};

export default NoticeBoard;
