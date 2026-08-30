import { useState, type FormEvent } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

const OFFICE = { city: 'Dubai HQ', address: 'Gate Village 7, DIFC, Dubai, UAE', phone: '+971 4 555 0100' };

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
        <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Speak With Providence</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/60">
          For enquiries about buying, renting, selling or our private client services, reach our
          Dubai headquarters directly or send us a message below.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-14 lg:grid-cols-2 lg:px-10">
        <div>
          {submitted ? (
            <div className="flex h-full flex-col justify-center rounded-2xl border border-ink/10 p-8 text-center">
              <p className="font-display text-2xl text-gold">Message sent</p>
              <p className="mt-3 text-sm text-ink/60">A member of our team will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-ink/40">Full Name</label>
                  <input required className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-ink/40">Email</label>
                  <input type="email" required className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-ink/40">Subject</label>
                <select
                  defaultValue="General Enquiry"
                  className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
                >
                  <option>General Enquiry</option>
                  <option>Buying</option>
                  <option>Renting</option>
                  <option>Selling</option>
                  <option>Off-Plan Investment</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-ink/40">Message</label>
                <textarea rows={5} required className="w-full rounded-xl border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-full border border-ink bg-ink py-3.5 text-xs uppercase tracking-[0.16em] text-cream transition-all active:scale-[0.98] hover:bg-cream hover:text-ink"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 p-6">
            <h3 className="font-display text-lg text-ink">{OFFICE.city}</h3>
            <p className="mt-3 flex items-start gap-2 text-sm text-ink/60">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gold" /> {OFFICE.address}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-ink/60">
              <Phone size={15} className="shrink-0 text-gold" /> {OFFICE.phone}
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 p-6">
            <h3 className="font-display text-lg text-ink">General Enquiries</h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink/60">
              <Mail size={15} className="shrink-0 text-gold" /> hello@providence.ae
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
