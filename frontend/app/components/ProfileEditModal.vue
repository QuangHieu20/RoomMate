<script setup lang="ts">
import {ref, reactive, watch, computed} from 'vue'
import {toTypedSchema} from '@vee-validate/yup'
import Button from '~/components/base/Button.vue'
import BaseInput from '~/components/base/Input.vue'
import Modal from '~/components/base/Modal.vue'
import CoverPhotoUpload from '~/components/forms/CoverPhotoUpload.vue'
import {useDebounceAsync} from '~/composables/useDebounce'
import {useApi} from '~/composables/useApi'
import {useValidationSchema} from '~/composables/useValidation'
import type {UserResponseUpdateProfile} from "~/types";
import {setLocalStorage} from "~/ultils/localStorage";

interface Props {
  show: boolean
  initialData: {
    fullName: string
    email: string
    phone: string
    coverPhoto?: string | null
  }
}

interface UserUpdateInfoDto {
  fullName: string,
  phone: string,
  coverPhoto?: File | null
}


const emit = defineEmits<{
  close: []
  update: [data: { fullName: string; phone: string; coverPhoto?: File | null }]
}>()

const props = defineProps<Props>()

const {post} = useApi()
const {createProfileEditSchemaWithPhoneCheck} = useValidationSchema()
const coverPhoto = ref<File | null>(null)
const initialCoverPhotoUrl = ref<string | null>(null)
const loading = ref(false)

// Form data reactive object
const formData = reactive({
  fullName: '',
  phone: ''
})


// Custom validation function for phone exists
const checkPhoneExists = async (phone: string): Promise<boolean> => {
  if (!phone || phone === props.initialData.phone) {
    return false // Don't check if empty or same as current phone
  }

  try {
    const exists = await post<boolean>('/users/check-exists-phone', {phone})
    return exists
  } catch (error) {
    console.error('Error checking phone exists:', error)
    return false
  }
}

// Debounced phone check
const debouncedPhoneCheck = useDebounceAsync(checkPhoneExists, 500)

// Enhanced validation schema with phone exists check
const validationSchema = computed(() => {
  const schemaWithPhoneCheck = createProfileEditSchemaWithPhoneCheck(debouncedPhoneCheck, formData.phone)
  return toTypedSchema(schemaWithPhoneCheck.value)
})


watch(
    () => props.initialData,
    (newData) => {
      if (newData) {
        initialCoverPhotoUrl.value = newData.coverPhoto || null
      }
    },
    {immediate: true, deep: true}
)

watch(
    () => props.show,
    (isShow) => {
      if (isShow && props.initialData) {
        // Update form data khi modal mở
        formData.fullName = props.initialData.fullName || '';
        formData.phone = props.initialData.phone || '';
        initialCoverPhotoUrl.value = props.initialData.coverPhoto || null;
      }
    },
    {immediate: true}
);


// Xử lý submit form
const onSubmit = async (values: UserUpdateInfoDto) => {
  loading.value = true;
  try {
    // Tạo đối tượng FormData
    const formData = new FormData();

    // Map dữ liệu từ values vào FormData
    formData.append('fullName', values.fullName)
    formData.append('phone', values.phone)
    if (coverPhoto.value instanceof File) {
      formData.append('coverPhoto', coverPhoto.value);
    }

    await post<UserResponseUpdateProfile>('/users/update-user-info', formData).then((res) => {
      if (res.success) {
        setLocalStorage('userInfo', res.data);
        loading.value = false;
        emit('close')
      }
    })
  } finally {
    loading.value = false;
  }
};
const handleCoverPhotoUpload = (file: File) => {
  coverPhoto.value = file
}

const handleClose = () => {
  // Reset form when modal closes
  coverPhoto.value = null
  emit('close')
}
</script>

<template>
  <Modal
      :title="'Chỉnh sửa thông tin'"
      :isOpen="show"
      size="sm"
      @close="handleClose">
    <div class="w-full max-w-md mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <p class="text-sm text-center text-gray-500 mt-1">Cập nhật thông tin cá nhân của bạn</p>
      </div>
      <!-- Form -->
      <VeeForm :validation-schema="validationSchema"
               :initial-values="formData"
               @submit="onSubmit"
               class="space-y-6">
        <!-- Avatar start -->
        <CoverPhotoUpload
            v-model="coverPhoto"
            :max-size="5"
            :initial-image-url="initialCoverPhotoUrl"
            @upload="handleCoverPhotoUpload"/>
        <!-- Avatar end -->
        <!-- Full Name -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          <VeeField v-slot="{ field, errorMessage }" name="fullName">
            <BaseInput
                :model-value="field.value"
                :name="field.name"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
                type="text"
                placeholder="Nhập họ và tên"
                :error="!!errorMessage"
                :error-message="errorMessage"
                class="w-full"
            />
          </VeeField>
        </div>

        <!-- Email (Read-only) -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <BaseInput
              :model-value="props.initialData.email"
              type="email"
              disabled
              class="w-full"
          />
        </div>

        <!-- Phone -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <VeeField v-slot="{ field, errorMessage }" name="phone">
            <BaseInput
                :model-value="field.value"
                :name="field.name"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
                type="tel"
                placeholder="Nhập số điện thoại"
                :error="!!errorMessage"
                :error-message="errorMessage"
                class="w-full"
            />
          </VeeField>
        </div>

        <!-- Actions -->
        <div class="flex flex-col justify-end sm:flex-row gap-3 pt-4">
          <Button type="button" variant="error" size="md" @click="handleClose" class="w-full sm:w-auto">
            Hủy
          </Button>
          <Button type="submit" variant="info" size="md" :loading="loading" :disabled="loading"
                  class="w-full sm:w-auto">
            {{ loading ? 'Đang cập nhật...' : 'Cập nhật' }}
          </Button>
        </div>
      </VeeForm>
    </div>
  </Modal>
</template>
