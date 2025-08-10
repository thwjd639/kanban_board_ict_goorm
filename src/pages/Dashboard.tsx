import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateDashboardStats, getRecentTasks } from '../utils/taskUtils';
import type { Column, Task } from '../types/types';
import { Briefcase, User, Clock, TrendingUp, AlertCircle, Edit } from 'lucide-react';
import TaskCard from '../components/TaskCard';

const Dashboard: React.FC = () => {
  // 기본 컬럼 설정 (칸반보드와 동일)
  const defaultColumns: Column[] = [
    {
      id: '1',
      title: '할 일',
      tasks: [],
      color: 'bg-blue-100 dark:bg-blue-900/30',
      status: 'todo'
    },
    {
      id: '2',
      title: '진행 중',
      tasks: [],
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
      status: 'in-progress'
    },
    {
      id: '3',
      title: '보류',
      tasks: [],
      color: 'bg-orange-100 dark:bg-orange-900/30',
      status: 'stop'
    },
    {
      id: '4',
      title: '완료',
      tasks: [],
      color: 'bg-green-100 dark:bg-green-900/30',
      status: 'done'
    }
  ];

  const [columns, setColumns] = useLocalStorage('kanban-columns', defaultColumns);
  
  // 편집 관련 상태
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState({ 
    title: '', 
    description: '', 
    assignee: '', 
    priority: 'medium' as const 
  });
  
  // 대시보드 통계 생성
  const stats = generateDashboardStats(columns);
  const recentTasks = getRecentTasks(columns, 5);

  const getStatusBadge = (statusType: string) => {
    switch (statusType) {
      case 'done':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in-progress':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'stop':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'todo':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getProgressPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  // 작업 모드별 통계
  const personalTasks = columns.flatMap(col => col.tasks).filter(task => task.workMode === 'personal');
  const businessTasks = columns.flatMap(col => col.tasks).filter(task => task.workMode === 'business');
  const personalCompleted = personalTasks.filter(task => columns.find(col => col.id === '4')?.tasks.some(t => t.id === task.id)).length;
  const businessCompleted = businessTasks.filter(task => columns.find(col => col.id === '4')?.tasks.some(t => t.id === task.id)).length;

  // 작업 수정 시작
  const startEditTask = (task: any) => {
    // task에서 원본 Task 객체를 찾기
    const originalTask = columns.flatMap(col => col.tasks).find(t => t.id === task.id);
    if (!originalTask) return;
    
    setEditingTask(originalTask);
    setEditTask({
      title: originalTask.title,
      description: originalTask.description || '',
      assignee: originalTask.assignee || '',
      priority: originalTask.priority
    });
  };

  // 작업 수정 저장
  const saveEditTask = () => {
    if (!editingTask || !editTask.title.trim()) return;

    setColumns(prev => prev.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === editingTask.id 
          ? {
              ...task,
              title: editTask.title,
              description: editTask.description || undefined,
              assignee: editTask.assignee || undefined,
              priority: editTask.priority
            }
          : task
      )
    })));

    setEditingTask(null);
    setEditTask({ title: '', description: '', assignee: '', priority: 'medium' });
  };

  // 작업 수정 취소
  const cancelEditTask = () => {
    setEditingTask(null);
    setEditTask({ title: '', description: '', assignee: '', priority: 'medium' });
  };

  const StatCard = ({ icon, title, value, color, bgColor }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    color: string;
    bgColor: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4`}>
          {icon || value}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 transition-colors">{value}개</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 transition-colors">
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">
              프로젝트 대시보드
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">
              프로젝트 현황을 한눈에 확인하세요
            </p>
          </header>

          {/* 통계 카드 - 반응형 그리드 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <StatCard
              icon={stats.total}
              title="전체 작업"
              value={stats.total}
              color="text-blue-600"
              bgColor="bg-blue-500"
            />
            <StatCard
              icon={stats.inProgress}
              title="진행 중"
              value={stats.inProgress}
              color="text-yellow-600"
              bgColor="bg-yellow-500"
            />
            <StatCard
              icon={stats.completed}
              title="완료"
              value={stats.completed}
              color="text-green-600"
              bgColor="bg-green-500"
            />
            <StatCard
              icon={stats.stop}
              title="보류"
              value={stats.stop}
              color="text-red-600"
              bgColor="bg-red-500"
            />
          </div>

          {/* 작업 모드별 통계 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
              <div className="flex items-center mb-4">
                <User className="text-blue-500 mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">개인 작업</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors">전체:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors">{personalTasks.length}개</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors">완료:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{personalCompleted}개</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${personalTasks.length > 0 ? (personalCompleted / personalTasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
              <div className="flex items-center mb-4">
                <Briefcase className="text-orange-500 mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">업무 작업</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors">전체:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors">{businessTasks.length}개</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors">완료:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{businessCompleted}개</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${businessTasks.length > 0 ? (businessCompleted / businessTasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 최근 작업 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
            <div className="flex items-center mb-4">
              <Clock className="text-blue-500 mr-2" size={20} />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">최근 작업</h2>
            </div>
            {recentTasks.length > 0 ? (
              // 이 부분이 수정되었습니다.
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {recentTasks.map((task) => {
                  const columnId = columns.find(col => col.tasks.some(t => t.id === task.id))?.id || '';
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      columnId={columnId}
                      columns={columns}
                      onEdit={() => {}} // 대시보드에서는 편집 비활성
                      onDelete={() => {}} // 대시보드에서는 삭제 비활성
                      compact
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors">
                최근 작업이 없습니다.
              </div>
            )}
          </div>

          {/* 작업 통계 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mt-6 sm:mt-8 transition-colors">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-green-500 mr-2" size={20} />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">작업 통계</h2>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors mr-2">완료율:</span>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <span className="flex items-center text-gray-600 dark:text-gray-400 transition-colors"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> 할 일: {stats.todo}개</span>
              <span className="flex items-center text-gray-600 dark:text-gray-400 transition-colors"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span> 진행 중: {stats.inProgress}개</span>
              <span className="flex items-center text-gray-600 dark:text-gray-400 transition-colors"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> 보류: {stats.stop}개</span>
              <span className="flex items-center text-gray-600 dark:text-gray-400 transition-colors"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> 완료: {stats.completed}개</span>
            </div>
          </div>

          {/* 지연된 작업 및 수정 내역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">지연된 작업</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {stats.delayed > 0 ? (
                  <>
                    <li>지연된 작업이 {stats.delayed}개 있습니다.</li>
                    <li>지연된 작업을 확인하고 조치를 취하세요.</li>
                  </>
                ) : (
                  <li>지연된 작업이 없습니다.</li>
                )}
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
              <div className="flex items-center mb-4">
                <Edit className="text-purple-500 mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">최근 수정</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>최근에 수정된 작업 내역이 여기에 표시됩니다.</li>
                <li>...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;