import {useSystemStore} from "@/store";
import axios from "axios";
import {getResourceLangFile} from "@/modules/rule-engine-manager-ui/api/channel";

export const useLocales = (protocol: string) => {
    const systemStore = useSystemStore()
    const langJson = ref({})

    const getLangJsonFile = async (_protocol: string, language: string) => {
        try {
            const isDevelopment = import.meta.env.MODE === 'development'

            if (isDevelopment) {
                const resp = await axios.get(`/protocol/${_protocol}//lang/${language}.json`)
                langJson.value = resp.data
            } else {
                const resp = await getResourceLangFile(_protocol, language)
                langJson.value = resp
            }

        } catch (e) {
            langJson.value = {}
        }
    }

    const $lang = (key) => {
        console.log(langJson.value)
        return langJson.value?.[key] || ''
    }

    watch(
        () => [protocol, systemStore.language],
        () => {
            getLangJsonFile(protocol, systemStore.language || 'ch')
        }, {
            deep: true,
            immediate: true,
        }
    )

    return {
        $lang
    }
}
