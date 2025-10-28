// src/components/ImageCard.jsx
import React from "react";

function ImageCard({ src }) {
  return (
    <div className="image-card">
      <img src={src} alt="Imagen" />
    </div>
  );
}

export default ImageCard;
