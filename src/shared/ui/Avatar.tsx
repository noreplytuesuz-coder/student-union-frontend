import { getImageUrl } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  image?: string;
  /** Full circle className (size + border + shadow) — the element fills it. */
  className?: string;
  /** Applied only to the initials fallback. */
  fallbackClassName?: string;
}

/**
 * User avatar with a graceful fallback: shows the uploaded photo when a
 * user `image` is present, otherwise renders initials over a gradient.
 * `className` carries the circle sizing/border (e.g. `h-9 w-9 rounded-full
 * neo-border`), and the inner content fills 100%.
 */
export function Avatar({ name, image, className, fallbackClassName }: AvatarProps) {
  const resolved = image ? getImageUrl(image) : '';
  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-full text-white',
        resolved ? 'bg-gray-100 dark:bg-white/5' : 'bg-gradient-hero',
        className,
      )}
    >
      {resolved ? (
        <img src={resolved} alt={name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className={cn('font-display font-bold', fallbackClassName)}>{getInitials(name)}</span>
      )}
    </div>
  );
}
