<template>
  <a-form-item
    :label="$t('Date.Item.884272-0')"
    required
    :name="name"
    :rules="[
      {
        required: true,
        message: $t('Date.Item.884272-1'),
      },
    ]"
  >
    <j-auto-complete
      v-model:value="date"
      :options="options"
      :placeholder="$t('Date.Item.884272-1')"
      :dropdownStyle="{ zIndex: 1072 }"
      :getPopupContainer="(node) => tableWrapperRef || node"
      @change="change"
      :multiple='false'
    />
  </a-form-item>
</template>

<script setup name="MetadataDateItem">
import { useTableWrapper } from "../../context";

const props = defineProps({
  value: {
    type: String,
    default: undefined,
  },
  name: {
    type: String,
    default: "format",
  },
});

const emit = defineEmits(["update:value"]);

const options = [
  { label: "yyyy-MM-dd HH:mm:ss", value: "yyyy-MM-dd HH:mm:ss" },
  { label: "yyyy-MM-dd", value: "yyyy-MM-dd" },
  { label: "HH:mm:ss", value: "HH:mm:ss" },
];

const date = ref(props.value);

const tableWrapperRef = useTableWrapper();
const change = () => {
  emit("update:value", date.value);
};

watch(
  () => props.value,
  () => {
    date.value = props.value;
  }
);
</script>

<style scoped></style>
