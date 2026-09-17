import { Link } from "react-router-dom";
import { formatDate } from "../../lib/id";
import { useStore } from "../../store/StoreContext";

export function Events() {
  const { state } = useStore();
  const events = [...state.events].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="page">
      <div className="kicker">Calendar</div>
      <h1 style={{ fontSize: 42 }}>Events</h1>
      <p className="muted">Event → athletes on the start list → inventory.</p>
      <div className="grid-2" style={{ marginTop: 18 }}>
        {events.map((ev) => (
          <div className="panel" key={ev.id}>
            <div className="tag">{ev.sport}</div>
            <h3 style={{ marginTop: 8 }}>{ev.name}</h3>
            <p className="muted">{formatDate(ev.date)} · {ev.city}</p>
            <div className="cta-row">
              {ev.athleteIds.map((id) => {
                const a = state.athletes.find((x) => x.userId === id);
                if (!a) return null;
                return <Link key={id} className="btn btn-sm" to={`/brand/athlete/${id}`}>{a.name}</Link>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
