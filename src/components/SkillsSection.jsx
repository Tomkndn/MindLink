import React from "react";
import { Plus, X } from "lucide-react";

const SkillsSection = ({ skills, onUpdate }) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState("");

  const handleAdd = () => {
    if (newSkill.trim()) {
      onUpdate([...skills, newSkill.trim()]);
      setNewSkill("");
      setIsAdding(false);
    }
  };

  const handleRemove = (skillToRemove) => {
    onUpdate(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Skills</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Skill
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ps-1"
            placeholder="Enter a skill"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 group"
          >
            {skill}
            <button
              onClick={() => handleRemove(skill)}
              className="ml-2 text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;