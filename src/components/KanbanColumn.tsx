import React from 'react';
import { Plus } from 'lucide-react';
import type { Column, Task, WorkMode } from '../types/types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

interface KanbanColumnProps {
  column: Column;
  columns: Column[];
  workMode: WorkMode;
  draggedOver: string | null;
  draggedTask: Task | null;
  showAddForm: string | null;
  editingTask: Task | null;
  newTask: {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  };
  editTask: {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  };
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent, columnId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetColumnId: string) => void;
  onDragStart: (e: React.DragEvent, task: Task, columnId: string) => void;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onSaveEditTask: (columnId: string) => void;
  onCancelEditTask: () => void;
  onDeleteTask: (taskId: string, columnId: string) => void; // 이 prop이 누락되어 있었습니다
  onShowAddForm: (columnId: string) => void;
  onHideAddForm: () => void;
  onNewTaskChange: (data: Partial<typeof newTask>) => void;
  onEditTaskChange: (data: Partial<typeof editTask>) => void;
  onViewTaskDetail: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  columns,
  workMode,
  draggedOver,
  draggedTask,
  showAddForm,
  editingTask,
  newTask,
  editTask,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragStart,
  onAddTask,
  onEditTask,
  onSaveEditTask,
  onCancelEditTask,
  onDeleteTask,
  onShowAddForm,
  onHideAddForm,
  onNewTaskChange,
  onEditTaskChange,
  onViewTaskDetail,
}) => {
  const isDraggedOver = draggedOver === column.id;
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    onDragEnter(e, column.id);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, column.id);
  };

  return (
    <div
      className={`relative rounded-xl p-4 sm:p-5 flex flex-col h-full shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${column.color} ${isDraggedOver ? 'ring-4 ring-blue-500' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">{column.title} ({column.tasks.length})</h2>
        <button
          onClick={() => onShowAddForm(column.id)}
          className="p-1 sm:p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="작업 추가"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 -mr-2 pr-2">
        {showAddForm === column.id && (
          <TaskForm
            formData={newTask}
            workMode={workMode}
            onChange={onNewTaskChange}
            onSubmit={() => onAddTask(column.id)}
            onCancel={onHideAddForm}
          />
        )}
        {column.tasks
          .filter(task => task.workMode === workMode)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              columns={columns}
              onDragStart={onDragStart}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              onViewDetail={onViewTaskDetail}
            />
        ))}
      </div>
      
      {/* 편집 폼 */}
      {editingTask && editingTask.workMode === workMode && column.tasks.some(t => t.id === editingTask.id) && (
        <div className="mt-4 sm:mt-5">
          <TaskForm
            formData={editTask}
            workMode={workMode}
            onChange={onEditTaskChange}
            onSubmit={() => onSaveEditTask(column.id)}
            onCancel={onCancelEditTask}
            isEditing={true}
          />
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;