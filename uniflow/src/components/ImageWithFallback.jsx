import React, { useState } from "react";
import PropTypes from "prop-types";
import { getFallbackThumbnail } from "../store/canteenStore";

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const fallback = getFallbackThumbnail();
  const [currentSrc, setCurrentSrc] = useState(() => src || fallback);

  const handleError = () => {
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ImageWithFallback.defaultProps = {
  src: undefined,
  className: undefined,
};

export default ImageWithFallback;
