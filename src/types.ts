export type possibleEventNames =
  | "PayoutClaimed"
  | "ColonyInitialised"
  | "ColonyRoleSet"
  | "DomainAdded";

export interface ParsedLogBase {
  logTime: number;
  transactionHash: string;
}

export type ParsedLog =
  | ParsedPayoutEventLog
  | ParsedColonyInitialisedLog
  | ParsedColonyDomainAddedLog
  | ParsedColonyRoleSetLog;

export interface ParsedPayoutEventLog extends ParsedLogBase {
  values: {
    fundingPotId: string;
    amount: string;
    token: string;
  };
}

export interface ParsedColonyInitialisedLog extends ParsedLogBase {
  values: {
    colonyNetwork: string;
  };
}
export interface ParsedColonyRoleSetLog extends ParsedLogBase {
  values: {
    user: string;
    domainId: string;
    role: number;
    setTo: 1 | -1;
  };
}
export interface ParsedColonyDomainAddedLog extends ParsedLogBase {
  values: {
    domainId: string;
  };
}
