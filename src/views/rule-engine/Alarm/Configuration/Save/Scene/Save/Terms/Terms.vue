<template>
  <div class="terms-warp">
    <j-scrollbar>
      <div class="terms-content">
          <div class="terms-group" v-for="(group, index) in when.terms">

            <div v-if="group.termType && index !== 0" class="dropdown-button type">
              {{ group.termType }}
            </div>
            <div class="terms-group-content" :class="{'group-content-border': border, 'group-content-bg': !border}">
              <WhenItem v-for="(item, groupIndex) in group.terms" :type="item.termType" :value="item" :showType="groupIndex !== 0" />
            </div>
          </div>
      </div>
    </j-scrollbar>
  </div>
</template>

<script setup name="Terms">
import WhenItem from "./WhenItem.vue";

const props = defineProps({
  when: {
    type: Object,
    default: () => ({})
  },
  border: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped lang="less">
.terms-warp {
  flex: 1 1 0;
  min-width: 0;
}

.terms-content {
  display: flex;
  gap: 12px;
}

.terms-group {
  display: flex;
  gap: 8px;
  align-items: center;

  .terms-group-content {
    position: relative;
    display: flex;
    padding: 8px 8px;
    row-gap: 16px;
    border-radius: 6px;

    &.group-content-border {
      border: 1px dashed #e0e0e0;
    }

    &.group-content-bg {
      background-color: #fafafa;
    }
  }
}

.dropdown-button {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;

  &.type {
    padding: 5px 10px;
    height: 36px;
  }
}
</style>
