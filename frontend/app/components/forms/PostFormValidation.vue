<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('post.create.title') }}</h2>
    
    <VForm 
      :validation-schema="validationSchema"
      @submit="handleSubmit" 
      class="space-y-4"
    >
      <!-- Title Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('post.create.fields.title') }} <span class="text-red-500">*</span>
        </label>
        <VField
          v-slot="{ field, errorMessage }"
          name="title"
        >
          <input 
            v-bind="field"
            type="text" 
            :placeholder="$t('post.create.placeholders.enterTitle')"
            :class="['input input-bordered w-full', 
              errorMessage ? 'border-red-500' : '']"
          />
          <VErrorMessage name="title" class="text-red-500 text-sm mt-1" />
        </VField>
      </div>

      <!-- Price Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('post.create.fields.price') }} <span class="text-red-500">*</span>
        </label>
        <VField
          v-slot="{ field, errorMessage }"
          name="price"
        >
          <input 
            v-bind="field"
            type="number" 
            :placeholder="$t('post.create.placeholders.enterPrice')"
            :class="['input input-bordered w-full', 
              errorMessage ? 'border-red-500' : '']"
          />
          <VErrorMessage name="price" class="text-red-500 text-sm mt-1" />
        </VField>
      </div>

      <!-- Description Field -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('post.create.fields.description') }} <span class="text-red-500">*</span>
        </label>
        <VField
          v-slot="{ field, errorMessage }"
          name="description"
        >
          <textarea 
            v-bind="field"
            :placeholder="$t('post.create.placeholders.enterDescription')"
            rows="4"
            :class="['textarea textarea-bordered w-full', 
              errorMessage ? 'border-red-500' : '']"
          ></textarea>
          <VErrorMessage name="description" class="text-red-500 text-sm mt-1" />
        </VField>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          {{ loading ? $t('post.create.buttons.submitLoading') : $t('common.submit') }}
        </button>
      </div>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

// Validation schema
const validationSchema = toTypedSchema(yup.object({
  title: yup
    .string()
    .required('Vui lòng nhập tiêu đề')
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(150, 'Tiêu đề không được quá 150 ký tự'),
  price: yup
    .number()
    .required('Vui lòng nhập giá thuê')
    .min(100000, 'Giá thuê phải từ 100,000 VNĐ')
    .max(50000000, 'Giá thuê không được quá 50,000,000 VNĐ'),
  description: yup
    .string()
    .required('Vui lòng nhập mô tả')
    .min(20, 'Mô tả phải có ít nhất 20 ký tự')
    .max(5000, 'Mô tả không được quá 5000 ký tự')
}))

// State
const loading = ref(false)

// Handle submit
const handleSubmit = async (values: any) => {
  loading.value = true
  
  try {
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Form submitted successfully!')
  } catch (error) {
    console.error('Error:', error)
    alert('Có lỗi xảy ra!')
  } finally {
    loading.value = false
  }
}
</script>
