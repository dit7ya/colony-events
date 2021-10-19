import * as styles from "../styles.module.css";
import Blockies from "react-blockies";

export interface EventProp {
  id?: string;
  avatarHash: string;
  description: JSX.Element;
  logTime: number;
}

export const EventItem = ({
  avatarHash,
  description,
  logTime,
}: EventProp): JSX.Element => {
  const date = new Date(logTime);
  return (
    <div className={styles.eventItem}>
      <div className={styles.avatar}>
        <Blockies seed={avatarHash} size={9} scale={4} />{" "}
      </div>
      <div>
        <div className={styles.eventDescription}>{description}</div>

        <div className={styles.eventDate}>
          <p>{date.toUTCString()}</p>
        </div>
      </div>
    </div>
  );
};
