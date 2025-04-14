// https://stackoverflow.com/a/33487313

const epochs: [string, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

const getDuration = (timeAgoInSeconds: number): { interval: number; epoch: string } | null => {
  for (const [name, seconds] of epochs) {
    const interval = Math.floor(timeAgoInSeconds / seconds);
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name,
      };
    }
  }
  return null;
};

export const timeAgo = (date: Date) => {
  const now = new Date().getTime();
  const then = date.getTime();

  const timeAgoInSeconds = Math.floor((now - then) / 1000);

  const duration = getDuration(timeAgoInSeconds);
  if (!duration) return "error while calculating time";

  const { interval, epoch } = duration;
  const suffix = interval === 1 ? "" : "s";
  return `${interval} ${epoch}${suffix} ago`;
};
