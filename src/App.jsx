// App.js
import React, { useState } from 'react';
import './App.css';
import ImageEditor from './components/ImageEditor';

function App() {
  const [imageSrc, setImageSrc] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="App" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <h1>Drag & Drop</h1>
      <p>Upload only png,jpg and jpeg</p>
      <input type="file" onChange={handleUpload} accept="image/*" />
      <hr />
      {imageSrc && <ImageEditor imageSrc={imageSrc} />}
    </div>
  );
}

export default App;
