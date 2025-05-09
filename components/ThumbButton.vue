<template>
  <div class="thumb-button">
    <el-button
      :type="hasThumb ? 'primary' : 'default'"
      :disabled="!userStore.isLoggedIn || thumbStore.loading"
      :icon="hasThumb ? 'Thumb' : 'Thumb'"
      size="small"
      circle
      @click.stop="handleThumbClick"
    />
    <transition name="count-fade">
      <span v-if="count" class="count" :class="{ 'is-active': hasThumb }">{{ count }}</span>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useThumbStore } from '~/stores/thumb';

// 接收Props
const props = defineProps<{
  blogId: number;
  hasThumb: boolean;
  count?: number;
}>();

const userStore = useUserStore();
const thumbStore = useThumbStore();

// 本地点赞状态，用于立即响应UI变化
const localHasThumb = ref(props.hasThumb);
const localCount = ref(props.count || 0);

// 当props变化时，更新本地状态
watch(() => props.hasThumb, (newVal) => {
  localHasThumb.value = newVal;
});

watch(() => props.count, (newVal) => {
  if (newVal !== undefined) {
    localCount.value = newVal;
  }
});

// 计算属性：显示的点赞数
const count = computed(() => localCount.value || '');

// 处理点赞/取消点赞
const handleThumbClick = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (!userStore.isLoggedIn || thumbStore.loading) {
    return;
  }

  try {
    if (localHasThumb.value) {
      // 先更新UI状态
      localHasThumb.value = false;
      if (localCount.value > 0) {
        localCount.value--;
      }
      // 发送取消点赞请求
      await thumbStore.cancelThumb(props.blogId);
    } else {
      // 先更新UI状态
      localHasThumb.value = true;
      localCount.value++;
      // 发送点赞请求
      await thumbStore.doThumb(props.blogId);
    }
  } catch (error) {
    console.error('点赞操作失败', error);
    // 如果请求失败，恢复原来的状态
    localHasThumb.value = props.hasThumb;
    localCount.value = props.count || 0;
  }
};
</script>

<style lang="scss" scoped>
.thumb-button {
  display: inline-flex;
  align-items: center;
  
  .count {
    margin-left: 4px;
    font-size: 14px;
    color: #909399;
    transition: all 0.3s;
    
    &.is-active {
      color: var(--el-color-primary);
      font-weight: bold;
    }
  }
}

.count-fade-enter-active,
.count-fade-leave-active {
  transition: all 0.3s;
}

.count-fade-enter-from,
.count-fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style> 