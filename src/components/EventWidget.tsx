import { Calendar, ArrowRight } from "lucide-react";

const EventWidget = () => {
  return (
    <div className="bg-foreground text-primary-foreground p-5 rounded-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} />
        <span className="text-xs font-bold uppercase tracking-widest opacity-70">Upcoming Event</span>
      </div>
      <h4 className="font-headline text-lg font-bold leading-tight">
        International Women's Day 2026
      </h4>
      <p className="text-sm mt-2 opacity-80">
        March 8, 2026 — Global celebrations, marches, and solidarity actions in over 150 countries.
      </p>
      <div className="flex items-center gap-1 mt-4 text-sm font-semibold opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
        <span>Learn more</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
};

export default EventWidget;
