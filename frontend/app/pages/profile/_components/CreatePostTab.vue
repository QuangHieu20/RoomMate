<script setup lang="ts">
import type { PostFormData, CreatePostTab } from '~/types'
import { toTypedSchema } from '@vee-validate/yup'
import { useValidationSchema } from '~/composables/useValidation'
import { roomTypeOptions, priceTypeOptions, genderRequirementOptions } from '~/types/enums'
import BaseInput from '~/components/base/Input.vue'
import BaseSelect from '~/components/base/Select.vue'

// Props
interface Props {
  createPostTab: CreatePostTab
  postForm: PostFormData
  findRoomForm: {
    title: string
    description: string
    roomType: string
  }
  uploadedFiles: File[]
  previewUrls: string[]
  base64Files: string[]
  loading: boolean
  createPostLoading: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:createPostTab': [value: CreatePostTab]
  'update:postForm': [value: PostFormData]
  'update:findRoomForm': [value: any]
  'update:uploadedFiles': [value: File[]]
  'update:previewUrls': [value: string[]]
  'update:base64Files': [value: string[]]
  handleCreatePost: [values: any]
  onSubmitFindRoom: [values: any]
  resetPostForm: []
  resetFindRoomForm: []
  handleFileUpload: [event: Event]
  removeFile: [index: number]
}>()

// Validation setup
const { postFormSchema, findRoomSchema } = useValidationSchema()
const validationSchema = toTypedSchema(postFormSchema.value)
const findRoomValidationSchema = toTypedSchema(findRoomSchema.value)

// Form refs
const postFormRef = ref()
const findRoomFormRef = ref()

