import { useState, type FormEvent } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);

    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'newsletter',
          email: email.trim(),
          name: email.trim().split('@')[0],
          message: 'Newsletter subscription from website footer',
        }),
      });
    } catch {
      // Gracefully continue to display thank you state
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <p className="font-display text-lg text-cream">
        Thank you. You’re on the list for S I A Luxe market insights.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center border-b border-cream/30 pb-2">
      <input
        type="email"
        required
        disabled={sending}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        disabled={sending}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-gold-soft transition-colors hover:text-cream disabled:opacity-50"
      >
        {sending ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
      </button>
    </form>
  );
}
