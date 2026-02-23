export enum BirthdayStatus {
  PENDING_GENERATION,
  GENERATING,
  READY_FOR_APPROVAL,
  APPROVED,
  SENT,
  FAILED,
}

export const BirthdayStatusLabels: Record<string, string> = {
  PENDING_GENERATION: "Pending Generation",
  GENERATING: "Generating",
  READY_FOR_APPROVAL: "Ready for Approval",
  APPROVED: "Approved",
  SENT: "Sent",
  FAILED: "Failed",
};
export type TEmployee = {
  id: string;
  name: string;
  email: string;
  birthdayMonth: number;
  birthdayDay: number;
  createdAt: Date;
};

export type TBirthdayEvent = {
  id: string;
  employeeId: string;
  status: BirthdayStatus;
  year: number;
  dateOfBirth: Date;
  createdAt: Date;
  employee: TEmployee;
  senderEmail: string;
  approvedAt?: Date;
  sentAt?: Date;
  htmlContent?: string;
};

export type CreateEventsResponse = {
  id: string;
  employeeId: string;
  status: BirthdayStatus;
  year: number;
  createdAt: Date;
};

export type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: string;
}
