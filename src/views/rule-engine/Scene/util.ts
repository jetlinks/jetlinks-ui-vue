import type {ActionBranchesProps} from "./typings";
import {isArray} from "lodash-es";

export const handleGroup = (branches: ActionBranchesProps[]) => {
    let group: Array<Array<ActionBranchesProps | null>> = []

    branches.forEach((item) => {
        const lastIndex = group.length - 1
        if (item?.executeAnyway) {
            group[lastIndex] = [item]
        } else {
            if (isArray(group[lastIndex])) {
                group[lastIndex].push(item)
            } else {
                group[lastIndex] = [item]
            }
        }
    })

    // 判断每组末尾是否有数据并且when有值
    if (group.length) {
        group = group.map(item => {
            if (item.length && item[item.length -1]?.when?.length) {
                item.push(null)
            }
            return item
        })
    } else {
        group[0] = [null]
    }

    return group
}



export const groupToArray = (branchesGroup: Array<ActionBranchesProps[]>) => {
    const arr:ActionBranchesProps[] = []

    branchesGroup.forEach(item => {

    })
}
