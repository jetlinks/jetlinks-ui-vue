import {randomNumber} from "@jetlinks-web/utils";

export const defaultTermsValue = () => {
  return JSON.parse(JSON.stringify({
    type: 'and',
    column: undefined,
    termType: undefined,
    value: {
      source: 'fixed',
      value: undefined
    },
    key: randomNumber()
  }))
}
