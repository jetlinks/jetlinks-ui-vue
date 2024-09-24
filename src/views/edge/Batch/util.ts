export const ContentName = Symbol('Batch-Task')
export const getContent = () => {
    return inject(ContentName, {})
}
