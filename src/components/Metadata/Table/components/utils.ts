import {randomString} from "@/utils/utils";
import {Ref} from "vue";

let maskIds: string[] = []
export const maskNodeClassName = 'popover-mask'

const bodyHasScrollbar = () => {
    return document.body.scrollHeight > document.body.clientHeight;
};

const updateStyle = (dom: HTMLElement | undefined, style: Record<string, any>) => {
    if (!dom) return

    Object.keys(style).forEach(key => {
        dom.style[key] = style[key]
    })
}

const bodyHidden = () => {
    const hasScrollbar = bodyHasScrollbar()

    if (hasScrollbar) {
        updateStyle(document.body as HTMLElement, {
            overflow: 'hidden',
            width: 'calc(100% - 17px)',
        })
    }
}

const getMaskNode = (id: string, warpClassNames: string) => {
    let maskNode = document.querySelector(`#${id}`) as HTMLElement

    if (maskNode) {
        return maskNode
    }

    maskNode = document.createElement('div')
    maskNode.id = id

    updateStyle(maskNode, {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        'z-index': 1070,
        'background-color': '#0003'
    })

    const warpNode = document.querySelector(`.${warpClassNames}`) as HTMLDivElement
    if (!warpNode) return undefined

    warpNode.insertAdjacentElement('beforebegin', maskNode)

    return maskNode

}

export const useMask = (propVisible: boolean, options: { visibleChange: (visible: boolean) => void }): {
    warpClassNames: string,
    visible: Ref<boolean>,
    hideMask: Function,
    showMask: Function,
    visibleChange: (visible: boolean) => void
} => {
    const key = randomString(6)
    const visible = ref(propVisible)
    const maskDomId = `${maskNodeClassName}-${key}`

    const warpClassNames = `${maskNodeClassName}-warp-${key}`
    const createMask = () => {
        if (!maskIds.includes(maskDomId)) {
            maskIds.push(maskDomId)
        }

        return getMaskNode(maskDomId, warpClassNames)
    }

    const getLastMask = (): HTMLElement | undefined => {
        const index = maskIds.findIndex(key => key === maskDomId) // 当前遮罩层下标
        let dom = undefined
        let lastIndex = 0

        if (maskIds.length > 0) {

            lastIndex = index <= 0 ? 0 : index - 1

            const lastMaskId = maskIds[lastIndex]

            dom = document.querySelector(`#${lastMaskId}`) as HTMLElement
        }

        return dom
    }

    const hideLastMask = () => {
        const lastMaskNode = getLastMask()
        updateStyle(lastMaskNode, {
            display: 'none'
        })
    }

    const showLastMask = () => {
        const lastMaskNode = getLastMask()
        updateStyle(lastMaskNode, {
            display: 'block'
        })
    }

    const showMask = () => {
        bodyHidden()
        setTimeout(() => {
            hideLastMask()
            const maskNode = createMask()
            updateStyle(maskNode, {
                display: 'block'
            })
        }, 150)
    }

    const hideMask = () => {
        const maskNode = createMask()
        showLastMask()

        const index = maskIds.findIndex(key => key === maskDomId) // 当前遮罩层下标

        maskIds.splice(index, 1)
        if (index === 0) {
            document.body.style = ''
            maskIds = []
        }

        updateStyle(maskNode, {
            display: 'none'
        })
    }

    const visibleChange = (v: boolean) => {
        visible.value = v
        options?.visibleChange(v)
        if (v) {
            showMask()
        } else {
            hideMask()
        }
    }

    return {
        warpClassNames,
        visible,
        hideMask,
        showMask,
        visibleChange
    }
}


export const BooleanValueMap = () => ({
    trueText: '是',
    trueValue: 'true',
    falseText: '否',
    falseValue: 'false',
})
