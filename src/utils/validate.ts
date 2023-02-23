/**
 * 座机号+手机号校验
 * @param value
 * @returns {boolean}
 */
export const phoneRegEx = (value: string) => {
    const phone = new RegExp('^(((\\+86)|(\\+86-))|((86)|(86\\-))|((0086)|(0086\\-)))?1[3|5|7|8]\\d{9}$')
    const mobile = /(0[0-9]{2,3})([2-9][0-9]{6,7})+([0-9]{8,11})?$/
    return phone.test(value) || mobile.test(value)
}