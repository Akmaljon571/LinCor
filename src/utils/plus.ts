export const plus = (time: Date, son: number): string => {
  const a = JSON.stringify(time)
    .split('T')[0]
    .split('"')[1]
    .split('-')
    .reverse();

  const date = a.map((e) => Number(e));
  const month = date[1] + son;
  if (month > 12) {
    const qolgan_oy = month - 12;
    date[2] += 1;
    return [
      date[0],
      String(qolgan_oy).length == 1 ? `0${qolgan_oy}` : qolgan_oy,
      date[2],
    ].join(' ');
  }
  return [
    date[0],
    String(month).length == 1 ? `0${month}` : month,
    date[2],
  ].join(' ');
};
