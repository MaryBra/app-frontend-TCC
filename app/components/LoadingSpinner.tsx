export function LoadingSpinner() {
    return (
        <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-red-700"></div>
        </div>
    );
}