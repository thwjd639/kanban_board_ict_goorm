import React from 'react';
import { Clock, User, Edit, ArrowRight, CheckCircle } from 'lucide-react';
import type { TaskTimeline } from '../types/types';

interface ActivityLogProps {
  timeline: TaskTimeline;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ timeline }) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'created':
        return <User size={16} className="text-blue-500" />;
      case 'edited':
        return <Edit size={16} className="text-yellow-500" />;
      case 'moved':
        return <ArrowRight size={16} className="text-green-500" />;
      case 'done':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const sortedTimeline = Object.keys(timeline).sort((a, b) => {
    const timestampA = new Date(timeline[a].timestamp).getTime();
    const timestampB = new Date(timeline[b].timestamp).getTime();
    return timestampA - timestampB;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
        작업 기록
      </h3>
      <div className="relative pl-6">
        <div className="absolute top-0 left-2 w-0.5 h-full bg-gray-200 dark:bg-gray-600"></div>
        
        <ul className="space-y-4">
          {sortedTimeline.length > 0 ? (
            sortedTimeline.map((key, index) => {
              const log = timeline[key];
              const date = new Date(log.timestamp);
              const formattedDate = date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <li key={index} className="relative flex items-start gap-3">
                  <div className="absolute -left-1.5 top-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center z-10 border-2 border-gray-200 dark:border-gray-600">
                    {getIcon(log.status)}
                  </div>
                  <div className="pl-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{log.message}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">아직 기록이 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ActivityLog;