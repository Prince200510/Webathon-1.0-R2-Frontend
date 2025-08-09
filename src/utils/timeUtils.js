export const getTimeAgo = (date) => {
  if (!date) return 'Never';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return diffInSeconds <= 5 ? 'Active now' : `${diffInSeconds}s ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
};

export const getActivityStatus = (lastActivity) => {
  if (!lastActivity) return { status: 'offline', color: 'gray' };
  
  const now = new Date();
  const past = new Date(lastActivity);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));
  
  if (diffInMinutes <= 5) {
    return { status: 'online', color: 'green' };
  } else if (diffInMinutes <= 30) {
    return { status: 'away', color: 'yellow' };
  } else {
    return { status: 'offline', color: 'gray' };
  }
};

export default { getTimeAgo, getActivityStatus };
