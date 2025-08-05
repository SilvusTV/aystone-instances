import React from 'react';
import { toast } from './ToastContainer';

const ToastDemo: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Demo</h2>
      <p className="mb-4">Click the buttons below to test the toast notification system:</p>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => toast.success('This is a success message!')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={() => toast.error('This is an error message!')}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={() => toast.info('This is an info message!')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Show Info Toast
        </button>
      </div>
    </div>
  );
};

export default ToastDemo;