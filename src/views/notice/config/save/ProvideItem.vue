<template>
  <div>
    <a-form-item
      v-for="item in showData"
      :key="item.property"
      :label="item.name"

    >
      <template v-if="showType(item.type) === 'isnp'">
        <a-input
          v-decorator="[`configuration.${item.property}`, {
          }]"
        />
      </template>
      <template v-if="showType(item.type) === 'array'">
        <a-card v-if="item.properties && item.properties === 'properties'">
          <a-row v-for="ele in OtherConfig(item.type)" :key="ele.id">
            <a-col>
              <!-- 没有具体数据占位 -->
            </a-col>
          </a-row>
        </a-card>
      </template>
    </a-form-item>
  </div>
</template>

<script>
  /* eslint-disable no-unreachable */
  export default {
    name: 'ConfigProvideItem',
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      showData () {
        return this.data.properties
      },
      showType (type) {
        return function ({ type }) {
          switch (type) {
            case 'int':
            case 'string':
            case 'number':
            case 'password':
              return 'isnp' // 类型首字母简写
              break
            case 'array':
              return 'array' // 类型首字母简写
              break
            default:
              break
          }
        }
      },
      OtherConfig (typeData) {
        return function (typeData) {
          return typeData.elementType
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
