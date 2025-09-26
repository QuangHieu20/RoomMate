<script setup lang="ts">
import {ref} from 'vue';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide} from 'vue3-carousel'

interface CarouselImage {
  src: string
  alt: string
}

interface Props {
  images: CarouselImage[]
  autoPlay?: number
  autoPlayInterval?: number
  itemsToShow?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: 0,
  autoPlayInterval: 3000,
  itemsToShow: 5
})

const config = {
  height: 200,
  itemsToShow: 3.5, // Hiển thị 3 items đầy đủ + 0.5 item để tạo hiệu ứng peek
  gap: 16, 
  autoplay: props.autoPlay,
  wrapAround: false,
  pauseAutoplayOnHover: true,
}
const currentSlide = ref(0)
const carouselRef = ref()

</script>
<template>
  <div class="carousel-container w-full">
    <!-- Vue3 Carousel -->
    <Carousel 
      ref="carouselRef"
      v-bind="config"
      class="carousel w-full  overflow-hidden"
      @update:current-slide="currentSlide = $event"
    >
      <Slide 
        v-for="(image, index) in images" 
        :key="index"
        class="carousel-item"
      >
        <div class="relative h-[400px] w-full">
          <img 
            :src="image.src" 
            :alt="image.alt"
            class="w-full h-full object-cover"
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
}

.carousel {
  position: relative;
}

.carousel-item {
  padding: 0;
  border-radius: 8px; /* Bo góc cho đẹp hơn */
  overflow: hidden;
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
img {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

img:hover {
  transform: scale(1.02);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .carousel-item {
    border-radius: 6px;
  }
  
  img {
    height: 250px;
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

/* Đảm bảo hiệu ứng peek hoạt động tốt trên các kích thước màn hình */
@media (max-width: 480px) {
  .carousel-container {
    margin: 0 -16px; /* Mở rộng container để peek effect rõ hơn */
  }
}
</style>
