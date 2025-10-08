<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const emit = defineEmits<{
  'update:modelValue': [file: File | null]
  'upload': [file: File]
}>()
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  maxSize: 10,
  acceptedTypes: () => ['image/png', 'image/jpg', 'image/jpeg'],
  initialImageUrl: null
})

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const isUploading = ref(false)
const errorMessage = ref('')
const selectedFile = ref<File | null>(props.modelValue)

interface Props {
  title?: string | null,
  modelValue?: File | null
  maxSize?: number // in MB
  acceptedTypes?: string[]
  initialImageUrl?: string | null
}


const previewUrl = computed(() => {
  if (selectedFile.value) {
    return URL.createObjectURL(selectedFile.value)
  }
  if (props.initialImageUrl) {
    return props.initialImageUrl
  }
  return null
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      handleFile(file)
    }
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file) {
      handleFile(file)
    }
  }
}

const handleFile = (file: File) => {
  errorMessage.value = ''
  
  // Validate file type
  if (!props.acceptedTypes.includes(file.type)) {
    errorMessage.value = 'Please select a valid image file (PNG, JPG, GIF)'
    return
  }
  
  // Validate file size
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (file.size > maxSizeBytes) {
    errorMessage.value = `File size must be less than ${props.maxSize}MB`
    return
  }
  
  selectedFile.value = file
  emit('update:modelValue', file)
  emit('upload', file)
}

const removeFile = () => {
  selectedFile.value = null
  emit('update:modelValue', null)
  errorMessage.value = ''
  
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

watch(() => props.modelValue, (newValue) => {
  selectedFile.value = newValue
})

watch(() => props.initialImageUrl, (newValue) => {
  // Reset selected file when initial image URL changes
  if (newValue && !selectedFile.value) {
    selectedFile.value = null
  }
})
</script>

<template>
  <div class="w-full">
    <!-- Title -->
    <h3 v-if="title" class="text-lg font-medium text-gray-900 mb-4">{{title}}</h3>
    
    <!-- Upload Area -->
    <div 
      class="relative w-full flex flex-col items-center"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/png,image/jpg,image/jpeg,image/gif"
        @change="handleFileSelect"
      />
      
      <!-- Circular Upload Area -->
      <div 
        class="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors duration-200"
        :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
      >
        <!-- Default Icon or Preview Image -->
        <div v-if="!previewUrl" class="flex items-center justify-center">
          <svg 
            class="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1.5" 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        
        <!-- Preview Image -->
        <div v-else class="w-full h-full rounded-full overflow-hidden">
          <img 
            :src="previewUrl" 
            alt="Preview" 
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Loading overlay -->
        <div 
          v-if="isUploading" 
          class="absolute inset-0 bg-white bg-opacity-75 rounded-full flex items-center justify-center"
        >
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
      
      <!-- Upload Text -->
      <div class="mt-4 text-center">
        <p class="text-gray-700 text-sm">
          <span class="text-blue-600 underline cursor-pointer hover:text-blue-700">
            Upload a file
          </span>
          <span class="text-gray-500"> or drag and drop</span>
        </p>
        
        <!-- File format info -->
        <p class="text-xs text-gray-500 mt-1">
          PNG, JPG, JPEG up to {{maxSize}}MB
        </p>
      </div>
      
      <!-- Remove Button -->
      <div v-if="previewUrl" class="mt-2">
        <button 
          @click.stop="removeFile"
          class="text-red-600 hover:text-red-700 text-sm underline"
        >
          Remove
        </button>
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-2 text-sm text-red-600 text-center">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better mobile experience */
@media (max-width: 640px) {
  .upload-area {
    padding: 1.5rem;
  }
  
  .upload-icon {
    width: 3rem;
    height: 3rem;
  }
}
</style>
