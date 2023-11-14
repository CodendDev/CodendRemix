import { EstimatedTime } from "~/api/types/baseEntitiesTypes";

export const estimatedTimeRegex = /^(\d+d)?\s*(\d+h)?\s*(\d+m)?$/;

export function formatEstimatedTimeToString(est?: EstimatedTime) {
  if (!est) return "";
  const parts: string[] = [];
  if (est.days > 0) {
    parts.push(`${est.days}d`);
  }
  if (est.hours > 0) {
    parts.push(`${est.hours}h`);
  }
  if (est.minutes > 0) {
    parts.push(`${est.minutes}m`);
  }
  return parts.join(" ");
}

export function formatStringToEstimatedTime(
  est: string
): EstimatedTime | undefined {
  if (!est) {
    return undefined;
  }
  const match = est.match(estimatedTimeRegex);
  if (!match) {
    return undefined;
  }
  const [, days, hours, minutes] = match.map(String);

  return {
    days: +days?.slice(0, -1) || 0,
    hours: +hours?.slice(0, -1) || 0,
    minutes: +minutes?.slice(0, -1) || 0,
  };
}
