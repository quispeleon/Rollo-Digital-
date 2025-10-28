// src/components/Album.jsx
import React from "react";
import ImageCard from "./ImageCard";

// Importar imágenes
import goofy from "../assets/goofy.jpg";
import mickey from "../assets/mickey.jpeg";
import pluto from "../assets/pluto.png";

const images = [goofy, mickey, pluto];

function Album() {
  return (
    <div className="album">
      {images.map((img, index) => (
        <ImageCard key={index} src={img} />
      ))}
    </div>
  );
}

export default Album;
