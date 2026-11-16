<script setup>
defineProps({
  tecles: Array,
  bloquejat: Boolean,
  premudes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['premuda'])
</script>

<template>
  <div class="keypad">
    <button
      v-for="tecla in tecles"
      :key="tecla"
      :disabled="bloquejat || premudes.includes(tecla)"
      @click="emit('premuda', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>

<style scoped>
.keypad {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
}

.keypad button {
  width: 72px;
  height: 72px;
  font-size: 1.75rem;
  font-weight: 700;
}
</style>
