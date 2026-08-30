import { Button } from '../components/Button';

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-16 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl text-ink">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink/50">
        The page you’re looking for may have been moved or no longer exists.
      </p>
      <Button to="/" variant="outline" className="mt-8">
        Return Home
      </Button>
    </div>
  );
}
