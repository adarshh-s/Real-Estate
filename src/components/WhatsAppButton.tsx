import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSanityContent';

export function WhatsAppButton() {
  const settings = useSiteSettings();
  return (
    <a
      href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20S%20I%20A%20Luxe%20Real%20Estate%2C%20I%27d%20like%20to%20speak%20to%20a%20consultant.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
    >
      <MessageCircle size={22} fill="white" className="text-[#25D366] sm:size-6" />
    </a>
  );
}
