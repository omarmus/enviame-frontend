export const format = (date: Date) => {
  const newDate = new Date(date)
  return [
    (newDate.getDate() < 10 ? '0' : '') + newDate.getDate(),
    (newDate.getMonth() < 9 ? '0' : '') + (newDate.getMonth() + 1),
    newDate.getFullYear()
  ].join('-')
}
