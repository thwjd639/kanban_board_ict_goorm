export type WorkMode = 'personal' | 'business';
export type TaskStatus = 'todo' | 'in-progress' | 'stop' | 'done';

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  status: TaskStatus;
}

// 새로운 타임라인 관련 인터페이스 추가
export interface TimelineEvent {
  timestamp: string;
  message: string;
  status: string; // 'created', 'edited', 'moved' 등
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
}

export interface TaskTimeline {
  [key: string]: TimelineEvent;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  timeline: TaskTimeline; // 새로 추가
  workMode: WorkMode;
}

export interface MonthlyStats {
  [key: string]: {
    completed: number;
    total: number;
    completionRate: number;
  };
}