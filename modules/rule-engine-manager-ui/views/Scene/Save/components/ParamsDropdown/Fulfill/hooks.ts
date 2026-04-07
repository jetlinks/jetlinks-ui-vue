export const useMouseEvent = (showDeleteBtn: Ref<boolean>) => {
  const show = ref(false)

  const mouseover = () => {
    if (showDeleteBtn.value) {
      show.value = true;
    }
  };

  const mouseout = () => {
    if (showDeleteBtn.value) {
      show.value = false;
    }
  };

  return {
    mouseover,
    mouseout,
    show
  }
}

const aggKey = Symbol('aggregation-options')
const columnKey = Symbol('column-options')
const dataKey = Symbol('fulfill-data')

export const useAggContext = (data: Ref<any>) =>{
  provide(aggKey, data || [])
}

export const useAggOptions = () => {
  return inject(aggKey, [])
}

export const useColumnContext = (data: Ref<any>) =>{
  provide(columnKey, data || [])
}

export const useColumnOptions = () => {
  return inject(columnKey, [])
}

export const useFulfillDataContext = (data: Ref<any>) =>{
  provide(dataKey, data || [])
}

export const useFulfillData = () => {
  return inject(dataKey, [])
}
