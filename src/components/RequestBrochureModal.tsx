import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageCircle, FileText, Check, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { Badge } from './Badge';

interface RequestBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  developer?: string;
  community?: string;
  priceFromAED?: number;
  brochureUrl?: string; // If an actual official brochure file/url is uploaded in Sanity
}

export function RequestBrochureModal({
  isOpen,
  onClose,
  projectName,
  developer,
  community,
  brochureUrl,
}: RequestBrochureModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState("I'm a Potential Buyer");
  const [deliveryMethod, setDeliveryMethod] = useState<'both' | 'whatsapp' | 'email'>('both');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to request the official brochure and floor plans for ${projectName}${developer ? ` by ${developer}` : ''}${community ? ` in ${community}` : ''}. (${userRole})`
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const deliveryLabel =
        deliveryMethod === 'both'
          ? 'Email & WhatsApp'
          : deliveryMethod === 'whatsapp'
          ? 'WhatsApp PDF'
          : 'Email PDF';

      const composedMessage = [
        `Client Role: ${userRole}`,
        notes.trim() ? `Client Message: ${notes.trim()}` : null,
        `Preferred Delivery Method: ${deliveryLabel}`,
      ]
        .filter(Boolean)
        .join('\n');

      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'brochure',
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          userRole,
          projectName,
          developer,
          community,
          message: composedMessage,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send request');
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage(
        'Unable to complete request right now. You can also connect with our advisory desk directly via WhatsApp below.'
      );
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-ink/10 bg-cream p-6 shadow-2xl sm:p-8"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:bg-ink hover:text-cream"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {status === 'success' ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Check size={28} />
                </div>
                <Badge tone="gold" className="mt-4">
                  Request Received
                </Badge>
                <h3 className="mt-3 font-display text-2xl text-ink">Brochure Request Sent</h3>
                <p className="mt-2 text-sm text-ink/70">
                  Thank you, <span className="font-semibold text-ink">{name}</span>. Our private developments desk
                  has received your request for <span className="font-semibold text-ink">{projectName}</span>.
                </p>
                <p className="mt-2 text-xs text-ink/50">
                  The official brochure, floor plans and unit availability will be sent to{' '}
                  <span className="font-medium text-ink">{email}</span> and via WhatsApp to{' '}
                  <span className="font-medium text-ink">{phone}</span>.
                </p>

                {brochureUrl && (
                  <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/[0.05] p-4 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">Immediate Access</p>
                    <p className="mt-1 text-xs text-ink/70">
                      An official digital brochure file is available for direct view right now:
                    </p>
                    <a
                      href={brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline hover:text-gold"
                    >
                      <FileText size={14} className="text-gold" /> View Official PDF Brochure
                    </a>
                  </div>
                )}

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                  <a
                    href={`https://wa.me/971505550104?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-wider text-cream transition-all hover:bg-cream hover:text-ink"
                  >
                    <MessageCircle size={14} /> Open Priority WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full border border-ink/20 px-6 py-3 text-xs uppercase tracking-wider text-ink transition-colors hover:bg-ink/5"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="pr-8">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <FileText size={16} />
                    </div>
                    <Badge tone="gold">Project Brochure & Floor Plans</Badge>
                  </div>
                  <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">Request Brochure</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink/50">
                    {projectName} {developer ? `· ${developer}` : ''} {community ? `· ${community}` : ''}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink/65">
                    Receive the complete developer package including floor layouts, specification sheet,
                    payment schedule and current unit inventory.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-ink/50">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-ink/50">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-ink/50">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* I am dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-ink">
                      I am <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-ink/15 bg-cream px-3.5 py-2.5 pr-10 text-sm text-ink focus:border-gold focus:outline-none cursor-pointer"
                      >
                        <option value="I'm a Potential Buyer">I'm a Potential Buyer</option>
                        <option value="I'm an Agent">I'm an Agent</option>
                        <option value="I'm a Seller">I'm a Seller</option>
                        <option value="I'm Just Exploring">I'm Just Exploring</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-ink/50">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Delivery preference */}
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-ink/50">
                      Receive Brochure Via
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'both', label: 'Email & WhatsApp' },
                        { id: 'whatsapp', label: 'WhatsApp Only' },
                        { id: 'email', label: 'Email Only' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDeliveryMethod(opt.id as any)}
                          className={`rounded-xl border px-2 py-2 text-center text-xs transition-colors ${
                            deliveryMethod === opt.id
                              ? 'border-gold bg-gold/10 font-medium text-ink'
                              : 'border-ink/10 text-ink/60 hover:border-ink/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Your message (optional) */}
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-ink/50">
                      Your message (optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Your message (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full resize-none rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-xs text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
                      {errorMessage}
                    </p>
                  )}

                  <div className="mt-2 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink bg-ink py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-cream transition-all hover:bg-cream hover:text-ink active:scale-[0.99] disabled:opacity-60"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Submitting Request...
                        </>
                      ) : (
                        <>
                          Request Official Brochure <ArrowRight size={14} />
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3 py-1">
                      <div className="h-px flex-1 bg-ink/10" />
                      <span className="text-[10px] uppercase tracking-wider text-ink/40">or connect directly</span>
                      <div className="h-px flex-1 bg-ink/10" />
                    </div>

                    <a
                      href={`https://wa.me/971505550104?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 py-3 text-xs uppercase tracking-wider text-ink transition-colors hover:border-ink hover:bg-ink/5"
                    >
                      <MessageCircle size={14} className="text-gold" /> Request on WhatsApp
                    </a>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
