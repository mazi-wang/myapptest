import { useState, useCallback, useEffect } from "react"
import { message } from "antd"
import { getServiceListAPI, delServiceListAPI } from "@/apis/shop"

export const useServiceTable = (initialSearchParams?: { userId?: string }) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [loading, setLoading] = useState(false)

    // * 搜索参数
    const [searchParams, setSearchParams] = useState<{ userId?: string }>(initialSearchParams || {})

    const fetchDataFromAPI = async ({
        current,
        pageSize,
        ...rest
    }: {
        current: number
        pageSize: number
        userId?: string
        serviceTime?: string
    }) => {
        setLoading(true)

        const requestData: { current: number; pageSize: number; data: { userId?: string } } = {
            current: current,
            pageSize: pageSize,
            data: rest,
        }

        try {
            const result = await getServiceListAPI(requestData)

            if (result.code !== 200) {
                message.error(result.message)
                return {
                    success: false,
                    data: [],
                }
            }

            const { current, pageSize, total, data } = result.data

            setPagination({
                current,
                pageSize,
                total,
            })

            console.log({
                success: true,
                data,
                total,
            })
            return {
                success: true,
                data,
                total,
            }
        } catch (error) {
            message.error("获取数据失败")
            return {
                success: false,
                data: [],
            }
        } finally {
            setLoading(false)
        }
    }

    const deleteService = async (id: string, action: any) => {
        const res = await delServiceListAPI({ id })
        if (res.code === 200) {
            message.success("删除成功")
            action.reload()
        } else {
            message.error("删除失败")
        }
    }

    return { pagination, loading, fetchDataFromAPI, deleteService, searchParams, setSearchParams }
}
