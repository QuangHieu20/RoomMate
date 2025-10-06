<template>
  <div v-if="show" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Chỉnh sửa thông tin</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Full Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Họ và tên</span>
          </label>
          <input
            v-model="form.fullName"
            type="text"
            class="input input-bordered"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <!-- Email (Read-only) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            class="input input-bordered bg-base-200"
            disabled
          />
        </div>

        <!-- Phone -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Số điện thoại</span>
          </label>
          <input
            v-model="form.phone"
            type="tel"
            class="input input-bordered"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button type="button" @click="$emit('close')" class="btn btn-ghost">
            Hủy
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Đang cập nhật...' : 'Cập nhật' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  initialData: {
    fullName: string;
    email: string;
    phone: string;
  };
}

interface Emits {
  (e: 'close'): void;
  (e: 'update', data: { fullName: string; phone: string }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Form data
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
});

// UI state
const loading = ref(false);

// Watch for prop changes
watch(
  () => props.initialData,
  newData => {
    if (newData) {
      form.fullName = newData.fullName;
      form.email = newData.email;
      form.phone = newData.phone;
    }
  },
  { immediate: true }
);

// Handle form submission
const handleSubmit = async () => {
  loading.value = true;

  try {
    emit('update', {
      fullName: form.fullName,
      phone: form.phone,
    });
  } finally {
    loading.value = false;
  }
};
</script>
