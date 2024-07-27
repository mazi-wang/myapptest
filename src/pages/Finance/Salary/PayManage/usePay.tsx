import { useState, useCallback, useEffect } from "react"
import { message } from "antd"
import { getPayListAPI, delPayAPI } from "@/apis/pay"
import type { GetPayList, GetPayType, EmployeeCompensation } from "@/apis/pay"
import { set } from "lodash"
import { user } from "@/service/ant-design-pro/api"

export type ModalConfig = {
    data?: EmployeeCompensation
    isOpen: boolean
    isLoading: boolean
    type: "add" | "edit"
}
export type OnDeleteFn = (id: string, action: any) => Promise<void>
export type ChangeModalFn = ({ data, isOpen, isLoading }: ModalConfig) => void

// * This function is used to handle the form submission
async function handleFinish(
    values: EmployeeCompensation,
    formRef: React.RefObject<ProFormInstance<EmployeeCompensation>>
) {
    const result = await addPayAPI(values)

    if (result.code === 200) {
        message.success("添加成功")
        formRef.current?.resetFields()
    } else {
        message.error("添加失败")
    }
}

export const useTable = (initialSearchParams?: any, setInitialParams: any) => {
    const [modifyConfig, setModifyConfig] = useState<ModalConfig>({
        isOpen: false,
        isLoading: false,
        type: "add",
    })
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [loading, setLoading] = useState(false)

    // * 默认搜索参数
    //   const [searchParams] = useState<any>(initialSearchParams || {})

    const fetchDataFromAPI = async ({ current, pageSize, ...rest }) => {
        setLoading(true)

        setInitialParams((currValues: any) => ({
            ...currValues,
            user_id: rest?.userId || currValues.user_id,
            dateMonth: rest?.date || currValues.dateMonth,
        }))

        const requestData: GetPayList = {
            current,
            pageSize,
            data: {
                userId: rest?.userId || rest.initialParams.user_id,
                date: rest?.date || rest.initialParams.dateMonth,
            },
        }

        console.log(rest)

        try {
            const result = await getPayListAPI(requestData)

            if (result.code !== 200) throw new Error("请求失败")

            const { current, pageSize, total, data } = result.data

            setPagination({
                current,
                pageSize,
                total,
            })

            return {
                success: true,
                data,
                total,
            }
        } catch (error) {
            console.log("error", error)
            return {
                data: [],
            }
        } finally {
            setLoading(false)
        }
    }

    const onDeleteFn: OnDeleteFn = async (id, action) => {
        const res = await delPayAPI({ id })
        if (res.code === 200) {
            message.success("删除成功")
            action.reload()
        }
    }

    const changeModal: ChangeModalFn = ({ data, isOpen, isLoading, type }) => {
        setModifyConfig((prevModifyConfig) => ({
            ...prevModifyConfig,
            isOpen,
            data: data || prevModifyConfig.data,
            isLoading: isLoading || prevModifyConfig.isLoading,
            type: type || prevModifyConfig.type,
        }))
    }

    return {
        pagination,
        loading,
        fetchDataFromAPI,
        onDeleteFn,
        modifyConfig,
        changeModal,
    }
}
