import { useState } from "react"
import { message } from "antd"

interface PageReq<T> {
    current: number
    pageSize: number
    data: T | {}
}

interface ApiResponse<T> {
    code: number
    message: string
    data: {
        total: number
        data: T[]
        current: number
        pageSize: number
    }
}

type TableRequestParams = {
    current?: number
    pageSize?: number
}

interface FetchListApi<T, U> {
    (params: PageReq<U>): Promise<ApiResponse<T>>
}

interface DelItemApi<Z> {
    (params: Z): Promise<{ code: number; message: string; data: boolean }>
}

export const useTable = <T, U extends {}, Z>(
    initialSearchParams: U,
    fetchListApi?: FetchListApi<T, U>,
    delItemApi?: DelItemApi<Z>
) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [loading, setLoading] = useState(false)

    // * 搜索参数
    const [searchParams, setSearchParams] = useState<U>(initialSearchParams || ({} as U))

    const fetchDataFromAPI = async ({ current, pageSize, ...rest }: TableRequestParams & U) => {
        setLoading(true)
        if (!fetchListApi) return message.error("接口未定义")

        try {
            const result = await fetchListApi({
                current: current!,
                pageSize: pageSize!,
                data: rest,
            })

            if (result.code !== 200) {
                return {
                    success: false,
                    data: [],
                }
            }
            const { total, data } = result.data

            setPagination({
                current: current!,
                pageSize: pageSize!,
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

    const deleteService = async (params: Z, action: { reload: () => void }) => {
        if (!delItemApi) return message.error("删除接口未定义")
        const res = await delItemApi(params)
        if (res.code === 200) {
            message.success("删除成功")
            action.reload()
        }
    }

    return { pagination, loading, fetchDataFromAPI, deleteService, searchParams, setSearchParams }
}
