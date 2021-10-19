import { EventItem, EventProp } from "./EventItem";
import * as styles from "../styles.module.css";

export const EventList = (props: { events: EventProp[] }) => {
  return (
    <div className={styles.eventList}>
      {props.events.map((event: EventProp) => (
        <EventItem key={event.id} {...event} />
      ))}
    </div>
  );
};
