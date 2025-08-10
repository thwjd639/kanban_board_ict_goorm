import React, { useState } from 'react';
import { X, Edit, Trash2, Save, Clock, User, Briefcase, ChevronRight, AlertTriangle } from 'lucide-react';
import type { Task, Column, TaskStatus } from '../types/types';
import ActivityLog from './ActivityLog';
import { updateTaskTimeline, getPriorityColor, getPriorityText } from '../utils/taskUtils';

interface TaskDetailModalProps {
  task: Task;
  columns: Column[];
  onClose: () => void;
  onDelete: (taskId: string, columnId: string) => void;
  onUpdate: (updatedTask: Task, oldColumnId: string, newColumnId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, columns, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  
  const currentColumn = columns.find(col => col.tasks.some(t => t.id === task.id));
  if (!currentColumn) return null;

  const handleSave = () => {
    const changes = [];
    if (task.title !== editedTask.title) changes.push('제목');
    if (task.description !== editedTask.description) changes.push('설명');
    if (task.assignee !== editedTask.assignee) changes.push('담당자');
    if (task.priority !== editedTask.priority) changes.push('우선순위');
    
    // 타임라인에 수정 기록 추가
    const updatedTaskWithTimeline = {
      ...editedTask,
      timeline: changes.length > 0
        ? {
            ...editedTask.timeline,
            [`edit-${Date.now()}`]: {
              timestamp: new Date().toISOString(),
              message: `작업이 수정되었습니다: ${changes.join(', ')}`,
              status: 'edited'
            }
          }
        : editedTask.timeline
    };

    onUpdate(updatedTaskWithTimeline, currentColumn.id, currentColumn.id);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    const newColumn = columns.find(col => col.status === newStatus);
    if (!newColumn || newColumn.id === currentColumn.id) return;
    
    const updatedTask = updateTaskTimeline(task, currentColumn.status, newColumn.status as TaskStatus);
    onUpdate(updatedTask, currentColumn.id, newColumn.id);
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="text-xl sm:text-2xl font-bold bg-transparent border-b-2 border-blue-400 dark:border-blue-600 focus:outline-none w-full mr-4 text-gray-800 dark:text-gray-200"
              />
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">{task.title}</h2>
            )}
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  isEditing ? handleSave() : setIsEditing(true);
                }}
                className="p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isEditing ? "저장" : "수정"}
              >
                {isEditing ? <Save size={20} /> : <Edit size={20} />}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id, currentColumn.id);
                }}
                className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="삭제"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
                title="닫기"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* 작업 정보 섹션 */}
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">설명</p>
              {isEditing ? (
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  className="w-full h-24 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="작업에 대한 상세 설명을 작성하세요."
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{task.description || '설명이 없습니다.'}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">담당자</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTask.assignee}
                    onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="담당자를 지정하세요."
                  />
                ) : (
                  <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 gap-2">
                    <User size={16} />
                    {task.assignee || '미지정'}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">우선순위</p>
                {isEditing ? (
                  <select
                    value={editedTask.priority}
                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="low">낮음</option>
                    <option value="medium">보통</option>
                    <option value="high">높음</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getPriorityText(task.priority)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>생성: {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                {task.workMode === 'personal' ? <User size={16} /> : <Briefcase size={16} />}
                <span>{task.workMode === 'personal' ? '개인' : '업무'}</span>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">현재 상태</p>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentColumn.color}`}>
                  {currentColumn.title}
                </span>
                <ChevronRight size={16} className="text-gray-400" />
                <select
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="p-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none"
                  value={currentColumn.status}
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.status}>{col.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* 작업 기록 섹션 */}
          <ActivityLog timeline={task.timeline} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;