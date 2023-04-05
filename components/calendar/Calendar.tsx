import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Absence } from '@prisma/client'
import { sanitizeTime } from '../../lib/time'

moment.locale('pt-BR')
const localizer = momentLocalizer(moment)

const resourceMap = [
  { resourceId: 1, resourceTitle: 'Absences' },
]

const styles = {
  container: {
    width: '80wh',
    height: '60vh',
    margin: '2em',
  },
}

function getCalendarEventsByAbsences(absences: Absence[]) {
  if (absences) {
    return absences.map((a: any) => {
      const startDate = new Date(a.startDateAt.slice(0, -1))
      const endDate = new Date(a.endDateAt.slice(0, -1))

      const startTime = a.startTimeAt ? new Date(sanitizeTime(a.startTimeAt)) : null
      const endTime = a.endTimeAt ? new Date(sanitizeTime(a.endTimeAt)) : null

      const startHours = startTime ? startTime.getHours() : 0
      const endHours = endTime ? endTime.getHours() : 23

      const startMinutes = startTime ? startTime.getMinutes() : 0
      const endMinutes = endTime ? endTime.getMinutes() : 59

      return {
        id: a.id,
        title: a.user.name + ": " + a.title,
        start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startHours, startMinutes, 0),
        end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endHours, endMinutes, 0),
        resourceId: 1,
      }
    })
  }
  return []
}

interface CalendarProps {
  absences: Absence[]
}

export default function Calendar({ absences }: CalendarProps) {
  console.log(absences)

  const events = getCalendarEventsByAbsences(absences)

  return (
    <div style={styles.container}>
      <BigCalendar
        selectable
        localizer={localizer}
        events={events}
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        defaultDate={new Date()}
        resources={resourceMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
      />
    </div>
  )
}