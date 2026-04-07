export const createScript = (src: string) => {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.onload = () => {
            resolve(true)
        }
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', src)
        document.body.appendChild(script)
    })
}