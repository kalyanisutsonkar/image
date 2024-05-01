import React, { useRef, useEffect, useState } from 'react';

function ImageEditor({ imageSrc }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageSrc;

    return () => {
      // Cleanup code if necessary
    };
  }, [imageSrc]);

  const handleMouseDown = (e) => {
    if (!editing) return;
    isDrawingRef.current = true;
    [lastXRef.current, lastYRef.current] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const handleMouseMove = (e) => {
    if (!editing || !isDrawingRef.current) return;
    const ctx = ctxRef.current;
    ctx.strokeStyle = '#000';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    [lastXRef.current, lastYRef.current] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const handleMouseUp = () => {
    if (!editing) return;
    isDrawingRef.current = false;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'edited_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setEditing(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmitText = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.font = '30px Arial';
    ctx.fillText(text, 50, 50);
    setEditing(false);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {editing ? (
        <>
          <form onSubmit={handleSubmitText}>
            <input type="text" value={text} onChange={handleTextChange} />
            <button type="submit">Submit Text</button>
          </form>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
}

export default ImageEditor;
