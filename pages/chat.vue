<template>
  <div class="chat-page">
    <h1>Appointment Rescheduling Assistant</h1>
    <ChatInterface :initial-prompt="systemPrompt" />
  </div>
</template>

<script>
import ChatInterface from '~/components/ChatInterface.vue'
import {mockCalendar} from '~/calendar_mock'

export default {
  name: 'ChatPage',
  components: {
    ChatInterface
  },
  setup() {
    const systemPrompt = `You are an AI assistant for a barbershop, specialized in managing appointments. You can:
    - Access the barbershop's calendar for the next 2 days
    - View appointments between 8 AM - 12 PM
    - Contact clients and barbers about rescheduling
    - Handle 1-hour appointment slots
    - Understand different service types (Haircut, Beard Trim, Style)
    Here is the calendar you can operate within: ${mockCalendar.toString()} 
    `

    return {
      systemPrompt
    }
  }
}
</script>

<style scoped>
.chat-page {
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}
</style> 