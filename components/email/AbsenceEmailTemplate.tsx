import { Html } from "@react-email/html"
import { Text } from "@react-email/text"
import { Section } from "@react-email/section"
import { Container } from "@react-email/container"
import { Absence, AbsenceType, User } from "@prisma/client"
import { format } from 'date-fns'
import { sanitizeTime } from "../../lib/time"

export default function AbsenceEmailTemplate(
  absence: Absence, 
  user: User, 
  absenceType: AbsenceType) {
  const {
    title,
    description,
    startDateAt,
    endDateAt,
    startTimeAt,
    endTimeAt,
    isAllDay
  } = absence

  const startTimeConverted = startTimeAt?.toISOString().substring(11)
  const endTimeConverted = endTimeAt?.toISOString().substring(11)

  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>New Absence Record!</Text>
          <Text style={paragraph}>
            <strong>User:</strong> {user.name} <br />
            <strong>Title:</strong> {title} <br />
            <strong>Type:</strong> {absenceType.name} <br />
            <strong>Description:</strong> {description} <br />
            <strong>Starts At:</strong> {format(new Date(startDateAt.toISOString().slice(0, -1)), 'dd/MM/yyyy')} <br />
            <strong>Ends At:</strong> {format(new Date(endDateAt.toISOString().slice(0, -1)), 'dd/MM/yyyy')} <br />
            <strong>All Day Event:</strong> {isAllDay ? "Yes" : "No"} <br />
            {startTimeConverted &&
              <span><strong>Start Time At:</strong> {format(sanitizeTime(startTimeConverted), 'HH:mm')} <br /></span>
            }
            {endTimeConverted &&
              <span><strong>End Time At:</strong> {format(sanitizeTime(endTimeConverted), 'HH:mm')} <br /></span>
            }
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

// Styles for the email template
const main = {
  backgroundColor: "#ffffff",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};