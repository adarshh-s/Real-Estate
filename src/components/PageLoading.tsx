// Shown for the brief window while a Sanity-only document (not part of the
// bundled demo data) is being fetched, so the page reserves real height
// instead of collapsing to nothing — without this, the footer visibly jumps
// up under the navbar and then back down once the content pops in.
export function PageLoading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center pt-28">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-gold" />
    </div>
  );
}
