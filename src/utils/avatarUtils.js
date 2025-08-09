export const getProfileInitial = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export const getProfileColor = (name) => {
  if (!name) return 'bg-gray-500';
  
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-violet-500'
  ];
  
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

export const getDefaultAvatarProps = (name, size = 'md') => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg'
  };
  
  return {
    initial: getProfileInitial(name),
    colorClass: getProfileColor(name),
    sizeClass: sizeClasses[size] || sizeClasses.md
  };
};

export const generateAvatarDataUrl = (name, size = 40) => {
  const initial = getProfileInitial(name);
  const colors = {
    'bg-blue-500': '#3B82F6',
    'bg-green-500': '#10B981',
    'bg-purple-500': '#8B5CF6',
    'bg-pink-500': '#EC4899',
    'bg-indigo-500': '#6366F1',
    'bg-yellow-500': '#F59E0B',
    'bg-red-500': '#EF4444',
    'bg-teal-500': '#14B8A6',
    'bg-orange-500': '#F97316',
    'bg-cyan-500': '#06B6D4',
    'bg-lime-500': '#84CC16',
    'bg-violet-500': '#7C3AED'
  };
  
  const colorClass = getProfileColor(name);
  const bgColor = colors[colorClass] || '#6B7280';
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${bgColor}"/>
      <text x="${size/2}" y="${size/2}" text-anchor="middle" dy="0.35em" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="${size/2.5}" font-weight="500">
        ${initial}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const DefaultAvatar = ({ name, size = 'md', className = '' }) => {
  const { initial, colorClass, sizeClass } = getDefaultAvatarProps(name, size);
  
  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-medium ${className}`}>
      {initial}
    </div>
  );
};
