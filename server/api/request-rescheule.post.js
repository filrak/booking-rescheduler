import { mockCalendar } from '~/utils/calendarMock'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { appointmentToReschedule } = body

    // Simulate client response delay (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Simulate 70% chance of client agreeing to reschedule
    const clientWillingToReschedule = Math.random() < 0.7

    if (clientWillingToReschedule) {
      return {
        success: true,
        content: `The client (${appointmentToReschedule.client}) has agreed to reschedule their ${appointmentToReschedule.service} appointment from ${appointmentToReschedule.time}.`
      }
    }

    return {
      success: false,
      content: `The client (${appointmentToReschedule.client}) prefers to keep their original appointment time at ${appointmentToReschedule.time}.`
    }

  } catch (error) {
    return {
      success: false,
      content: 'An error occurred while contacting the client'
    }
  }
})