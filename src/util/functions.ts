export const convertTimeToNumber = (time: string) => {
  const [mins, secs] = time.split(":");
  return +mins * 60 + +secs;
};

export const convertNumberToTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formattedMins = mins < 10 ? `0${mins}` : mins;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;

  return `${formattedMins}:${formattedSecs}`;
};
