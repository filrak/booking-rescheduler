<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup>
const { createFakeCalendar } = useCalendar()

createFakeCalendar()
</script>
