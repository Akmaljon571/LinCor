const month = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

export const fn = (time_left: string, today: string) => {
  const number1 = time_left.split(' ').map((e) => Number(e));
  const number2 = today.split(' ').map((e) => Number(e));

  if (number1[0] > number2[0]) {
    const oy = number2[1] - number1[1] - 1;
    const kun = Math.abs(number1[0] - number2[0]);
    const qaytishi = month[number2[1]];
    const ketgan_kun = qaytishi - kun;
    const qolgan_oy = 6 - oy - 1;
    if (oy > 6) {
      return {
        finish: 'Kurs olingan sana tugagan',
      };
    }

    return {
      ketgan_oy: oy,
      ketgan_kun,
      qolgan_oy,
      qolgan_kun: kun,
    };
  } else if (number2[0] > number1[0]) {
    const oy = number2[1] - number1[1];
    const kun = number2[0] - number1[0];
    const qolgan_oy = 6 - oy - 1;
    const qaytishi = month[number2[1]];
    const qolgan_kun = qaytishi - kun;

    return {
      ketgan_oy: oy,
      ketgan_kun: kun,
      qolgan_oy,
      qolgan_kun,
    };
  } else {
    const oy = number2[1] - number1[1];
    const qolgan_oy = 6 - oy;

    return {
      ketgan_oy: oy,
      qolgan_oy,
    };
  }
};
