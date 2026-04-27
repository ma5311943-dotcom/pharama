"use client";
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Pill } from 'lucide-react';

const NOTIFICATIONS = [
  "Someone from New York just ordered Brufen 400mg",
  "A user from London just bought Natural Alchemy Extracts",
  "New order placed for Zero Fillers Supplements",
  "Someone from Toronto just ordered Pure Ibuprofen",
  "A guest from Sydney just purchased Advanced Formula",
  "Just restocked: Premium Multi-Vitamins",
  "Someone from Paris just bought 3x Allergy Relief"
];

export default function LiveNotifications() {
  useEffect(() => {
    // Show a fake notification periodically
    const interval = setInterval(() => {
      const randomNotif = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
      
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-bg-card/90 backdrop-blur-2xl shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-border-nav overflow-hidden relative group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(0,168,232,0.3)]">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-[11px] font-black text-text-heading uppercase tracking-widest flex items-center gap-2">
                  Live Activity <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </p>
                <p className="mt-1 text-[11px] text-text-muted leading-relaxed font-medium">
                  {randomNotif}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-border-nav/50">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-[1.5rem] p-3 flex items-center justify-center text-[10px] font-bold text-text-muted hover:text-primary hover:bg-primary/5 focus:outline-none transition-colors uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 5000, position: 'bottom-left' });
    }, 25000); // Triggers every 25 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
