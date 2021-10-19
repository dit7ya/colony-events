import { useEffect, useState } from "react";
import { getAllFormattedEvents } from "./events";
import { EventList } from "./components/EventList";

import * as styles from "./styles.module.css";
import { EventProp } from "./components/EventItem";

export function App() {
  const [events, setEvent] = useState<EventProp[]>();

  useEffect(() => {
    getAllFormattedEvents().then((data) => {
      setEvent(data);
    });
  }, []);

  return events ? (
    <EventList events={events} />
  ) : (
    <div className={styles.loading}>
      <p>Loading events - it might take upto 30 seconds... </p>
    </div>
  );
  /* return events && <EventList events={events} />; */
  /* return events; */
}
