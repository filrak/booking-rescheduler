<template>
  <div class="chat-page">
    <div class="header">
      <h1>Appointment Rescheduling Assistant</h1>
      <p class="subtitle">AI-powered scheduling made simple</p>
    </div>
    <div class="main-content">
      <ChatInterface/> 
    </div>
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
  min-height: 100vh;
  height: 100vh;
  padding: 2vh 0;
  background: linear-gradient(to bottom, #000000, #0A0A0A);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  width: 100vw;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2vh;
  height: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: fadeIn 0.8s ease-out;
  width: 100%;
}

h1 {
  font-family: inherit;
  background: linear-gradient(135deg, #fff 0%, #E5E7EB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: min(4vh, 2.5rem);
  font-weight: 700;
  margin-bottom: 0.5vh;
  letter-spacing: -0.02em;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: min(1.8vh, 1.1rem);
  font-weight: 400;
}

.main-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 86vh;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>