import { Star } from 'lucide-react';
export default function Rating({ value = 0, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14}
          className={n <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
      {count != null && <span className="text-xs text-gray-600 ml-1">({count})</span>}
    </div>
  );
}
