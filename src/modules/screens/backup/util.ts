function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomArray(count: number, min: number, max: number) {
  let array: number[] = [];
  while (array.length !== count) {
    const randomInt = getRandomIntInclusive(min, max);
    if (!array.includes(randomInt)) {
      array.push(randomInt);
    }
  }
  return array;
}
