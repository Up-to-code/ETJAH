export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="relative w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
