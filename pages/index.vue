<script setup lang="ts">
// 重定向到博客列表页
definePageMeta({
  middleware: [
    function(to) {
      return navigateTo('/blog');
    }
  ]
});
</script> 