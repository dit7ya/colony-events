import { utils } from "ethers";
import {
  getLogs,
  getBlockTime,
  ColonyRole,
  ColonyClient,
} from "@colony/colony-js";
import { nanoid } from "nanoid";
import { EventProp } from "./components/EventItem";

import { getColonyClient } from "./client";
import {
  ParsedColonyDomainAddedLog,
  ParsedColonyInitialisedLog,
  ParsedColonyRoleSetLog,
  ParsedLog,
  ParsedPayoutEventLog,
  possibleEventNames,
} from "./types";

const colonyTokenMapping: { [index: string]: string } = {
  "0x0000000000000000000000000000000000000001": "ETH",
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "DAI",
  "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359": "SAI",
  "0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c": "βLNY",
};

const getFilteredEvents = async (
  filterName: possibleEventNames
): Promise<ParsedLog[]> => {
  const colonyClient: ColonyClient = await getColonyClient();
  const eventFilter = colonyClient.filters[filterName]();
  // Get the raw logs array
  const eventLogs = await getLogs(colonyClient, eventFilter);
  const parsedLogs = await Promise.all(
    eventLogs.map(async (event) => {
      const logTime = await getBlockTime(
        colonyClient.provider,
        event.blockHash || "" // blockHash might be undefined
      );
      const transactionHash = event.transactionHash; // This is useful later on
      return {
        ...colonyClient.interface.parseLog(event),
        logTime,
        transactionHash,
      };
    })
  );
  return parsedLogs;
};

const formatPayoutEvent = async (
  colonyClient: ColonyClient,
  parsedPayoutEventLog: ParsedPayoutEventLog
): Promise<EventProp> => {
  const humanReadableFundingPotId = new utils.BigNumber(
    parsedPayoutEventLog.values.fundingPotId
  ).toString();

  const { associatedTypeId } = await colonyClient.getFundingPot(
    humanReadableFundingPotId
  );

  const { recipient: userAddress } = await colonyClient.getPayment(
    associatedTypeId
  );

  const amount = new utils.BigNumber(parsedPayoutEventLog.values.amount);
  const wei = new utils.BigNumber(10);
  const humanReadableAmount = amount.div(wei.pow(18));

  const tokenName = colonyTokenMapping[parsedPayoutEventLog.values.token];

  return {
    id: nanoid(),
    avatarHash: userAddress,
    logTime: parsedPayoutEventLog.logTime, // REVIEW,
    description: (
      <p>
        User <strong>{userAddress}</strong> claimed{" "}
        <strong>
          {humanReadableAmount.toString()}
          {tokenName}
        </strong>{" "}
        payout from pot <strong>{humanReadableFundingPotId}</strong>.
      </p>
    ),
  };
};

const formatColonyInitialisedEvent = async (
  parsedColonyInitialisedLog: ParsedColonyInitialisedLog
) => {
  return {
    id: nanoid(),
    avatarHash: parsedColonyInitialisedLog.values.colonyNetwork, // REVIEW
    logTime: parsedColonyInitialisedLog.logTime,
    description: <p>Congratulations! It's a beautiful baby colony!</p>,
  };
};

const formatColonyRoleSetEvent = async (
  parsedColonyRoleSetLog: ParsedColonyRoleSetLog
) => {
  const role = ColonyRole[parsedColonyRoleSetLog.values.role];
  const userAddress = parsedColonyRoleSetLog.values.user;
  const domainId = getDomainId(parsedColonyRoleSetLog);
  const assignedOrRevoked = parsedColonyRoleSetLog.values.setTo
    ? "assigned to"
    : "revoked from";

  return {
    id: nanoid(),
    avatarHash: userAddress,
    logTime: parsedColonyRoleSetLog.logTime,
    description: (
      <p>
        <strong>{role}</strong> role {assignedOrRevoked} user{" "}
        <strong>{userAddress}</strong> in domain <strong>{domainId}</strong>.
      </p>
    ),
  };
};

const formatColonyDomainAddedEvent = async (
  parsedColonyDomainAddedLog: ParsedColonyDomainAddedLog
) => {
  const domainId = getDomainId(parsedColonyDomainAddedLog);
  return {
    id: nanoid(),
    avatarHash: parsedColonyDomainAddedLog.transactionHash,
    logTime: parsedColonyDomainAddedLog.logTime,
    description: (
      <p>
        Domain <strong>{domainId}</strong> added.
      </p>
    ),
  };
};

const getDomainId = (
  parsedLog: ParsedColonyDomainAddedLog | ParsedColonyRoleSetLog
) => {
  return new utils.BigNumber(parsedLog.values.domainId).toString();
};

export const getAllFormattedEvents = async () => {
  const colonyClient = await getColonyClient();

  const payOutEvents = (await getFilteredEvents("PayoutClaimed")).map((event) =>
    formatPayoutEvent(colonyClient, event as ParsedPayoutEventLog)
  );

  const roleSetEvents = (await getFilteredEvents("ColonyRoleSet")).map(
    (event) => formatColonyRoleSetEvent(event as ParsedColonyRoleSetLog)
  );

  const colonyInitialisedEvents = (
    await getFilteredEvents("ColonyInitialised")
  ).map((event) =>
    formatColonyInitialisedEvent(event as ParsedColonyInitialisedLog)
  );

  const colonyDomainAddedEvents = (await getFilteredEvents("DomainAdded")).map(
    async (event) =>
      await formatColonyDomainAddedEvent(event as ParsedColonyDomainAddedLog)
  );

  // Some of the initialisation, domain added, and role set event happened at the same time
  // in the very beginning.
  // I am assuming the initialisation event happened first, followed by domain added, and then
  // role set events
  // Since ECMAScript 2019, the sort is stable
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#sort_stability
  // so we can just carefully choose the merging order of those three events in the following

  const allEvents = await Promise.all(
    payOutEvents
      .concat(colonyInitialisedEvents)
      .concat(colonyDomainAddedEvents)
      .concat(roleSetEvents)
  );

  // sort all events by logTime. WARN: this is in-place mutation
  allEvents.sort((a, b) => {
    return a.logTime < b.logTime ? 1 : -1;
  });

  return allEvents;
};
