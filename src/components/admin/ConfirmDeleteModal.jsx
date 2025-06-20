import React from "react";

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[350px] relative">
        <button
          className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2 text-gray-300">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <path fill="#ccc" d="M9 3v1H4v2h16V4h-5V3H9zm-4 4v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7H5zm2 2h6v11H7V9z"/>
            </svg>
          </span>
          <p className="text-lg font-medium mb-6 text-center">
            Are you sure you want to delete this item?
          </p>
          <div className="flex gap-4">
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600"
              onClick={onClose}
            >
              No, cancel
            </button>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600"
              onClick={onConfirm}
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;