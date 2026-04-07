<script setup>
import {inject, ref} from "vue";

const pointColumns = inject("point-extra-columns", ref([]))
pointColumns.value = [
  {
    // key是标识, dataIndex用于获取数据
    title: '寄存器数量',
    dataIndex: ['configuration', 'parameter', 'quantity'],
    key: 'quantity',
    ellipsis: true,
    width: 100,
  },
  {
    title: '缩放因子',
    dataIndex: ['managedConfiguration', 'converter', 'configuration', 'factor'],
    key: 'factor',
    // scopedSlots: true,
    width: 200,
  },
  {
    title: '小数保留位',
    dataIndex: ['managedConfiguration', 'converter', 'configuration', 'scale'],
    key: 'scale',
    // scopedSlots: true,
    ellipsis: true,
    width: 100,
  },
]
</script>
