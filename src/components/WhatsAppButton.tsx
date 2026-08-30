import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/971505550100?text=Hello%20Providence%20Estates%2C%20I%27d%20like%20to%20speak%20to%20a%20consultant."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <MessageCircle size={24} fill="white" className="text-[#25D366]" />
    </a>
  );
}
