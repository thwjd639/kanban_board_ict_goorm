import React, { useState } from 'react';
import { X, User, Briefcase, Menu, Edit } from 'lucide-react';
import type { Task, Column } from '../types/types';
import { getPriorityColor, getPriorityText } from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  columnId: string;
  columns: Column[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string, columnId: string) => void;
  onDragStart?: (e: React.DragEvent, task: Task, columnId: string) => void;
  onViewDetail?: (task: Task) => void;
  compact?: boolean; // 대시보드 전용 간단 모드
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  columnId,
  columns,
  onEdit,
  onDelete,
  onDragStart,
  onViewDetail,
  compact = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-md border-t-4 border-b-2 border-l-2 border-r-2 border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 ${!compact ? 'cursor-grab active:cursor-grabbing' : ''}`}
      draggable={!compact}
      onDragStart={(e) => !compact && onDragStart && onDragStart(e, task, columnId)}
      onClick={() => !compact && onViewDetail && onViewDetail(task)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 break-words line-clamp-2">
          {task.title}
        </h3>
        {!compact && (
          <div className="flex items-center gap-1.5">
            <button
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              aria-label="편집"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 rounded-full text-gray-400 hover:bg-red-200 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id, columnId);
              }}
              aria-label="삭제"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {task.description && !compact && (
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 break-words line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className={`px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
          {getPriorityText(task.priority)}
        </span>
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User size={12} />
            <span className="font-medium">{task.assignee}</span>
          </div>
        )}
        {task.workMode === 'business' && !compact && (
          <div className="flex items-center gap-1">
            <Briefcase size={12} />
            <span className="font-medium">업무</span>
          </div>
        )}
        {task.workMode === 'personal' && !compact && (
          <div className="flex items-center gap-1">
            <User size={12} />
            <span className="font-medium">개인</span>
          </div>
        )}
      </div>

      {!compact && (
        <div className="relative md:hidden mt-2">
          <button
            className="p-1 text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDropdownToggle();
            }}
          >
            <Menu size={14} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 min-w-[120px]">
              {columns.map(column => (
                <button
                  key={column.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                  }}
                  disabled={column.id === columnId}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 ${
                    column.id === columnId
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {column.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
