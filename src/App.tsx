import { useEffect, useState } from "react";
import { getAllFormattedEvents } from "./events";
import { EventList } from "./components/EventList";

import * as styles from "./styles.module.css";
import { EventProp } from "./components/EventItem";

export function App() {
  const [events, setEvent] = useState<EventProp[]>();
  const [loadingFailed, setLoadingFailed] = useState(false);

  useEffect(() => {
    getAllFormattedEvents()
      .then((data) => {
        setEvent(data);
      })
      .catch(() => setLoadingFailed(true));
  }, []);

  if (loadingFailed) {
    return (
      <div className={styles.loading}>
        <h6>Fetching events colony failed.</h6>
      </div>
    );
  } else {
    return events ? (
      <EventList events={events} />
    ) : (
      <div className={styles.loading}>
        <h6>Loading events - it might take upto 30 seconds... </h6>
      </div>
    );
  }
}
