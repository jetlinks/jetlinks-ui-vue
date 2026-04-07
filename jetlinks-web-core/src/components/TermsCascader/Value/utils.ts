export const ValueProps = () => ({
  showValueType: {
    type: Boolean,
    default: true,
  },
  builtinOptions: {
    type: Array,
    default: () => []
  },
  builtinOptionsMap: {
    type: Map,
    default: () => new Map()
  },
  fieldNames: {
    type: Object,
    default: () => ({
      valueSource: 'source'
    })
  },
  typeOptionsNames: {
    type: Object,
    default: () => ({})
  }
})
