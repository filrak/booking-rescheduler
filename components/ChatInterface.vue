<template>
  <div class="chat-container">
    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
      
      <div v-if="isLoading" class="message assistant">
        <div class="message-content">
          <span class="typing-indicator">Thinking...</span>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Input Area -->
    <div class="chat-input">
      <input
        v-model="inputMessage"
        @keyup.enter="handleSend"
        :disabled="isLoading"
        placeholder="Type your message..."
        type="text"
      />
      <button 
        @click="handleSend"
        :disabled="isLoading || !inputMessage.trim()"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { usePrompt } from '~/composables/usePrompt'
import { mockCalendar } from '~/calendar_mock'

export default {
  name: 'ChatInterface',
  setup() {
    const messages = ref([])
    const inputMessage = ref('')
    const isLoading = ref(false)
    const error = ref(null)
    const messagesContainer = ref(null)

    // Keep system prompt separate
    const systemPrompt = {
      role: "system",
      content: `You are an AI assistant for a barbershop, specialized in managing appointments. You can:
      - Access the barbershop's calendar for the next 2 days
      - View appointments between 8 AM - 12 PM
      - Contact clients and barbers about rescheduling
      - Handle 1-hour appointment slots
      - Understand different service types (Haircut, Beard Trim, Style)
      Here is the calendar you can operate within: ${JSON.stringify(mockCalendar)}`
    }

    const handleSend = async () => {
      if (!inputMessage.value.trim() || isLoading.value) return
      
      const userMessage = inputMessage.value
      inputMessage.value = ''
      isLoading.value = true
      error.value = null

      try {
        // Add user message to visible messages
        messages.value.push({
          role: 'user',
          content: userMessage
        })

        const { response } = await usePrompt(
          [systemPrompt, ...messages.value]
        )

        if (response?.content) {
          messages.value.push({
            role: 'assistant',
            content: response.content
          })
        }
        
      } catch (e) {
        error.value = e?.message || 'An error occurred'
        console.error('Chat error:', e)
      } finally {
        isLoading.value = false
      }
    }

    // Scroll to bottom when new messages arrive
    watch(messages, () => {
      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      }, 0)
    })

    return {
      messages,
      inputMessage,
      isLoading,
      error,
      messagesContainer,
      handleSend
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 80%;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.message.user {
  align-self: flex-end;
  background-color: #2563eb;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background-color: #f3f4f6;
  color: #1f2937;
}

.typing-indicator {
  display: inline-block;
  animation: ellipsis 1.4s infinite;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 4px;
  text-align: center;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  outline: none;
}

input:focus {
  border-color: #2563eb;
}

button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

@keyframes ellipsis {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
}
</style> 