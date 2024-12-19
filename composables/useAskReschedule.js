export function useAskReschedule() {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Ask a client if they would be willing to reschedule their appointment
   * @param {Object} appointment - The appointment to potentially reschedule
   * @returns {Promise<{success: boolean, content: string}>} Response with the client's decision
   */
  async function askToReschedule(appointment) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/request-rescheule', {
        method: 'POST',
        body: {
          appointmentToReschedule: appointment
        }
      })

      return {
        success: response.success,
        content: response.content
      }
    } catch (err) {
      error.value = 'Failed to contact the client for rescheduling'
      return {
        success: false,
        content: 'Failed to contact the client for rescheduling'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    askToReschedule,
    isLoading,
    error
  }
}
