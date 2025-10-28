import React, { useState, useEffect } from "react";
import "./noticebord.css";

const NoticeBoard = ({ images = [], interval = 8000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!images.length) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [currentIndex]);

  if (!images.length) {
    return (
      <div className="notice-board">
        <div className="notice-box notice-box--empty">
          <p className="notice-placeholder">Add notice images to display here.</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="notice-board">
      <div className="notice-box">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="notice-placeholder notice-placeholder--loading">
                Loading notice...
              </div>
            )}
            <img
              src={currentImage}
              alt={`notice-${currentIndex + 1}`}
              className={`notice-image ${imageLoaded ? "notice-image--visible" : ""}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="notice-placeholder notice-placeholder--error">
            Unable to load notice image.
            <span>{currentImage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
