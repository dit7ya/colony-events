import * as styles from "../styles.module.css";
import { EventItem, EventProp } from "./EventItem";

export const EventList = (props: { events: EventProp[] }) => {
  return (
    <div className={styles.eventList}>
      {props.events.map((event: EventProp) => (
        <EventItem key={event.id} {...event} />
      ))}
    </div>
  );
};
