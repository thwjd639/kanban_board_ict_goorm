// TaskCard.tsx
import React from 'react';
import { Calendar, User, Briefcase, AlertTriangle, Clock } from 'lucide-react';
import { formatDate, getDueDateStatus, getDueDateColor, getDueDateText } from '../utils/dateUtils';
import type { Task, Column } from '../types/types';

interface TaskCardProps {
  task: Task;
  columnId: string;
  columns: Column[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string, columnId: string) => void;
  onDragStart?: (e: React.DragEvent, task: Task, columnId: string) => void;
  onViewDetail?: (task: Task) => void;
  compact?: boolean;
}

const DueDateBadge: React.FC<{ dueDate: Date }> = ({ dueDate }) => {
  const status = getDueDateStatus(dueDate);
  const colorClass = getDueDateColor(status);
  const statusText = getDueDateText(status);
  
  if (status === 'normal') return null;
  
  return (
    <div className={`text-xs px-2 py-1 rounded border ${colorClass} font-medium`}>
      {statusText} ({formatDate(dueDate)})
    </div>
  );
};

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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle size={12} className="text-red-500" />;
      case 'medium': return <Clock size={12} className="text-yellow-500" />;
      case 'low': return <Clock size={12} className="text-green-500" />;
      default: return null;
    }
  };

  // 마감일 상태 확인
  const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;
  const dueDateColor = dueDateStatus ? getDueDateColor(dueDateStatus) : '';
  const dueDateText = dueDateStatus ? getDueDateText(dueDateStatus) : '';

  return (
    <div
      draggable={!compact}
      onDragStart={onDragStart ? (e) => onDragStart(e, task, columnId) : undefined}
      className={`relative bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border-l-4 
                  hover:shadow-md transition-all duration-200 cursor-pointer
                  ${getPriorityColor(task.priority)}
                  ${!compact ? 'hover:-translate-y-1' : ''}`}
      onClick={() => onViewDetail?.(task)}
    >
      {/* 작업 제목 */}
      <h3 className={`font-medium text-gray-900 dark:text-gray-100 mb-2 
                      ${compact ? 'text-sm' : 'text-base'} line-clamp-2 pr-12`}>
        {task.title}
      </h3>

      {/* 대시보드가 아닌 경우에만 편집/삭제 버튼 표시 */}
      {!compact && (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                       px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            편집
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('정말로 이 작업을 삭제하시겠습니까?')) {
                onDelete(task.id, columnId);
              }
            }}
            className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 
                       px-2 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            삭제
          </button>
        </div>
      )}

      {/* 마감일 배지 - 우선도 높음 */}
      {task.dueDate && dueDateStatus && dueDateStatus !== 'normal' && (
        <div className={`text-xs px-2 py-1 rounded border ${dueDateColor} font-medium mb-2`}>
          {dueDateText} ({formatDate(task.dueDate)})
        </div>
      )}

      {/* 설명 */}
      {task.description && !compact && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* 하단 정보 */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* 우선순위 */}
          <span className="flex items-center gap-1">
            {getPriorityIcon(task.priority)}
            <span className="text-gray-600 dark:text-gray-400 capitalize">
              {task.priority}
            </span>
          </span>

          {/* 담당자 */}
          {task.assignee && (
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              {task.workMode === 'personal' ? <User size={12} /> : <Briefcase size={12} />}
              {task.assignee}
            </span>
          )}
        </div>

        {/* 일반 마감일 (긴급하지 않은 경우) */}
        {task.dueDate && (!dueDateStatus || dueDateStatus === 'normal') && (
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;