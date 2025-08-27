const addLeadingZero = (num: number): string => `${num < 10 && '0'}${num}`

const randomNum = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

const declines = (count: number, one: string, two: string, few: string): string => {
  return [few, one, two, two, two, few][count % 100 > 10 && count % 100 < 20 ? 0 : Math.min(count % 10, 5)]
}

export { addLeadingZero, randomNum, declines }
