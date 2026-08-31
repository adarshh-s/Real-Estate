import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-display text-lg text-cream">
        Thank you — you’re on the list for S I A Luxe market insights.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center border-b border-cream/30 pb-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex h-8 w-8 shrink-0 items-center justify-center text-gold-soft transition-colors hover:text-cream"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
