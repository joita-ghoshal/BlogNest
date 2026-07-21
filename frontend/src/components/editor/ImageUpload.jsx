import { useState, useRef } from 'react';
import { HiPhotograph, HiX } from 'react-icons/hi';

const ImageUpload = ({ value, onChange, accept = 'image/*' }) => {
  const [preview, setPreview] = useState(value || null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden">
        <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <HiX size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
        dragging ? 'border-[#00D4D8]' : ''
      }`}
      style={{
        borderColor: dragging ? '#00D4D8' : 'var(--border)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <HiPhotograph size={40} style={{ color: 'var(--text-muted)' }} />
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        Click or drag image to upload
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        PNG, JPG, GIF up to 5MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
