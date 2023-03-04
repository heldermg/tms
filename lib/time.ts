import { format } from "date-fns"

export function sanitizeTime(oldTime: any) {
  const regex = /^\d\d:\d\d:\d\d.\d\d\dZ/i

  if (oldTime && regex.test(oldTime)) {
    const hours = oldTime.substring(0, 2)
    const minutes = oldTime.substring(3, 5)

    const newTime = new Date(1970, 0, 1)
    newTime.setHours(+hours)
    newTime.setMinutes(+minutes)
    newTime.setSeconds(0)
    return newTime
  }
  return oldTime
}

export function sanitizeDateOffset(oldDate: any) {
  if (oldDate) {
    const newDate = new Date(oldDate)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset())
    return newDate
  }
  return oldDate
}

export function getNextDays(d: number) {
  let date = new Date()
  let lastDate = new Date()
  lastDate.setDate(lastDate.getDate() + d);
  let days = [];
  while (date.getTime() < lastDate.getTime()) {
    days.push(format(new Date(date), 'dd/MM/yyyy'))
    date.setDate(date.getDate() + 1)
  }
  return days
}