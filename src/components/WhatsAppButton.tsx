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
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <MessageCircle size={24} fill="white" className="text-[#25D366]" />
    </a>
  );
}
