import { useCalendar } from '~/utils/calendarComposable'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { appointmentToReschedule, preferredDate, preferredTime } = body
    const calendar = useCalendar()

    // Simulate client response delay (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Simulate 70% chance of client agreeing to reschedule
    const clientWillingToReschedule = Math.random() < 0.7

    if (clientWillingToReschedule) {
      // Remove the old appointment
      calendar.removeAppointment(
        appointmentToReschedule.date,
        appointmentToReschedule.time
      )

      // Add the new appointment
      calendar.addAppointment(
        preferredDate,
        preferredTime,
        {
          clientId: appointmentToReschedule.clientId,
          service: appointmentToReschedule.service,
          barber: appointmentToReschedule.barber
        }
      )

      return {
        role: 'assistant',
        content: `The appointment has been successfully rescheduled to ${preferredDate} at ${preferredTime}.`
      }
    }

    return {
      role: 'assistant',
      content: "Unfortunately, we asked someone else to reschedule the appointment and they declined. Please try a different time."
    }
  } catch (error) {
    console.error('Error in request-reschedule:', error)
    return {
      role: 'assistant',
      content: "An error occurred while processing your request. Please try again."
    }
  }
})