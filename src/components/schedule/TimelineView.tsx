import type { ScheduledSlot } from "../../types";
import { TimelineSlot } from "./TimelineSlot";

interface TimelineViewProps {
  slots: ScheduledSlot[];
  date: string;
  onEditEvent?: (slot: ScheduledSlot) => void;
  onDeleteEvent?: (slot: ScheduledSlot) => void;
}

export function TimelineView({ slots, date, onEditEvent, onDeleteEvent }: TimelineViewProps) {
  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <span className="text-5xl mb-4">✨</span>
        <p className="text-lg font-medium">No events yet</p>
        <p className="text-sm mt-1">Add recurring events or goals to fill your day</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {slots.map((slot) => (
        <TimelineSlot
          key={slot.id}
          slot={slot}
          date={date}
          onEdit={onEditEvent ? () => onEditEvent(slot) : undefined}
          onDelete={onDeleteEvent ? () => onDeleteEvent(slot) : undefined}
        />
      ))}
    </div>
  );
}
