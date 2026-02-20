"use client";

import { TBirthdayEvent } from "@/utils/types";
import { useEffect, useState } from "react";

export default function BirthdayAdminPage() {
  const [events, setEvents] = useState<TBirthdayEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TBirthdayEvent | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/birthdays/pending-approval")
      .then((r) => r.json())
      .then(setEvents);
  }, []);

  async function handleApprove() {
    await fetch("/api/birthdays/approve", {
      method: "POST",
      body: JSON.stringify({
        eventId: selectedEvent?.id,
      }),
    });

    setSelectedEvent(null);
  }
  const previewCard = (event: TBirthdayEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div>
      <h1>Birthday Approvals</h1>

      {events.map((event) => (
        <div key={event.id}>
          {event.employee.name}
          <button onClick={() => previewCard(event)}>Preview</button>
        </div>
      ))}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40">
          <div className="bg-white p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: selectedEvent?.htmlContent || "",
              }}
            />

            <button onClick={handleApprove}>Approve</button>
            <button onClick={() => setSelectedEvent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
