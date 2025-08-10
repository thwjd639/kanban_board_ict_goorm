export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDueDateStatus = (dueDate: Date): 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'normal' => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // 날짜 비교를 위해 시간을 00:00:00으로 설정
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const dueDateStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const threeDaysLater = new Date(todayStart);
  threeDaysLater.setDate(todayStart.getDate() + 3);

  if (dueDateStart < todayStart) {
    return 'overdue';
  } else if (dueDateStart.getTime() === todayStart.getTime()) {
    return 'today';
  } else if (dueDateStart.getTime() === tomorrowStart.getTime()) {
    return 'tomorrow';
  } else if (dueDateStart <= threeDaysLater) {
    return 'upcoming';
  }
  return 'normal';
};

export const getDueDateColor = (status: string): string => {
  switch (status) {
    case 'overdue':
      return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
    case 'today':
      return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800';
    case 'tomorrow':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'upcoming':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600';
  }
};

export const getDueDateText = (status: string): string => {
  switch (status) {
    case 'overdue':
      return '지연됨';
    case 'today':
      return '오늘 마감';
    case 'tomorrow':
      return '내일 마감';
    case 'upcoming':
      return '곧 마감';
    default:
      return '';
  }
};