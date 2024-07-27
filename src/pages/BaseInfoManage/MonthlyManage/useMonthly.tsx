import { useState, useEffect } from "react"
import { message } from "antd"
import { getMonthlyListAPI } from "@/apis/monthly"

interface SearchParams {
    month_year?: string
}

interface PageReq {
    current: number
    pageSize: number
    data: SearchParams
}

interface TableRequestParams extends SearchParams {
    current?: number
    pageSize?: number
    monthYear?: string
}

export const useTable = (initialSearchParams?: SearchParams) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [loading, setLoading] = useState(false)

    // * 搜索参数
    const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams || {})

    const fetchDataFromAPI = async (params: TableRequestParams) => {
        setLoading(true)

        const requestData: PageReq = {
            current: params!.current as NonNullable<number>,
            pageSize: params!.pageSize as NonNullable<number>,
            data: params.month_year ? { month_year: params.month_year?.split("-")[1] } : {},
        }

        try {
            const result = await getMonthlyListAPI(requestData)

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
