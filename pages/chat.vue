<template>
  <div class="chat-page">
    <h1>Appointment Rescheduling Assistant</h1>
    <ChatInterface/> 
  </div>
</template>

<script>
import ChatInterface from '~/components/ChatInterface.vue'

export default {
  name: 'ChatPage',
  components: {
    ChatInterface
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