<template>
  <div class="chat-container">
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
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12" y2="16"></line>
      </svg>
      {{ error }}
    </div>

    <div class="chat-input">
      <input
        v-model="inputMessage"
        @keyup.enter="handleSend"
        :disabled="isLoading"
        placeholder="Type your message..."
      />
      <button 
        @click="handleSend"
        :disabled="isLoading || !inputMessage.trim()"
        class="send-button"
      >
        <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
        </svg>
        <div v-else class="button-loader"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useChat } from '~/composables/useChat'
import { useCalendar } from '~/composables/useCalendar'
import { tools, executeFunction } from '~/utils/calendarTools'
import { createSystemPrompt } from '~/utils/prompt'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const error = ref(null)
const messagesContainer = ref(null)

watch(messages, () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 0)
})

const handleSend = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  
  const userMessage = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true
  error.value = null

  try {
    messages.value.push({
      role: 'user',
      content: userMessage
    })

    const { response } = await useChat(
      [createSystemPrompt(props.userId), ...messages.value],
      tools
    )

    if (response.tool_calls) {
      for (const toolCall of response.tool_calls) {
        console.log('executing a tool call', toolCall)
        const result = await executeFunction(toolCall, useCalendar())
        messages.value.push({
          role: 'function',
          name: toolCall.function.name,
          content: result
        })
      }

      // Get final response after function execution
      const { response: finalResponse } = await useChat(
        [createSystemPrompt(props.userId), ...messages.value]
      )

      if (finalResponse?.content) {
        messages.value.push({
          role: 'assistant',
          content: finalResponse.content
        })
      }
    } else if (response?.content) {
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
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 84vh;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  background-color: rgba(20, 20, 20, 0.95);
  border-radius: min(24px, 3vh);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: min(1.5rem, 2vh);
  display: flex;
  flex-direction: column;
  gap: min(1.5rem, 2vh);
  background: transparent;
}

.message {
  display: flex;
  max-width: 85%;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  font-size: 0.95rem;
  line-height: 1.5;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 400;
  width: fit-content;
  max-width: 100%;
}

.message.user {
  align-self: flex-end;
}

.message.user .message-content {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: white;
}

.message.assistant .message-content {
  background: rgba(255, 255, 255, 0.08);
  color: #E5E7EB;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 0.25rem 0;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #E5E7EB;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: rgba(220, 38, 38, 0.1);
  color: #EF4444;
  padding: 0.75rem;
  margin: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2;
}

.chat-input {
  display: flex;
  gap: min(0.75rem, 1vh);
  padding: min(1.5rem, 2vh);
  background: rgba(15, 15, 15, 0.95);
  position: relative;
}

input {
  flex-grow: 1;
  height: 2.5rem;
  padding: 0 min(1.25rem, 2vh);
  background: rgba(40, 40, 40, 0.95);
  border: none;
  border-radius: min(16px, 2vh);
  color: white;
  font-size: min(0.95rem, 2vh);
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-family: inherit;
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button:hover:not(:disabled) {
  background: #2563EB;
  transform: translateY(-1px);
}

.send-button:disabled {
  background: rgba(59, 130, 246, 0.5);
  cursor: not-allowed;
}

.send-button svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2;
}

.button-loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 1280px) {
  .chat-container {
    max-width: 90%;
  }
}

@media (max-width: 768px) {
  .chat-container {
    max-width: 95%;
  }
}

@media (max-width: 640px) {
  .chat-container {
    max-width: 100%;
    border-radius: 16px;
  }
}
</style>