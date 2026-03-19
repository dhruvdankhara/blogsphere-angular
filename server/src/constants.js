export const DB_NAME = "blogsphere-db";

export const UserGenderEnum = {
  NULL: "",
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

export const AvailableUserGender = Object.values(UserGenderEnum);

export const UserRoleEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const AvailableUserRoles = Object.values(UserRoleEnum);

export const ReportReasonEnum = {
  SPAM: "SPAM",
  HARASSMENT: "HARASSMENT",
  HATE_SPEECH: "HATE_SPEECH",
  MISINFORMATION: "MISINFORMATION",
  INAPPROPRIATE_CONTENT: "INAPPROPRIATE_CONTENT",
  COPYRIGHT_VIOLATION: "COPYRIGHT_VIOLATION",
  OTHER: "OTHER",
};

export const AvailableReportReasons = Object.values(ReportReasonEnum);

export const ReportStatusEnum = {
  PENDING: "PENDING",
  REVIEWED: "REVIEWED",
  RESOLVED: "RESOLVED",
  DISMISSED: "DISMISSED",
};

export const AvailableReportStatuses = Object.values(ReportStatusEnum);

export const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};
