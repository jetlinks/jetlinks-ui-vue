<template>
  <img v-if="avatarUrl" :src="avatarUrl" />
  <div v-else class="avatar">
    {{ initials }}
  </div>
</template>

<script setup name="JAvatar">
const props = defineProps({
  name: {
    type: String,
    default: ""
  },
  avatarUrl: {
    type: String,
    default: ""
  },
});

const initials = computed(() => {
  const name = props.name || "";
  const length = name.length;
  return length > 0 ? name.slice(0, 1) : name; // 取姓名后两位作为头像显示
});
</script>

<style scoped lang="less">
img {
  width: 100%;
}
.avatar {
  font-size: 1.125rem;
  color: @font-gray-900;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: @font-gray-300;
  border-radius: .375rem;
}
</style>
