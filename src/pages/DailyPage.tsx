import { useState } from "react";
import { useDailySchedule } from "../hooks/useDailySchedule";
import { TimelineView } from "../components/schedule/TimelineView";
import { EventForm } from "../components/events/EventForm";
import { Button } from "../components/ui/Button";
import { formatDateDisplay, getTodayString, addDays } from "../utils/time";
import type { ScheduledSlot } from "../types";
import { useStore } from "../store/useStore";
import { Modal } from "../components/ui/Modal";
import { RecurringEventForm } from "../components/events/RecurringEventForm";
import { OneOffEventForm } from "../components/events/OneOffEventForm";

interface DailyPageProps {
  initialDate?: string;
}

export function DailyPage({ initialDate }: DailyPageProps) {
  const [date, setDate] = useState(initialDate ?? getTodayString());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduledSlot | null>(null);

  const schedule = useDailySchedule(date);
  const today = getTodayString();

  const deleteRecurringEvent = useStore((s) => s.deleteRecurringEvent);
  const deleteOneOffEvent = useStore((s) => s.deleteOneOffEvent);
  const updateRecurringEvent = useStore((s) => s.updateRecurringEvent);
  const updateOneOffEvent = useStore((s) => s.updateOneOffEvent);
  const recurringEvents = useStore((s) => s.recurringEvents);
  const oneOffEvents = useStore((s) => s.oneOffEvents);

  function handleDeleteSlot(slot: ScheduledSlot) {
    if (slot.kind === "recurring") {
      const re = recurringEvents.find((r) => slot.id.startsWith(`recurring-${r.id}`));
      if (re) deleteRecurringEvent(re.id);
    } else if (slot.kind === "oneoff") {
      const oe = oneOffEvents.find((o) => slot.id === `oneoff-${o.id}`);
      if (oe) deleteOneOffEvent(oe.id);
    }
  }

  function handleEditSlot(slot: ScheduledSlot) {
    setEditingSlot(slot);
  }

  const completedCount = schedule.slots.filter(
    (s) => s.kind === "goal-step" && s.completed
  ).length;
  const goalSlotCount = schedule.slots.filter((s) => s.kind === "goal-step").length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setDate(addDays(date, -1))}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
        >
          ‹
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800">{formatDateDisplay(date)}</h1>
          {date !== today && (
            <button onClick={() => setDate(today)} className="text-xs text-indigo-500 hover:underline cursor-pointer">
              Back to today
            </button>
          )}
        </div>
        <button
          onClick={() => setDate(addDays(date, 1))}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Goal progress */}
      {goalSlotCount > 0 && (
        <div className="mb-4 bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-indigo-700 font-medium">Goal progress</span>
          <span className="text-sm font-bold text-indigo-700">{completedCount}/{goalSlotCount} done</span>
        </div>
      )}

      {/* Timeline */}
      <TimelineView
        slots={schedule.slots}
        date={date}
        onEditEvent={handleEditSlot}
        onDeleteEvent={handleDeleteSlot}
      />

      {/* Add event button */}
      <div className="mt-6 flex justify-center">
        <Button onClick={() => setShowAddEvent(true)}>+ Add Event</Button>
      </div>

      {showAddEvent && (
        <EventForm defaultDate={date} onClose={() => setShowAddEvent(false)} />
      )}

      {/* Edit modal */}
      {editingSlot?.kind === "recurring" && (() => {
        const re = recurringEvents.find((r) => editingSlot.id.startsWith(`recurring-${r.id}`));
        if (!re) return null;
        return (
          <Modal title="Edit Recurring Event" onClose={() => setEditingSlot(null)}>
            <RecurringEventForm
              initial={re}
              onSave={(updated) => { updateRecurringEvent(updated); setEditingSlot(null); }}
              onCancel={() => setEditingSlot(null)}
            />
          </Modal>
        );
      })()}

      {editingSlot?.kind === "oneoff" && (() => {
        const oe = oneOffEvents.find((o) => editingSlot.id === `oneoff-${o.id}`);
        if (!oe) return null;
        return (
          <Modal title="Edit Event" onClose={() => setEditingSlot(null)}>
            <OneOffEventForm
              initial={oe}
              onSave={(updated) => { updateOneOffEvent(updated); setEditingSlot(null); }}
              onCancel={() => setEditingSlot(null)}
            />
          </Modal>
        );
      })()}
    </div>
  );
}
