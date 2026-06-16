export function Skeleton({ className = '' }: { className?: string }): React.JSX.Element {
  return <div className={`animate-pulse rounded-md bg-tinta-200 ${className}`} />;
}

export function SkeletonFilas({ filas = 5 }: { filas?: number }): React.JSX.Element {
  return (
    <div className="space-y-2">
      {Array.from({ length: filas }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
