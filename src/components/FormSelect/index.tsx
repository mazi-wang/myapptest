import { ProFormSelect } from "@ant-design/pro-components"
import { debounce } from "lodash"
import request from "@/utils/request"
import type { Rule } from "antd/lib/form"

interface ResultType {
    id: string
    name: string
}

interface ResponseData {
    code: number
    data: ResultType[]
    message: boolean
}

const requestBase = {
    user: { params: "username", link: "/user/select" },
    sell: { params: "name", link: "/sell/select" },
    station: { params: "name", link: "/station/select" },
    article: { params: "name", link: "/article/select" },
    ditch: { params: "name", link: "/ditch/select" },
    store: { params: "name", link: "/store/select" },
}

export async function switchSelectFetchFn(
    type: keyof typeof requestBase,
    searchValue: string
): Promise<{ label: string; value: string }[]> {
    const req = requestBase[type]
    try {
        const res: ResponseData = await request(req.link, {
            method: "POST",
            data: searchValue ? { [req.params]: searchValue } : {},
        })

        if (res.code !== 200) throw new Error(res.message.toString())

        return res.data.map((item) => ({ label: item.name, value: item.id }))
    } catch (error) {
        console.log("error: ", error)
        return []
    }
}

export async function switchSelectNameFetchFn(
    type: keyof typeof requestBase,
    searchValue: string
): Promise<{ label: string; value: string }[]> {
    const req = requestBase[type]
    try {
        const res: ResponseData = await request(req.link, {
            method: "POST",
            data: searchValue ? { [req.params]: searchValue } : {},
        })

        if (res.code !== 200) throw new Error(res.message.toString())

        return res.data.map((item) => ({ label: item.name, value: item.name, key: item.id }))
    } catch (error) {
        console.log("error: ", error)
        return []
    }
}

export const switchSelectFetchDebounce = debounce(switchSelectFetchFn, 500, {
    leading: true,
})

interface UserSelectProps {
    name: string
    label: string
    type: keyof typeof requestBase
    rules?: Rule[]
    onChangeCallBack?: ({ label, value }: { label: string; value: string }) => void
}

export function MyFormSelect({
    name = "userId",
    label = "选择用户",
    type = "user",
    rules,
    onChangeCallBack,
}: UserSelectProps) {
    // const selectFetchDebounce = debounce(switchSelectFetchFn, 500, {
    //     leading: true,
    // })

    return (
        <>
            <ProFormSelect
                name={name}
                label={label}
                fieldProps={{
                    showSearch: true,
                    filterOption: false,
                    onChange: (value, option) => {
                        onChangeCallBack?.(option["data-item"])
                    },
                }}
                debounceTime={300}
                request={async (params) => await switchSelectFetchFn(type, params.keyWords)}
                rules={rules || ([{ required: true, message: `请选择${label}` }] as any)}
            />
        </>
    )
}
