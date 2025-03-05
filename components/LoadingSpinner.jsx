const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="animate-spin rounded-full h-40 w-40 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default LoadingSpinner;