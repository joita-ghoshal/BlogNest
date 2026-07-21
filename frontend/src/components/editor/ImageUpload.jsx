import React, { useCallback } from 'react';
import { HiPhotograph, HiX } from 'react-icons/hi';

const ImageUpload = ({ file, previewUrl, onUpload, onRemove, accept = 'image/*', isAvatar }) => {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type.startsWith('image/')) {
        onUpload(droppedFile, URL.createObjectURL(droppedFile));
      }
    },
    [onUpload]
  );

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onUpload(selectedFile, URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div>
      {previewUrl ? (
        <div className={`relative ${isAvatar ? 'w-28 h-28 rounded-full mx-auto' : 'w-full h-48 rounded-xl overflow-hidden'}`}>
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF' }}
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
            isAvatar ? 'w-28 h-28 rounded-full mx-auto' : 'w-full py-12'
          }`}
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-tertiary)' }}
          onClick={() => document.getElementById('image-upload-input')?.click()}
        >
          <HiPhotograph className="w-8 h-8 mb-2" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {isAvatar ? 'Upload photo' : 'Drop an image or click to upload'}
          </p>
        </div>
      )}
      <input
        id="image-upload-input"
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
