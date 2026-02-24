"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { DataTable } from "@/components/data-table";
import {
  BirthdayStatus,
  BirthdayStatusLabels,
  TBirthdayEvent,
} from "@/utils/types";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

export default function BirthdayAdminPage() {
  const [events, setEvents] = useState<TBirthdayEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TBirthdayEvent | null>(
    null,
  );
  const previewCard = (event: TBirthdayEvent) => {
    setSelectedEvent(event);
  };
  console.log("events", events);
  const pendingApprovalColumns: ColumnDef<TBirthdayEvent>[] = [
    { accessorKey: "employee.name", header: "Employee" },
    {
      id: "dateOfBirth",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.dateOfBirth);
        return <p>{date.toLocaleDateString()}</p>;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => BirthdayStatusLabels[row.original.status],
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <button onClick={() => previewCard(row.original)}>View</button>
      ),
    },
  ];
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

  return (
    <div>
      <Header
        title="Birthday Approvals"
        subtitle="Review and approve pending birthday cards"
      />
      <div className="flex flex-col gap-4 h-[calc(100vh-11rem)] overflow-y-auto container mx-auto px-4 py-6">
        <div className="flex gap-4">
          <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
            <p className="text-m font-bold">Total Birthdays</p>
            <h1 className="text-lg">{events.length} </h1>
          </div>
          <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
            <p className="text-m font-bold">Pending Approvals</p>
            <h1 className="text-lg">{events.length} </h1>
          </div>
          <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
            <p className="text-m font-bold">Upcoming</p>
            <h1 className="text-lg">{events.length} </h1>
          </div>
          <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
            <p className="text-m font-bold">Completed</p>
            <h1 className="text-lg">{events.length} </h1>
          </div>
          <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
            <p className="text-m font-bold">Failed</p>
            <h1 className="text-lg">{events.length} </h1>
          </div>
        </div>
        <div className="mt-4">
          {events.length === 0 ? (
            <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
              <p className="text-m font-bold">No pending approvals</p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <p className=" text-m font-bold">Pending Events</p>
              <DataTable columns={pendingApprovalColumns} data={events} />
            </div>
          )}
        </div>
        <div className="flex w-full gap-4 mt-4">
          <div className="flex w-full">
            {events.length === 0 ? (
              <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
                <p className="text-m font-bold">
                  No upcoming events for the current month
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <p className=" text-m font-bold">Upcoming Events</p>
                <DataTable columns={pendingApprovalColumns} data={events} />
              </div>
            )}
          </div>
          <div className="flex w-full">
            {events.length === 0 ? (
              <div className="flex w-full flex-col items-center gap-4 mb-4 rounded bg-[#27292b] p-4 border border-gray-800">
                <p className="text-m font-bold">
                  No events completed in this month
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <p className=" text-m font-bold">Completed Events</p>
                <DataTable columns={pendingApprovalColumns} data={events} />
              </div>
            )}
          </div>
        </div>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-md rounded-lg bg-[#27292b] p-6 shadow-xl">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedEvent?.htmlContent || "",
                }}
              />
              <div className="mt-4 flex justify-end gap-4">
                <button
                  className="cursor-pointer bg-gray-700 px-4 py-2 rounded border border-gray-500 hover:bg-gray-800"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
                <button
                  className="cursor-pointer bg-gray-700 px-4 py-2 rounded border border-gray-500 hover:bg-gray-800"
                  onClick={handleApprove}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <Footer /> */}
    </div>
  );
}
