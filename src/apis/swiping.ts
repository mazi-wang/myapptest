import type { PageReq, PageRes, Result } from "@/type"
import request from "@/utils/request"

export interface Swiping {
    id: string
    storeId: string
    swipingTime: string
    number: string
    money: number
    degree: string
    refund: number
    userName: string
    remark: string
    refundTime: string
}

export interface SwipingList extends Swiping {
    createTime: string // ISO 8601 date string
    lastModifiedTime: string // ISO 8601 date string
    isDeleted: number // boolean value represented as number (0 or 1)
}

export interface SwipingListRes {
    storeId: string
    storeName: string
    swipingList: Swiping[]
}

/**
 * 刷单列表
 * @param data
 */
export const getSwipingListAPI = (
    data: PageReq<{ store_id: string; date: string }>
): Promise<Result<PageRes<SwipingListRes>>> => {
    return request("/swiping/list", {
        method: "POST",
        data,
    })
}

/**
 * 删除刷单记录
 * @param data
 */
export const delSwipingListAPI = (data: { id: string }): Promise<Result<string>> =>
    request("/swiping", {
        method: "DELETE",
        data,
    })

/**
 * 修改刷单记录
 * @param data
 */
export const putSwipingListAPI = (data: Swiping): Promise<Result<string>> =>
    request("/swiping", {
        method: "PUT",
        data,
    })

/**
 * 添加刷单记录
 * @param data
 */
export const addSwipingAPI = (data: Swiping): Promise<Result<string>> =>
    request("/swiping/add", {
        method: "POST",
        data,
    })

/**
 * 某店铺佣金退款金额总计
 * @param params
 * @returns
 */
export const totalSwipingAPI = (params: {
    storeId: string
    date: string
}): Promise<Result<{ moneyTotal: number; refundTotal: number }>> =>
    request("/swiping/total", {
        method: "POST",
        data: params,
    })
