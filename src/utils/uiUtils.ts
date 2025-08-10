export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return '높음';
    case 'medium': return '보통';
    case 'low': return '낮음';
    default: return '보통';
  }
};

export const formatWorkingDays = (days?: number) => {
  if (!days) return null;
  return `${days}일`;
};