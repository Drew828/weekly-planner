import { useState } from "react";
import type { OneOffEvent, RecurringEvent } from "../../types";
import { Modal } from "../ui/Modal";
import { RecurringEventForm } from "./RecurringEventForm";
import { OneOffEventForm } from "./OneOffEventForm";
import { useStore } from "../../store/useStore";

interface EventFormProps {
  defaultDate?: string;
  onClose: () => void;
}

type EventType = "recurring" | "oneoff";

export function EventForm({ defaultDate, onClose }: EventFormProps) {
  const [type, setType] = useState<EventType>("recurring");
  const addRecurringEvent = useStore((s) => s.addRecurringEvent);
  const addOneOffEvent = useStore((s) => s.addOneOffEvent);

  function handleSaveRecurring(e: RecurringEvent) {
    addRecurringEvent(e);
    onClose();
  }

  function handleSaveOneOff(e: OneOffEvent) {
    addOneOffEvent(e);
    onClose();
  }

  return (
    <Modal title="Add Event" onClose={onClose}>
      <div className="flex rounded-lg bg-slate-100 p-1 mb-4">
        <button
          type="button"
          onClick={() => setType("recurring")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            type === "recurring" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Recurring
        </button>
        <button
          type="button"
          onClick={() => setType("oneoff")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            type === "oneoff" ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          One-time
        </button>
      </div>

      {type === "recurring" ? (
        <RecurringEventForm onSave={handleSaveRecurring} onCancel={onClose} />
      ) : (
        <OneOffEventForm defaultDate={defaultDate} onSave={handleSaveOneOff} onCancel={onClose} />
      )}
    </Modal>
  );
}
