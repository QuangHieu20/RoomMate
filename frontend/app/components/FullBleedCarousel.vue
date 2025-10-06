<script setup lang="ts">
import { ref } from 'vue';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';

interface CarouselImage {
  src: string;
  alt: string;
  mediaType?: 'image' | 'video';
}

interface Props {
  images: CarouselImage[];
  autoPlay?: number;
  autoPlayInterval?: number;
  itemsToShow?: number;
  wrapAround?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: 0,
  autoPlayInterval: 3000,
  itemsToShow: 5,
  wrapAround: false,
});

const config = {
  height: 200,
  itemsToShow: props.itemsToShow, // Sử dụng prop thay vì hardcode
  gap: 16,
  autoplay: props.autoPlay,
  wrapAround: props.wrapAround, // Sử dụng prop thay vì hardcode
  pauseAutoplayOnHover: true,
  snapAlign: 'start' as const, // Đảm bảo slide bắt đầu từ trái
  // Luôn giữ nguyên kích thước slide, không fullwidth
  settings: {
    itemsToShow: props.itemsToShow,
    snapAlign: 'start' as const,
  },
  breakpoints: {
    320: {
      itemsToShow: Math.min(props.itemsToShow, 1),
      snapAlign: 'start' as const,
    },
    768: {
      itemsToShow: Math.min(props.itemsToShow, 2),
      snapAlign: 'start' as const,
    },
    1024: {
      itemsToShow: props.itemsToShow,
      snapAlign: 'start' as const,
    },
  },
};
const currentSlide = ref(0);
const carouselRef = ref();
</script>
<template>
  <div
    class="carousel-container w-full"
    :style="{ '--items-to-show': props.itemsToShow }"
  >
    <!-- Vue3 Carousel -->
    <Carousel
      ref="carouselRef"
      v-bind="config"
      class="carousel w-full overflow-hidden"
      @update:current-slide="currentSlide = $event"
    >
      <Slide
        v-for="(image, index) in images"
        :key="index"
        class="carousel-item"
      >
        <div class="relative h-[200px] w-full flex items-center justify-center">
          <!-- Video element -->
          <video
            v-if="image.mediaType === 'video'"
            :src="image.src"
            :alt="image.alt"
            class="max-w-full max-h-full object-contain rounded-xl"
            style="
              filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.1));
              backdrop-filter: blur(1px);
            "
            controls
            preload="metadata"
            draggable="false"
          />
          <!-- Image element -->
          <img
            v-else
            :src="image.src"
            :alt="image.alt"
            class="max-w-full max-h-full object-contain rounded-xl"
            style="
              filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.1));
              backdrop-filter: blur(1px);
            "
            draggable="false"
          />
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<style scoped>
.carousel-container {
  position: relative;
  overflow: hidden; /* Ẩn phần thừa của item peek */
  width: 100%;
}

.carousel {
  position: relative;
}

.carousel-item {
  padding: 0;
  border-radius: 8px; /* Bo góc cho đẹp hơn */
  overflow: hidden;
  flex-shrink: 0; /* Không cho phép co lại */
  width: calc(
    100% / var(--items-to-show, 3.5)
  ); /* Cố định width theo itemsToShow */
  max-width: calc(
    100% / var(--items-to-show, 3.5)
  ); /* Không cho phép mở rộng */
}

/* Khi chỉ có 1 ảnh, width tự động theo kích thước ảnh nhưng max 250px */
.carousel-item:only-child {
  max-width: 250px;
  width: auto; /* Tự động theo kích thước ảnh */
  height: 200px; /* Giữ nguyên height */
}

/* Ảnh trong slide đơn lẻ có thể resize theo kích thước thật */
.carousel-item:only-child img {
  max-width: 250px;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Responsive cho mobile - 1 ảnh vẫn full width trên mobile */
@media (max-width: 768px) {
  .carousel-item:only-child {
    max-width: 100%;
    width: 100%;
  }
}

/* Custom styling for vue3-carousel navigation */
:deep(.carousel__prev),
:deep(.carousel__next) {
  background: rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background: rgba(0, 0, 0, 0.4);
}

:deep(.carousel__prev) {
  left: 16px;
}

:deep(.carousel__next) {
  right: 16px;
}

/* Custom styling for pagination dots */
:deep(.carousel__pagination) {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

:deep(.carousel__pagination-button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  transition: all 0.3s ease;
}

:deep(.carousel__pagination-button--active) {
  background: white;
}

/* Smooth transitions */
img,
video {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    box-shadow 0.3s ease,
    filter 0.3s ease,
    backdrop-filter 0.3s ease;
}

img:hover,
video:hover {
  transform: scale(1.02);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.15))
    drop-shadow(0 0 6px rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .carousel-item {
    border-radius: 6px;
  }

  img {
    height: 250px;
    border-radius: 12px; /* Bo tròn nhẹ hơn trên mobile */
  }

  :deep(.carousel__prev),
  :deep(.carousel__next) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  :deep(.carousel__prev) {
    left: 8px;
  }

  :deep(.carousel__next) {
    right: 8px;
  }
}

/* Đảm bảo carousel bắt đầu từ trái */
:deep(.carousel__track) {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

:deep(.carousel__slide) {
  flex-shrink: 0;
  width: auto;
  max-width: calc(100% / var(--items-to-show, 3.5)); /* Giới hạn width */
}

/* Đảm bảo slide không bao giờ fullwidth */
:deep(.carousel__slide) {
  flex: 0 0 calc(100% / var(--items-to-show, 3.5)); /* Cố định flex-basis */
  max-width: calc(100% / var(--items-to-show, 3.5)); /* Giới hạn max-width */
}

/* Đảm bảo hiệu ứng peek hoạt động tốt trên các kích thước màn hình */
@media (max-width: 480px) {
  .carousel-container {
    margin: 0 -16px; /* Mở rộng container để peek effect rõ hơn */
  }
}
</style>
