const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-background dark:bg-dark-background">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      <p className="mt-4 text-light-text dark:text-dark-text font-medium">{message}</p>
    </div>
  )
}

export default LoadingSpinner
