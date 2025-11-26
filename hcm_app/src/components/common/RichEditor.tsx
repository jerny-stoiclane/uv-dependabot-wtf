import React, { useEffect, useLayoutEffect, useRef } from 'react';

// Declare Quill as a global to use the CDN-loaded version
declare const Quill: any;

interface RichEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string | number;
  readOnly?: boolean;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder = '',
  height = '200px',
  readOnly = false,
}) => {
  const quillRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  // Keep the onChange callback reference updated
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    // Only create Quill instance once
    if (containerRef.current && !quillRef.current) {
      const editorContainer = containerRef.current.appendChild(
        document.createElement('div')
      );

      // Configure Quill with more formatting options to match what's used in the app
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        placeholder,
        readOnly,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
        },
        formats: [
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'list',
          'bullet',
          'link',
          'image',
          'color',
          'background',
          'align',
        ],
      });

      quillRef.current = quill;

      // Set initial content if available
      if (value) {
        try {
          // First try to set it as HTML content
          quill.root.innerHTML = value;
        } catch (error) {
          console.error('Error setting HTML content in Quill:', error);
          // Fallback approach - if that fails, try to insert as text
          quill.setText(value || '');
        }
      }

      // Handle text change events
      quill.on('text-change', () => {
        // Get HTML content
        const html = quill.root.innerHTML;
        // Only update if content actually changed
        if (html !== value) {
          onChangeRef.current(html);
        }
      });
    }

    return () => {
      // Clean up on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        quillRef.current = null;
      }
    };
  }, []);

  // Update readOnly state if it changes
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  // Update content if value prop changes (and it's different from current value)
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      // Avoid setting content if editor already has this content (prevents cursor jumps)
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    />
  );
};

export default RichEditor;
