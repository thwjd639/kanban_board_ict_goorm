import type { Task, TaskStatus, Column, MonthlyStats } from '../types/types';

export const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 타임라인을 기록하는 새로운 함수로 교체
export const updateTaskTimeline = (
  task: Task, 
  fromStatus: TaskStatus, 
  toStatus: TaskStatus
): Task => {
  const now = new Date().toISOString();
  let message = '';
  
  // 상태 변경 메시지 정의
  const statusMap: { [key in TaskStatus]: string } = {
    'todo': '할 일',
    'in-progress': '진행 중',
    'stop': '보류',
    'done': '완료'
  };
  
  message = `${statusMap[fromStatus]}에서 ${statusMap[toStatus]}로 작업이 이동되었습니다.`;

  return {
    ...task,
    timeline: {
      ...task.timeline,
      [`move-${Date.now()}`]: {
        timestamp: now,
        message: message,
        status: 'moved',
        fromStatus: fromStatus,
        toStatus: toStatus
      }
    }
  };
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-orange-500';
    case 'low':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return '높음';
    case 'medium':
      return '보통';
    case 'low':
      return '낮음';
    default:
      return '보통';
  }
};

export const generateDashboardStats = (columns: Column[]) => {
  const todoTasks = columns.find(col => col.status === 'todo')?.tasks || [];
  const inProgressTasks = columns.find(col => col.status === 'in-progress')?.tasks || [];
  const stopTasks = columns.find(col => col.status === 'stop')?.tasks || [];
  const doneTasks = columns.find(col => col.status === 'done')?.tasks || [];
  const allTasks = [...todoTasks, ...inProgressTasks, ...stopTasks, ...doneTasks];

  const delayedTasks = inProgressTasks.filter(task => {
    const startedAtEntry = Object.values(task.timeline).find(entry => entry.fromStatus === 'todo' && entry.toStatus === 'in-progress');
    if (!startedAtEntry) return false;
    const startedAt = new Date(startedAtEntry.timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  });

  const recentTasks = allTasks.filter(task => {
    const now = new Date();
    const taskDate = new Date(task.createdAt);
    const diffTime = Math.abs(now.getTime() - taskDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  
  const assigneeStats = allTasks.reduce((acc, task) => {
    const assignee = task.assignee || '미지정';
    acc[assignee] = (acc[assignee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyStats = allTasks.reduce((acc, task) => {
    const monthKey = new Date(task.createdAt).toISOString().substring(0, 7);
    if (!acc[monthKey]) {
      acc[monthKey] = { completed: 0, total: 0, completionRate: 0 };
    }
    acc[monthKey].total++;
    const isCompleted = Object.values(task.timeline).some(entry => entry.toStatus === 'done');
    if (isCompleted) {
      acc[monthKey].completed++;
    }
    acc[monthKey].completionRate = (acc[monthKey].completed / acc[monthKey].total) * 100;
    return acc;
  }, {} as MonthlyStats);

  return {
    total: allTasks.length,
    todo: todoTasks.length,
    inProgress: inProgressTasks.length,
    stop: stopTasks.length,
    completed: doneTasks.length,
    delayed: delayedTasks.length,
    completionRate: allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0,
    recent: recentTasks.length,
    assigneeStats,
    monthlyStats
  };
};

export const getRecentTasks = (columns: Column[], limit: number): Task[] => {
  const allTasks = columns.flatMap(col => col.tasks);
  allTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return allTasks.slice(0, limit);
};