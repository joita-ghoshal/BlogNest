import { useState, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'blockquote', 'code-block',
  'link', 'image',
];

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const handleChange = useCallback((content) => {
    onChange(content);
  }, [onChange]);

  return (
    <div className="quill-editor rounded-xl overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write your blog content...'}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default RichTextEditor;
