import React, { useState, useEffect, useCallback } from 'react';
import { User, Briefcase } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useWorkMode } from '../hooks/useWorkMode';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { updateTaskTimeline } from '../utils/taskUtils';
import KanbanColumn from '../components/KanbanColumn';
import TaskDetailModal from '../components/TaskDetailModal';
import CelebrationAnimation from '../components/CelebrationAnimation';
import type { Task, Column } from '../types/types';

// 우선순위와 최근 생성일 기준으로 정렬하는 함수를 수정합니다.
const sortTasks = (tasks: Task[]): Task[] => {
  const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
  
  // 원본 배열을 변경하지 않기 위해 새로운 배열을 생성합니다.
  return [...tasks].sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

const KanbanBoard: React.FC = () => {
  const { workMode, toggleWorkMode } = useWorkMode();
  const {
    draggedTask,
    draggedFrom,
    draggedOver,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    resetDrag
  } = useDragAndDrop();

  const defaultColumns: Column[] = [
    { id: '1', title: '할 일', tasks: [], color: 'bg-blue-100 dark:bg-blue-900/30', status: 'todo' },
    { id: '2', title: '진행 중', tasks: [], color: 'bg-yellow-100 dark:bg-yellow-900/30', status: 'in-progress' },
    { id: '3', title: '보류', tasks: [], color: 'bg-orange-100 dark:bg-orange-900/30', status: 'stop' },
    { id: '4', title: '완료', tasks: [], color: 'bg-green-100 dark:bg-green-900/30', status: 'done' }
  ];

  const [columns, setColumns] = useLocalStorage('kanban-columns', defaultColumns);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', priority: 'medium' as const, dueDate: '' });
  const [editTask, setEditTask] = useState({ title: '', description: '', assignee: '', priority: 'medium' as const, dueDate: '' });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 축하 애니메이션 상태 추가
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationTaskTitle, setCelebrationTaskTitle] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingTask) {
        cancelEditTask();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [editingTask]);

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedTask || !draggedFrom || draggedFrom === targetColumnId) {
      resetDrag();
      return;
    }

    const fromColumn = columns.find(col => col.id === draggedFrom);
    const toColumn = columns.find(col => col.id === targetColumnId);

    if (!fromColumn || !toColumn) {
      resetDrag();
      return;
    }

    // 완료 상태로 이동하는 경우 축하 애니메이션 트리거
    const isMovingToDone = toColumn.status === 'done' && fromColumn.status !== 'done';
    if (isMovingToDone) {
      setCelebrationTaskTitle(draggedTask.title);
      setShowCelebration(true);
    }

    const updatedTask = updateTaskTimeline(draggedTask, fromColumn.status, toColumn.status);

    setColumns(prev => prev.map(column => {
      if (column.id === draggedFrom) {
        return { ...column, tasks: column.tasks.filter(task => task.id !== draggedTask.id) };
      }
      if (column.id === targetColumnId) {
        const updatedTasks = [...column.tasks, updatedTask];
        return { ...column, tasks: sortTasks(updatedTasks) };
      }
      return column;
    }));

    resetDrag();
  };

  const addTask = (columnId: string) => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newTask.title,
      description: newTask.description || undefined,
      assignee: workMode === 'personal' ? '나' : (newTask.assignee || undefined),
      priority: newTask.priority,
      createdAt: new Date(),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      timeline: {
        [`created-${Date.now()}`]: {
          timestamp: new Date().toISOString(),
          message: `${workMode === 'personal' ? '나' : (newTask.assignee || '담당자')}에 의해 작업이 생성되었습니다.`,
          status: 'created'
        }
      },
      workMode: workMode
    };

    // 완료 컬럼에 직접 추가하는 경우 축하 애니메이션 트리거
    const targetColumn = columns.find(col => col.id === columnId);
    if (targetColumn?.status === 'done') {
      setCelebrationTaskTitle(task.title);
      setShowCelebration(true);
    }

    setColumns(prev => prev.map(column => {
      if (column.id === columnId) {
        const updatedTasks = [...column.tasks, task];
        return { ...column, tasks: sortTasks(updatedTasks) };
      }
      return column;
    }));

    setNewTask({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '' });
    setShowAddForm(null);
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTask({
      title: task.title,
      description: task.description || '',
      assignee: task.assignee || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
    });
  };

  const saveEditTask = (columnId: string) => {
    if (!editingTask || !editTask.title.trim()) return;

    const changes = [];
    if (editingTask.title !== editTask.title) changes.push('제목');
    if (editingTask.description !== editTask.description) changes.push('설명');
    if (editingTask.assignee !== editTask.assignee) changes.push('담당자');
    if (editingTask.priority !== editTask.priority) changes.push('우선순위');

    setColumns(prev => prev.map(column => {
      if (column.id === columnId) {
        const updatedTasks = column.tasks.map(task =>
          task.id === editingTask.id
            ? {
                ...task,
                title: editTask.title,
                description: editTask.description || undefined,
                assignee: editTask.assignee || undefined,
                priority: editTask.priority,
                timeline: changes.length > 0
                  ? {
                      ...task.timeline,
                      [`edit-${Date.now()}`]: {
                        timestamp: new Date().toISOString(),
                        message: `작업이 수정되었습니다: ${changes.join(', ')}`,
                        status: 'edited'
                      }
                    }
                  : task.timeline
              }
            : task
        );
        return { ...column, tasks: sortTasks(updatedTasks) };
      }
      return column;
    }));

    setEditingTask(null);
    setEditTask({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '' });
    if (isDetailModalOpen) {
      closeDetailModal();
    }
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setEditTask({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '' });
  };

  const deleteTask = (taskId: string, columnId: string) => {
    if (window.confirm('정말로 이 작업을 삭제하시겠습니까?')) {
      setColumns(prev => prev.map(column => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== taskId)
          };
        }
        return column;
      }));
      closeDetailModal();
    }
  };

  const openDetailModal = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedTask(null);
    setIsDetailModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask: Task, oldColumnId: string, newColumnId: string) => {
    // 완료 상태로 업데이트되는 경우 축하 애니메이션 트리거
    const oldColumn = columns.find(col => col.id === oldColumnId);
    const newColumn = columns.find(col => col.id === newColumnId);
    
    if (oldColumn && newColumn && newColumn.status === 'done' && oldColumn.status !== 'done') {
      setCelebrationTaskTitle(updatedTask.title);
      setShowCelebration(true);
    }

    setColumns(prev => prev.map(column => {
      if (column.id === oldColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== updatedTask.id)
        };
      }
      if (column.id === newColumnId) {
        const updatedTasks = [...column.tasks, updatedTask];
        return { ...column, tasks: sortTasks(updatedTasks) };
      }
      return column;
    }));
  };
  
  const handleHideAddForm = useCallback(() => {
    setShowAddForm(null);
    setNewTask({ title: '', description: '', assignee: '', priority: 'medium' as const, dueDate: '' });
  }, []);

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setCelebrationTaskTitle('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 transition-colors">
      {/* 모바일 헤더 */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">칸반 보드</h1>
          <button
            onClick={toggleWorkMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
              workMode === 'personal'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {workMode === 'personal' ? <User size={16} /> : <Briefcase size={16} />}
            {workMode === 'personal' ? '개인' : '업무'}
          </button>
        </div>
        <div className="flex justify-around text-center">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <div className={`w-8 h-8 rounded-full ${column.color} flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300 mx-auto mb-1`}>
                {column.tasks.length}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{column.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* 데스크톱 헤더 */}
          <header className="mb-6 lg:mb-8 hidden lg:block">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">프로젝트 칸반 보드</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base transition-colors">드래그 앤 드롭으로 작업을 관리하세요</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">현재 모드</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 transition-colors">
                    {workMode === 'personal' ? '개인용' : '업무용'}
                  </p>
                </div>
                <button
                  onClick={toggleWorkMode}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    workMode === 'personal'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {workMode === 'personal' ? <User size={18} /> : <Briefcase size={18} />}
                  {workMode === 'personal' ? '개인용' : '업무용'}
                </button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                columns={columns}
                workMode={workMode}
                draggedOver={draggedOver}
                draggedTask={draggedTask}
                showAddForm={showAddForm}
                editingTask={editingTask}
                newTask={newTask}
                editTask={editTask}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onAddTask={addTask}
                onEditTask={startEditTask}
                onSaveEditTask={saveEditTask}
                onCancelEditTask={cancelEditTask}
                onDeleteTask={deleteTask}
                onShowAddForm={setShowAddForm}
                onHideAddForm={handleHideAddForm}
                onNewTaskChange={(data) => setNewTask(prev => ({ ...prev, ...data }))}
                onEditTaskChange={(data) => setEditTask(prev => ({ ...prev, ...data }))}
                onViewTaskDetail={openDetailModal}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* 상세 보기 모달 */}
      {isDetailModalOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          columns={columns}
          onClose={closeDetailModal}
          onDelete={deleteTask}
          onUpdate={handleTaskUpdate}
        />
      )}

      {/* 축하 애니메이션 */}
      <CelebrationAnimation
        isVisible={showCelebration}
        taskTitle={celebrationTaskTitle}
        onAnimationComplete={handleCelebrationComplete}
      />
    </div>
  );
};

export default KanbanBoard;