"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AdminNavbar from "../../components/AdminNavbar";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    eventId: string | null;
    locked: boolean;
  }>({ visible: false, x: 0, y: 0, eventId: null, locked: false });
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Handle click outside tooltip to close it if not locked
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        !tooltip.locked
      ) {
        setTooltip((t) => ({ ...t, visible: false, eventId: null }));
      }
    }
    if (tooltip.visible && !tooltip.locked) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltip.visible, tooltip.locked]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "admin") {
      router.replace("/");
      return;
    }
    // Fetch bookings and map to calendar events
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/bookings"); // Use the new admin endpoint
        const data = await res.json();
        // Map bookings to FullCalendar event format
        const mapped = (data.bookings || []).map((b: any) => ({
          id: b.id || b._id,
          title: b.title || b.service?.name || b.userId?.name || "Booking",
          start: b.start || b.date,
          paymentStatus: b.paymentStatus,
        }));
        setEvents(mapped);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [session, status, router]);

  if (
    status === "loading" ||
    loading ||
    !session ||
    (session.user as any).role !== "admin"
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2 sm:px-4 py-10">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-white px-2 sm:px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8 text-center">
          Bookings Calendar
        </h1>
        <div className="w-full max-w-5xl bg-white border border-black  p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height={600}
            events={events}
            eventColor="#000"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            eventDisplay="block"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            eventContent={(arg) => {
              // Custom rendering for completed bookings
              const isCompleted =
                arg.event.extendedProps.paymentStatus === "completed";
              return (
                <div
                  style={{
                    textDecoration: isCompleted ? "line-through" : "none",
                  }}
                >
                  {arg.timeText && <b>{arg.timeText} </b>}
                  {arg.event.title}
                </div>
              );
            }}
            eventMouseEnter={(info) => {
              // Only show if not locked
              if (!tooltip.locked) {
                const { clientX, clientY } = info.jsEvent;
                setTooltip({
                  visible: true,
                  x: clientX + 10,
                  y: clientY + 10,
                  eventId: info.event.id,
                  locked: false,
                });
              }
            }}
            eventMouseLeave={() => {
              // Only hide if not locked
              if (!tooltip.locked) {
                setTooltip((t) => ({ ...t, visible: false, eventId: null }));
              }
            }}
            eventClick={(info) => {
              const { clientX, clientY } = info.jsEvent;
              setTooltip((prev) => {
                // If already open and locked for this event, close it (toggle)
                if (
                  prev.visible &&
                  prev.eventId === info.event.id &&
                  prev.locked
                ) {
                  return {
                    ...prev,
                    visible: false,
                    eventId: null,
                    locked: false,
                  };
                }
                // Otherwise, lock open for this event
                return {
                  visible: true,
                  x: clientX + 10,
                  y: clientY + 10,
                  eventId: info.event.id,
                  locked: true,
                };
              });
            }}
          />
          {/* Tooltip with checkbox */}
          {tooltip.visible &&
            (() => {
              const event = events.find((ev) => ev.id === tooltip.eventId);
              const isCompleted = event && event.paymentStatus === "completed";
              return (
                <div
                  ref={tooltipRef}
                  style={{
                    position: "fixed",
                    top: tooltip.y,
                    left: tooltip.x,
                    background: "#fff",
                    color: "#000",
                    border: "1px solid #cdad8e",
                    borderRadius: 6,
                    padding: "8px 12px",
                    zIndex: 1000,
                    pointerEvents: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    fontSize: 14,
                    minWidth: 180,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {isCompleted ? (
                    <span style={{ color: "#4caf50", fontWeight: 600 }}>
                      Completed
                    </span>
                  ) : (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        onClick={() => {
                          setTooltip((t) => ({
                            ...t,
                            visible: false,
                            eventId: null,
                            locked: false,
                          }));
                          setSelectedEventId(tooltip.eventId);
                          setModalOpen(true);
                        }}
                        style={{ accentColor: "#cdad8e" }}
                      />
                      Mark as completed
                    </label>
                  )}
                </div>
              );
            })()}
          {/* Confirmation Modal */}
          <ConfirmationModal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setTooltip((t) => ({
                ...t,
                visible: false,
                eventId: null,
                locked: false,
              }));
            }}
            onConfirm={async () => {
              if (!selectedEventId) return;
              try {
                const res = await fetch("/api/admin/bookings/complete", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ bookingId: selectedEventId }),
                });
                const data = await res.json();
                if (data.success) {
                  setEvents((prev) =>
                    prev.map((ev) =>
                      ev.id === selectedEventId
                        ? { ...ev, paymentStatus: "completed" }
                        : ev
                    )
                  );
                }
              } catch (e) {
                // Optionally show error toast
              }
              setModalOpen(false);
              setTooltip((t) => ({
                ...t,
                visible: false,
                eventId: null,
                locked: false,
              }));
            }}
            message="Are you sure you want to mark this booking as completed?"
            confirmText="Yes, Mark"
          />
        </div>
      </div>
    </>
  );
}
