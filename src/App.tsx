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
			.catch(() => {
				setLoadingFailed(true);
			});
	}, []);

	if (loadingFailed) {
		return (
			<div className={styles.loading}>
				<h6>
					Fetching colony events failed. If you are on Firefox, try switching to
					a Chromium based browser.
				</h6>
			</div>
		);
	}

	return events ? (
		<EventList events={events} />
	) : (
		<div className={styles.loading}>
			<h6>Loading events - it might take upto 10-15 seconds... </h6>
		</div>
	);
}
