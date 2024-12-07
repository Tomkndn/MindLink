import React, { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

const EditableField = ({ label, value, onSave, type = "text" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  return (
    <div className="group relative">
      {isEditing ? (
        <div className="flex justify-center flex-col">
          <span className="text-sm text-gray-500">{label}</span>
          <div className="flex items-center justify-between">
            <input
              type={type}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ps-1"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            <div>
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-700"
                >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:text-red-700"
                >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">{label}</span>
            <p className="text-gray-900">{value || "Not specified"}</p>
          </div>
          {(label!=="Email") && <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600"
          >
            <Pencil className="h-4 w-4" />
          </button>}
        </div>
      )}
    </div>
  );
}

export default EditableField;