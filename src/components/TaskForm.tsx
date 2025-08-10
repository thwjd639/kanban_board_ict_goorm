import React from 'react';
import type { WorkMode } from '../types/types';
import { getPriorityText } from '../utils/taskUtils';

interface TaskFormProps {
  formData: {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  };
  workMode: WorkMode;
  onSubmit: () => void;
  onCancel: () => void;
  onChange: (data: Partial<TaskFormProps['formData']>) => void;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ formData, workMode, onSubmit, onCancel, onChange, isEditing = false }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() === '') return;
    onSubmit();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner mt-4 space-y-3"
    >
      <div>
        <label htmlFor="taskTitle" className="sr-only">작업 제목</label>
        <input
          id="taskTitle"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-200"
          placeholder="작업 제목"
          required
        />
      </div>
      <div>
        <label htmlFor="taskDescription" className="sr-only">설명</label>
        <textarea
          id="taskDescription"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-200"
          placeholder="상세 설명 (선택사항)"
          rows={2}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {workMode === 'business' && (
          <div className="flex-1">
            <label htmlFor="taskAssignee" className="sr-only">담당자</label>
            <input
              id="taskAssignee"
              type="text"
              name="assignee"
              value={formData.assignee}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-200"
              placeholder="담당자 (이름)"
            />
          </div>
        )}
        <div className="flex-1">
          <label htmlFor="taskPriority" className="sr-only">우선순위</label>
          <select
            id="taskPriority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-200"
          >
            <option value="low">{getPriorityText('low')}</option>
            <option value="medium">{getPriorityText('medium')}</option>
            <option value="high">{getPriorityText('high')}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {isEditing ? '수정' : '추가'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default TaskForm;