export const utilsDate = (time: Date): string => {
  const date = JSON.stringify(time)
    .split('T')[0]
    .split('"')[1]
    .split('-')
    .reverse()
    .join(' ');

  return date;
};
