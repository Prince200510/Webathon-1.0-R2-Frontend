import { useEffect } from 'react';
import { adminApi } from '../utils/adminApi';

export const useAdminActivityTracker = () => {
  useEffect(() => {
    const trackActivity = async () => {
      try {
        await adminApi.post('/admin/track-activity');
      } catch (error) {
        console.log('Activity tracking failed:', error);
      }
    };

    trackActivity();
    const handleUserActivity = () => {
      trackActivity();
    };
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    let activityTimeout;
    const throttledActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(handleUserActivity, 30000); 
    };

    events.forEach(event => {
      document.addEventListener(event, throttledActivity, true);
    });

    const activityInterval = setInterval(trackActivity, 120000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledActivity, true);
      });
      clearInterval(activityInterval);
      clearTimeout(activityTimeout);
    };
  }, []);
};

export default useAdminActivityTracker;
