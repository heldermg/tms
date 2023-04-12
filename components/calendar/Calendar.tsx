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

      let start, end
      if (startTime && endTime) {
        start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes(), 0)
        end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes(), 0)

      } else {
        start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      }

      return {
        id: a.id,
        title: a.user.name + ": " + a.title,
        start,
        end,
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