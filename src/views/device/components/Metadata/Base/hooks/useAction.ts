export const useAction = (target: any) => {

    const addAction = (data: any, index?: number) => {
        target.value?.addItem?.(data, index)
        console.log(target)
    }

    const copyAction = (data: any, index: number) => {
        console.log(target)
        addAction(data, index + 1)
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