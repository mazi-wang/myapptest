import { useState, useCallback, useEffect } from "react"
import { message } from "antd"
import { getSwipingListAPI, delSwipingListAPI } from "@/apis/swiping"

type SearchParams = {
    store_id?: string
    date?: string
}

export const useServiceTable = (initialSearchParams?: { store_id?: string }) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams || {})

    // * 请求数据
    const fetchDataFromAPI = async ({
        current,
        pageSize,
        ...rest
    }: {
        pageSize: number
        current: number
        keyword?: string
        store_id?: string
        date: string
    }) => {
        setLoading(true)

        const requestData: {
            current: number
            pageSize: number
            data: { store_id?: string; date?: string }
        } = {
            current: current,
            pageSize: pageSize,
            data: rest,
        }

        if (rest.store_id || searchParams.store_id)
            requestData.data.store_id = rest.store_id || searchParams.store_id
        if (rest.date || searchParams.date) requestData.data.date = rest.date || searchParams.date

        try {
            const result = await getSwipingListAPI(requestData)

            if (result.code !== 200) {
                message.error(result.message)
                return {
                    success: false,
                    data: [],
                }
            }

            const { current, pageSize, total, data } = result.data

            //   const newData = []
            //   for (const item of data) {
            //     if (item.swipingList && item.swipingList.length > 0) {
            //       for (const el of item.swipingList) {
            //         newData.push({ ...el, storeName: item.storeName, storeId: item.storeId })
            //       }
            //     } else newData.push({ storeName: item.storeName, storeId: item.storeId })
            //   }

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
        const res = await delSwipingListAPI({ id })
        if (res.code === 200) {
            message.success("删除成功")
            action.reload()
        } else {
            message.error("删除失败")
        }
    }

    return { pagination, loading, fetchDataFromAPI, deleteService, searchParams, setSearchParams }
}
