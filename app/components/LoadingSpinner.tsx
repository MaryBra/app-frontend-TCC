export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-10 h-10">
        
        <div className="absolute inset-0 rounded-full border-3 border-gray-300 opacity-40"></div>

        <div
          className="absolute inset-0 rounded-full border-3 border-t-[#8B0000] border-r-transparent border-b-transparent border-l-transparent animate-spin"
          style={{ animationDuration: "0.8s" }}
        ></div>
      </div>
    </div>
  );
}
