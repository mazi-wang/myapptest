import type { PageReq, PageRes, Result } from "@/type"
import request from "@/utils/request"

interface CostStartParams<T> {
    store_id: string
    ditch_id: string
    sell_id: string
    costType: number
    body: T
}

interface CostData<T> {
    id: "string"
    type: 0
    body: T
}

interface CostPut {
    id: "string"
    name: "string"
    money: "number"
}

interface CostDel {
    cost_true_id: "string"
    name: "string"
}

interface CostGet {
    cost_id: "string"
    type: 0
}

export type CostListReq = PageReq<CostGet>

/**
 * 新增成本
 * @param data
 */
export const addCostAPI = (data: CostStartParams<any>): Promise<Result<string>> => {
    return request("/cost", {
        method: "POST",
        data,
    })
}

/**
 * 获取成本列表
 * @param data
 */
export const listCostAPI = (data: PageReq<CostGet>): Promise<Result<PageRes<CostData<any>>>> => {
    return request("/cost/list", {
        method: "POST",
        data,
    })
}

/**
 * 修改项目名称
 * @param data
 */
export const putCostNameAPI = (data: CostPut): Promise<Result<PageRes<boolean>>> => {
    return request("/cost", {
        method: "PUT",
        data,
    })
}

/**
 * 删除项目
 * @param uid
 */
export const deleteCostAPI = (data: CostDel): Promise<Result<PageRes<boolean>>> => {
    return request("/station", {
        method: "DELETE",
        data,
    })
}

/* ******************************************************** */

interface getCostStore {
    store_id: "string"
    ditch_id: "string"
    sell_id: "string"
}

/**
 * 获取某店铺的成本列表
 * @param data
 */
export const listCostStoreAPI = (data: getCostStore): Promise<Result<PageRes<CostData<any>>>> => {
    return request("/cost/list", {
        method: "POST",
        data,
    })
}
