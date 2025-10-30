import React, { useState, useEffect } from "react";
import "./imageslider.css";

const NoticeBoard = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className="notice-board">
      <img
        src={images[currentIndex]}
        alt="notice"
        className="notice-image"
      />
    </div>
  );
};