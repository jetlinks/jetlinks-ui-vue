export const useAction = (target: any) => {

    const addAction = (data: any, index?: number) => {
        console.log(target, index)
        target.value?.addItem?.(data, index)
    }

    const copyAction = (data: any, index: number) => {
        console.log(target)
        addAction(data, index)
    }

    const removeAction = (index: number) => {
        console.log(target)
        target.value?.removeItem?.(index)
    }

    return {
        addAction,
        copyAction,
        removeAction
    }
}