// Helper functions
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (file: File | undefined) => {
  if (!file) return '📁'
  if (file.type.startsWith('video/')) {
    return '🎥'
  }
  return '📷'
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300 mb-6">
    <div class="card-body p-4 lg:p-6">
      <!-- Tab Navigation -->
      <div role="tablist" class="tabs tabs-bordered w-full border-b border-gray-200 mb-6">
        <a 
          role="tab" 
          @click="$emit('update:createPostTab', 'rent-out')"
          :class="['tab flex-1 text-base font-medium', 
            createPostTab === 'rent-out' ? 'tab-active text-cyan-600 !border-b-cyan-500 !border-b-2' : 'text-gray-600'
          ]"
        >
          {{ $t('post.create.tabs.rentOut') }}
        </a>
        <a 
          role="tab"
          @click="$emit('update:createPostTab', 'find-room')"
          :class="['tab flex-1 text-base font-medium',
            createPostTab === 'find-room' ? 'tab-active text-cyan-600 !border-b-cyan-500 !border-b-2' : 'text-gray-600'
          ]"
        >
          {{ $t('post.create.tabs.findRoom') }}
        </a>
      </div>

      <!-- Form Content -->
      <VeeForm 
        v-if="createPostTab === 'rent-out'"
        ref="postFormRef"
        @submit="emit('handleCreatePost', $event)" 
        :validation-schema="validationSchema"
        :initial-values="postForm"
        v-slot="{ errors, meta }"
        class="space-y-6"
      >
        <!-- Cho thuê trọ form -->
        <div>
          <!-- Khu vực -->
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
            <div class="card-body p-4">
              <h3 class="card-title">{{ $t('post.create.sections.location') }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Tỉnh/thành phố -->
                <div>
                  <VeeField
                    v-slot="{ field, errorMessage }"
                    name="province"
                  >
                    <BaseSelect
                      :model-value="field.value"
                      :name="field.name"
                      @update:model-value="field.onChange"
                      @blur="field.onBlur"
                      :label="$t('post.create.fields.province')"
                      :placeholder="$t('post.create.placeholders.selectProvince')"
                      :required="true"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      :options="[
                        { value: 'hanoi', label: 'Hà Nội' },
                        { value: 'hcm', label: 'TP. Hồ Chí Minh' },
                        { value: 'danang', label: 'Đà Nẵng' }
                      ]"
                      class="w-full !bg-[#E7F0FE] !border-0"
                    />
                  </VeeField>
                </div>

                <!-- Quận/huyện -->
                <div>
                  <VeeField
                    v-slot="{ field, errorMessage }"
                    name="district"
                  >
                    <BaseSelect
                      :model-value="field.value"
                      :name="field.name"
                      @update:model-value="field.onChange"
                      @blur="field.onBlur"
                      :label="$t('post.create.fields.district')"
                      :placeholder="$t('post.create.placeholders.selectDistrict')"
                      :required="true"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      :options="[
                        { value: 'cau-giay', label: 'Cầu Giấy' },
                        { value: 'dong-da', label: 'Đống Đa' },
                        { value: 'ba-dinh', label: 'Ba Đình' }
                      ]"
                      class="w-full !bg-[#E7F0FE] !border-0"
                    />
                  </VeeField>
                </div>
              </div>

              <!-- Phường/xã -->
              <div class="mb-4 w-[48%]">
                <VeeField
                  v-slot="{ field, errorMessage }"
                  name="ward"
                >
                  <BaseSelect
                    :model-value="field.value"
                    :name="field.name"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    :label="$t('post.create.fields.ward')"
                    :placeholder="$t('post.create.placeholders.selectWard')"
                    :required="true"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    :options="[
                      { value: 'dich-vong', label: 'Dịch Vọng' },
                      { value: 'mai-dich', label: 'Mai Dịch' },
                      { value: 'quan-hoa', label: 'Quan Hoa' }
                    ]"
                    class="w-[50%] !bg-[#E7F0FE] !border-0"
                  />
                </VeeField>
              </div>

              <!-- Địa chỉ chính xác -->
              <div>
                <VeeField
                  v-slot="{ field, errorMessage }"
                  name="address"
                >
                  <BaseInput
                    :model-value="field.value"
                    :name="field.name"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    type="text"
                    :label="$t('post.create.fields.address')"
                    :placeholder="$t('post.create.placeholders.enterAddress')"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    class="w-full !bg-[#F7FAFC]"
                  />
                </VeeField>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
            <!-- Loại phòng -->
            <div class="card-body p-4">
              <VeeField
                v-slot="{ field, errorMessage }"
                name="roomType"
              >
                <BaseSelect
                  :model-value="field.value"
                  :name="field.name"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :label="$t('post.create.fields.roomType')"
                  :placeholder="$t('post.create.placeholders.selectRoomType')"
                  :required="true"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                          :options="roomTypeOptions"
                  class="w-full !bg-[#F7FAFC]"
                />
              </VeeField>
            </div>
            <!-- Giá và Diện tích -->
            <div class="card-body p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Giá -->
                <div>
                  <VeeField
                    v-slot="{ field, errorMessage }"
                    name="price"
                  >
                    <BaseInput
                      :model-value="field.value"
                      :name="field.name"
                      @update:model-value="field.onChange"
                      @blur="field.onBlur"
                      type="number"
                      :label="$t('post.create.fields.price')"
                      :placeholder="$t('post.create.placeholders.enterPrice')"
                      :required="true"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      class="w-full !bg-[#F7FAFC]"
                    >
                      <template #subTitle>
                        Triệu/tháng
                      </template>
                    </BaseInput>
                  </VeeField>
                </div>

                <!-- Diện tích -->
                <div>
                  <VeeField
                    v-slot="{ field, errorMessage }"
                    name="area"
                  >
                    <BaseInput
                      :model-value="field.value"
                      :name="field.name"
                      @update:model-value="field.onChange"
                      @blur="field.onBlur"
                      type="number"
                      :label="$t('post.create.fields.area')"
                      :placeholder="$t('post.create.placeholders.enterArea')"
                      :required="true"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      class="w-full !bg-[#F7FAFC]"
                    >
                      <template #subTitle>
                        M2
                      </template>
                    </BaseInput>
                  </VeeField>
                </div>
              </div>
            </div>
          </div>

          <!-- Thông tin mô tả -->
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
            <div class="card-body p-4">  
              <h3 class="card-title">{{ $t('post.create.sections.description') }}</h3>
              <div class="mb-4">
                <VeeField
                  v-slot="{ field, errorMessage }"
                  name="title"
                >
                  <BaseInput
                    :model-value="field.value"
                    :name="field.name"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    type="text"
                    :label="$t('post.create.fields.title')"
                    :placeholder="$t('post.create.placeholders.enterTitle')"
                    :required="true"
                    :maxlength="150"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    class="w-full !bg-[#F7FAFC]"
                  />
                  <ClientOnly>
                    <div class="text-right text-sm text-gray-500 mt-1">
                      {{ postForm.title.length }}/150 ký tự
                    </div>
                  </ClientOnly>
                </VeeField>
              </div>

              <!-- Mô tả -->
              <div class="mb-4">
                <VeeField
                  v-slot="{ field, errorMessage }"
                  name="description"
                >
                  <BaseInput
                    :model-value="field.value"
                    :name="field.name"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                    type="textarea"
                    :label="$t('post.create.fields.description')"
                    :placeholder="$t('post.create.placeholders.enterDescription')"
                    :required="true"
                    :maxlength="5000"
                    :rows="6"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    class="w-full !bg-[#F7FAFC]"
                  />
                  <ClientOnly>
                    <div class="text-right text-sm text-gray-500 mt-1">
                      {{ postForm.description.length }}/5000 ký tự
                    </div>
                  </ClientOnly>
                </VeeField>
              </div>
            </div>
          </div>

          <!-- Thông tin liên hệ -->
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
            <div class="card-body p-4">
              <h3 class="card-title">Thông tin liên hệ</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Tên liên hệ -->
                <div>
                  <VeeField
                    v-slot="{ field, errorMessage }"
                    name="contactName"
                  >
                    <BaseInput
                      :model-value="field.value"
                      :name="field.name"
                      @update:model-value="field.onChange"
                      @blur="field.onBlur"
                      type="text"
                      :label="$t('post.create.fields.contactName')"
                      :placeholder="$t('post.create.placeholders.enterContactName')"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      class="w-full !bg-[#F7FAFC]"
                    />
                  </VeeField>
                </div>

                <!-- Số điện thoại -->
                <div>
                  <VeeField
                    v-slot="{ field, errorMessage }"
                    name="contactPhone"
                  >
                    <BaseInput
                      :model-value="field.value"
                      :name="field.name"
                      @update:model-value="field.onChange"
                      @blur="field.onBlur"
                      type="tel"
                      :label="$t('post.create.fields.contactPhone')"
                      :placeholder="$t('post.create.placeholders.enterContactPhone')"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      class="w-full !bg-[#F7FAFC]"
                    />
                  </VeeField>
                </div>
              </div>
            </div>
          </div>

          <!-- Hình ảnh/video -->
          <div class="card bg-base-100 shadow-sm border border-base-300 mb-2.5">
            <div class="card-body p-4">
              <h3 class="card-title">Hình ảnh/video</h3>
              
              <!-- Upload area -->
              <div class="mb-4">
                <!-- Horizontal layout for upload and previews -->
                <div class="flex flex-wrap gap-4 items-start">
                  <!-- Upload input slot (always first) -->
                  <div class="flex flex-col items-center space-y-2">
                    <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-cyan-400 transition-colors cursor-pointer">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*,video/*"
                        @change="emit('handleFileUpload', $event)"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="text-xs text-gray-500 text-center">
                      Tải ảnh/video
                    </div>
                  </div>
                  
                  <!-- Preview slots for uploaded files -->
                  <div 
                    v-for="(url, index) in previewUrls" 
                    :key="index"
                    class="flex flex-col items-center space-y-2"
                  >
                    <!-- Image/Video container with remove button -->
                    <div class="relative group">
                      <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-cyan-400 transition-all duration-200 shadow-sm hover:shadow-md">
                        <!-- Image preview -->
                        <img 
                          v-if="uploadedFiles[index]?.type.startsWith('image/')"
                          :src="url" 
                          :alt="`Preview ${index + 1}`"
                          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                        <!-- Video preview -->
                        <video 
                          v-else-if="uploadedFiles[index]?.type.startsWith('video/')"
                          :src="url"
                          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          muted
                        />
                        <!-- Fallback -->
                        <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                          <span class="text-2xl">{{ getFileIcon(uploadedFiles[index]) }}</span>
                        </div>
                      </div>
                      
                      <!-- Remove button -->
                      <button
                        @click="emit('removeFile', index)"
                        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                    
                    <!-- File info -->
                    <div class="text-center">
                      <div class="text-xs text-gray-500 font-medium">
                        {{ formatFileSize(uploadedFiles[index]?.size || 0) }}
                      </div>
                      <div class="text-xs text-gray-400 truncate max-w-16">
                        {{ uploadedFiles[index]?.name?.split('.')[0] || 'file' }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Info text -->
                <p class="text-sm text-gray-600 mt-4">
                  Tối đa 5 ảnh/video với tin đăng. Tổng dung lượng không quá 8MB. Chỉ được upload tối đa 1 video.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            class="btn btn-outline text-gray-600 border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
            @click="emit('resetPostForm')"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            type="submit" 
            class="btn bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 order-1 sm:order-2"
            :disabled="loading || createPostLoading || !meta.valid"
          >
            <span v-if="loading || createPostLoading" class="loading loading-spinner loading-sm"></span>
            {{ (loading || createPostLoading) ? $t('post.create.buttons.submitLoading') : $t('post.create.buttons.submit') }}
          </button>
        </div>
      </VeeForm>

      <!-- Form Content -->
      <VeeForm 
        v-if="createPostTab === 'find-room'"
        ref="findRoomFormRef"
        @submit="emit('onSubmitFindRoom', $event)"
        :validation-schema="findRoomValidationSchema"
        :initial-values="findRoomForm"
        v-slot="{ errors, meta, values, setErrors, resetForm }"
        class="space-y-6"
      >
        <!-- Tìm phòng trọ form (có chọn loại phòng) -->
        <div>
          <!-- Thông tin mô tả -->
          <div>
            <h3 class="card-title">Thông tin mô tả</h3>
            
            <!-- Tiêu đề -->
            <div class="mb-4">
              <VeeField
                v-slot="{ field, errorMessage }"
                name="title"
              >
                <BaseInput
                  :model-value="field.value"
                  :name="field.name"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  type="text"
                  :label="$t('post.create.fields.title')"
                  :placeholder="$t('post.create.placeholders.enterTitle')"
                  :required="true"
                  :maxlength="150"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  class="!bg-[#F7FAFC]"
                />
                <ClientOnly>
                  <div class="text-right text-sm text-gray-500 mt-1">
                    {{ values.title?.length || 0 }}/150 ký tự
                  </div>
                </ClientOnly>
              </VeeField>
            </div>

            <!-- Mô tả -->
            <div class="mb-4">
              <VeeField
                v-slot="{ field, errorMessage }"
                name="description"
              >
                <BaseInput
                  :model-value="field.value"
                  :name="field.name"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  type="textarea"
                  :label="$t('post.create.fields.description')"
                  :placeholder="$t('post.create.placeholders.enterDescription')"
                  :required="true"
                  :maxlength="5000"
                  :rows="8"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  class="!bg-[#F7FAFC] min-h-[192px]"
                />
                <ClientOnly>
                  <div class="text-right text-sm text-gray-500 mt-1">
                    {{ values.description?.length || 0 }}/5000 {{ $t('profile.characterCount') }}
                  </div>
                </ClientOnly>
              </VeeField>
            </div>
          </div>

          <!-- Thông tin yêu cầu -->
          <div class="mt-6">
            <h3 class="card-title">{{ $t('post.create.sections.requirements') }}</h3>
            
            <!-- Loại phòng -->
            <div class="mb-4">
              <VeeField
                v-slot="{ field, errorMessage }"
                name="roomType"
              >
                <BaseSelect
                  :model-value="field.value"
                  :name="field.name"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  :label="$t('post.create.fields.roomType')"
                  :placeholder="$t('post.create.placeholders.selectRoomType')"
                  :required="true"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                          :options="roomTypeOptions"
                  class="w-full !bg-[#F7FAFC]"
                />
              </VeeField>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            class="btn btn-outline text-gray-600 border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
            @click="emit('resetFindRoomForm')"
          >
            {{ $t('common.cancel') }}
          </button>
          <button 
            type="submit" 
            class="btn bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 order-1 sm:order-2"
            :disabled="loading || createPostLoading"
          >
            <span v-if="loading || createPostLoading" class="loading loading-spinner loading-sm"></span>
            {{ (loading || createPostLoading) ? $t('post.create.buttons.submitLoading') : $t('post.create.buttons.submit') }}
          </button>
        </div>
      </VeeForm>
    </div>
  </div>
</template>
