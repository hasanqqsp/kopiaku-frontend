<script setup lang="ts">
const emit = defineEmits(['confirm', 'cancel'])
const props = defineProps<{ content: string }>()
</script>

<template>
  <div class="modal modal-open" @click.self="emit('cancel')">
    <div class="modal-box">
      <div class="py-2">
        <p v-text="props.content"></p>
      </div>
      <div class="modal-action">
        <button class="btn btn-primary" @click="emit('confirm')">Yes</button>
        <button class="btn" @click="emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>
