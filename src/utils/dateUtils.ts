export const formatDate = (date: any): string => {
  // Date 객체로 변환
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'object' && date) {
    // 객체인 경우 여러 가지 시도
    if (date.toISOString) {
      dateObj = new Date(date);
    } else if (date.seconds || date._seconds) {
      const seconds = date.seconds || date._seconds;
      const nanoseconds = date.nanoseconds || date._nanoseconds || 0;
      dateObj = new Date(seconds * 1000 + nanoseconds / 1000000);
    } else if (date.$date) {
      dateObj = new Date(date.$date);
    } else if (typeof date.toString === 'function') {
      dateObj = new Date(date.toString());
    } else {
      return '유효하지 않은 날짜';
    }
  } else {
    return '유효하지 않은 날짜';
  }
  
  // 유효한 날짜인지 확인
  if (isNaN(dateObj.getTime())) {
    return '유효하지 않은 날짜';
  }
  
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDueDateStatus = (dueDate: any): 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'normal' => {
  // null, undefined 체크
  if (!dueDate) {
    return 'normal';
  }
  
  // Date 객체로 변환
  let dateObj: Date;
  if (typeof dueDate === 'string') {
    dateObj = new Date(dueDate);
  } else if (dueDate instanceof Date) {
    dateObj = dueDate;
  } else if (typeof dueDate === 'object') {
    // 객체인 경우 여러 가지 시도
    if (dueDate.toISOString) {
      // Date처럼 보이는 객체
      dateObj = new Date(dueDate);
    } else if (dueDate.seconds || dueDate._seconds) {
      // Firestore Timestamp 형태
      const seconds = dueDate.seconds || dueDate._seconds;
      const nanoseconds = dueDate.nanoseconds || dueDate._nanoseconds || 0;
      dateObj = new Date(seconds * 1000 + nanoseconds / 1000000);
    } else if (dueDate.$date) {
      // MongoDB 날짜 형태
      dateObj = new Date(dueDate.$date);
    } else if (typeof dueDate.toString === 'function') {
      // toString 메서드가 있는 객체
      dateObj = new Date(dueDate.toString());
    } else {
      console.log('Unknown object format for date:', dueDate);
      return 'normal';
    }
  } else {
    return 'normal';
  }
  
  // 유효한 날짜인지 확인
  if (isNaN(dateObj.getTime())) {
    console.log('Invalid date object');
    return 'normal';
  }
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // 날짜 비교를 위해 시간을 00:00:00으로 설정
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const dueDateStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
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