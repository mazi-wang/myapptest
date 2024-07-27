import type { PageReq, PageRes, Result } from "@/type"
import request from "@/utils/request"
import type { User, UserInfo } from "@/entity"
import type { UserAddParam, UserListReq, UserModify, UserModifyPwd } from "@/apis/types/user"
import { BuiltinPlacements } from "rc-menu/lib/interface"
import { SDitchData } from "@/pages/BaseInfoManage/ShopManage/ShopStartList"

interface StoreList {
    name: string
    id: string
}

/**
 * 创建店铺
 * @param data
 */
export const addStoreAPI = (name: string): Promise<Result<string>> => {
    return request("/store/add", {
        method: "POST",
        data: {
            name,
        },
    })
}

/**
 * 获取店铺列表
 * @param data
 */
export const listStoreAPI = (
    data: PageReq<StoreList>
): Promise<Result<PageRes<{ id: string; name: string; status: number }>>> => {
    return request("/store/list", {
        method: "POST",
        data,
    })
}

/**
 * 修改店铺名称
 * @param data
 */
export const putStoreNameAPI = (data: StoreList): Promise<Result<PageRes<boolean>>> => {
    return request("/store", {
        method: "PUT",
        data,
    })
}

/**
 * 删除店铺
 * @param uid
 */
export const deleteStoreAPI = (uid: string): Promise<Result<PageRes<boolean>>> => {
    return request("/store", {
        method: "DELETE",
        data: {
            id: uid,
        },
    })
}

/* ******************************** */

interface Staff<T> {
    email: string
    name: string
    gender: number
    id: string
    store?: T
}

export interface Store {
    id: string
    name: string
    status: number
    storeCreatedTime: string
    storeLastModifiedTime: string
}

export type UserStoreType = {
    id: string
    name: string
    storeId: string
    storeName: string
    status: string
}

/**
 * 修改店铺状态
 * @param data
 */
export const putStoreStatusAPI = (id: string): Promise<Result<PageRes<boolean>>> => {
    return request("/store/status", {
        method: "PUT",
        data: {
            id,
        },
    })
}

/**
 * 新增员工店铺
 * @param data
 */
export const addStoreStaffAPI = (
    id: string,
    storeId: string
): Promise<Result<PageRes<boolean>>> => {
    return request("/store/user", {
        method: "POST",
        data: {
            id,
            storeId,
        },
    })
}

/**
 * 删除用户店铺
 * @param data
 */
export const delStoreStaffAPI = ({
    userId,
    storeId,
}: {
    userId: string
    storeId: string
}): Promise<Result<PageRes<boolean>>> => {
    return request("/store/user", {
        method: "DELETE",
        data: {
            userId,
            storeId,
        },
    })
}

/**
 * 获取某员工店铺
 * @param data
 */
export const getStoreStaffAPI = (id: string): Promise<Result<Staff<Store[]>>> => {
    return request("/store/user", {
        method: "GET",
        params: {
            id,
        },
    })
}

/**
 * 获取员工店铺列表
 * @param data
 */
export const getStoreStaffListAPI = (
    data: Result<{ userId?: string }>
): Promise<Result<Staff<Store[]>>> => {
    return request("/store/list/user", {
        method: "POST",
        data,
    })
}

/**
 * 删除员工店铺
 * @param data
 */
export const delStoreStaffListAPI = (
    data: Result<{ userId?: string; storeId: string }>
): Promise<Result<boolean>> => {
    return request("/store/user/list", {
        method: "DELETE",
        data,
    })
}

/* ******************************** */
/**
 * 创建店铺
 * @param data
 */
export const addShopChannelAPI = (data: UserAddParam): Promise<Result<string>> => {
    return request("/ditch", {
        method: "POST",
        data,
    })
}

/**
 * 获取渠道列表
 * @param data
 */
export const listShopChannelAPI = (
    data: PageReq<{ id: number; name: number }>
): Promise<Result<PageRes<User>>> => {
    return request("/ditch/list", {
        method: "POST",
        data,
    })
}

/**
 * 修改渠道名称
 * @param data
 */
export const putShopChannelNameAPI = (data: UserModifyPwd): Promise<Result<PageRes<boolean>>> => {
    return request("/ditch", {
        method: "PUT",
        data,
    })
}

/**
 * 删除渠道
 * @param uid
 */
export const deleteShopChannelAPI = (uid: string): Promise<Result<PageRes<boolean>>> => {
    return request("/ditch", {
        method: "DELETE",
        data: {
            id: uid,
        },
    })
}

// *********************************************

export type DitchesType = { id: string; name: string }[]

export type DitchAtStoreList = Result<{
    id: string
    name: string
    ditches: DitchesType | []
}>

/**
 * 店铺渠道列表
 * @param uid
 */
export const getStoreDitchAPI = (id: string): Promise<Result<PageRes<SDitchData>>> => {
    return request("/ditch/sell", {
        method: "POST",
        data: { store_id: id },
    })
}

/**
 * 新增店铺渠道列表
 * @param id  店铺ID
 * @param ditchName  渠道名
 */
export const addStoreDitchAPI = (
    id: string,
    ditchName: string
): Promise<Result<PageRes<boolean>>> => {
    return request("/ditch/store", {
        method: "POST",
        data: { id, ditchName },
    })
}

/**
 * 删除店铺渠道
 * @param id  店铺ID
 * @param ditchName  渠道名
 */
export const delStoreDitchAPI = ({
    id,
    ditchId,
}: {
    id: string
    ditchId: string
}): Promise<Result<boolean>> => {
    return request("/ditch/store", {
        method: "DELETE",
        data: { id, ditchId },
    })
}

// *************************************************

/**
 * 平台列表
 * @param data
 */
export const getSellListAPI = (
    data: PageReq<{ id: string; name: string }>
): Promise<Result<PageRes<{ id: string; name: string }>>> => {
    return request("/sell/list", {
        method: "POST",
        data,
    })
}

/**
 *添加平台
 * @param data
 */
export const addSellListAPI = (
    name: string
): Promise<Result<PageRes<{ id: string; name: string }>>> => {
    return request("/sell/add", {
        method: "POST",
        data: {
            name,
        },
    })
}

/**
 * 新增渠道平台
 * @param data
 */
export const addSellDitchListAPI = (
    ditch_id: string,
    sell_id: string
): Promise<Result<boolean>> => {
    return request("/sell/ditch", {
        method: "POST",
        data: {
            sell_id,
            ditch_id,
        },
    })
}

/**
 * 修改平台名称
 * @param data
 */
export const putSellListAPI = (
    id: string,
    name: string
): Promise<Result<PageRes<{ id: string; name: string }>>> => {
    return request("/sell", {
        method: "PUT",
        data: { id, name },
    })
}

/**
 * 删除平台
 * @param data
 */
export const delSellListAPI = (id: string): Promise<Result<boolean>> => {
    return request("/sell", {
        method: "DELETE",
        data: { id },
    })
}

/**
 * 删除渠道平台
 * @param ditch_id 渠道ID
 * @param sell_id 平台ID
 */
export const delSellDistAPI = (ditch_id: string, sell_id: string): Promise<Result<boolean>> => {
    return request("/sell/ditch", {
        method: "DELETE",
        data: { ditch_id, sell_id },
    })
}

/**
 * 获取某个渠道的平台列表
 * @param id 渠道ID
 */
export const getSellDistAPI = (
    id: string
): Promise<
    Result<{
        id: string
        name: string
        articleCreatedTime: string
        articleLastModifiedTime: string
    }>
> => {
    return request("/sell/list/ditch", {
        method: "GET",
        params: { id },
    })
}

// ***************************************************
/**
 * 获取某个店铺成本列表
 * @param data - {store_id:string, ditch_id: string, sell_id: string}
 */
export const getCostListStore = (data: {
    store_id: string
    ditch_id: string
    sell_id: string
    costTime: string
}): Promise<
    Result<{
        id: string
        name: string
        articleCreatedTime: string
        articleLastModifiedTime: string
    }>
> => {
    return request("/cost/list/store", {
        method: "POST",
        data,
    })
}

/**
 * 获取某个月的成本
 * @param data - {store_id:string, ditch_id: string, sell_id: string}
 */
export const getCost = (data: {
    store_id: string
    ditch_id: string
    sell_id: string
    costTime: string
}): Promise<
    Result<{
        id: string
        name: string
        articleCreatedTime: string
        articleLastModifiedTime: string
    }>
> => {
    return request("/cost/count", {
        method: "POST",
        data,
    })
}

export const getCostList = (
    data: PageReq<{ cost_id: string; type: number }>
): Promise<
    Result<
        PageRes<{
            id: string
            type: number
            costTime: string
            body: string | any[]
        }>
    >
> => {
    return request("/cost/list", {
        method: "POST",
        data,
    })
}

/**
 * 删除成本
 * @param data
 * @returns
 */
export const delCostAPI = (data: {
    cost_true_id: string
    name?: string
}): Promise<Result<boolean>> =>
    request("/cost", {
        method: "DELETE",
        data,
    })

/**
 * 添加成本
 * @param data
 * @returns
 */
export const addCostAPI = (data: {
    store_id: string
    ditch_id: string
    sell_id: string
    costType: number
    body: any
    costTime?: string
}): Promise<Result<boolean>> =>
    request("/cost", {
        method: "POST",
        data,
    })

/**
 * 修改成本
 * @param data
 * @returns
 */
export const putCost = (data: {
    id: string
    name?: string | null
    money: number
}): Promise<Result<boolean>> =>
    request("/cost", {
        method: "PUT",
        data,
    })

// *  *******************************************************

export interface Service {
    id: string
    userId: string
    indexTime: string
    avgAnswer: string
    answerSingle: number
    answerWeighting: number
    satisfaction: string
    satisfactionSingle: number
    satisfactionWeighting: number
    playAt: string
    playAtSingle: number
    playAtWeighting: number
    unsent: string
    unsentSingle: number
    unsentWeighting: number
    undone: string
    undoneSingle: number
    undoneWeighting: number
    deduct: number
    rate: string
    finalScore: number
    bonus: number
}

/**
 * 客服绩效
 * @param data
 * @returns
 */
export const getServiceListAPI = (
    data: PageReq<{
        userId?: string
    }>
): Promise<Result<PageRes<Service>>> =>
    request("/service/list", {
        method: "POST",
        data,
    })

/**
 * 删除客服绩效
 * @param data
 * @returns
 */
export const delServiceListAPI = (data: { id: string }): Promise<Result<boolean>> =>
    request("/service", {
        method: "DELETE",
        data,
    })

/**
 * 修改客服绩效
 * @param data
 * @returns
 */
export const putServiceListAPI = (data: {
    id: string
    userId: string
    storeName: string
    actualValue: number
    refundValue: number
    serviceTime: string
}): Promise<Result<boolean>> =>
    request("/service", {
        method: "PUT",
        data,
    })

/**
 * 修改客服绩效
 * @param data
 * @returns
 */
export const addServiceListAPI = (
    data: {
        userId: string
        storeName: string
        actualValue: number
        refundValue: number
        serviceTime: string
    }[]
): Promise<Result<boolean>> =>
    request("/service/add", {
        method: "POST",
        data,
    })

/**
 * 绩效总计
 * @param data
 * @returns
 */
export const totalServiceAPI = (data: {
    userId: string
    serviceTime: string
}): Promise<
    Result<{
        userId: string
        actualValueCount: number
        actualCommissionCount: number
        refundValueCount: number
        refundCommissionCount: number
    }>
> =>
    request("/service/total", {
        method: "POST",
        data: data,
    })

// * 客服绩效指标
// ***********************************************************************
interface BasePerformance {
    id: string
    userId: string
    avgAnswer: string
    answerSingle: number
    satisfaction: string
    satisfactionSingle: number
    playAt: string
    playAtSingle: number
    unsent: string
    unsentSingle: number
    undone: string
    undoneSingle: number
    deduct: number
    rate: string
    bonus: number
}

export interface PutUserPerformance extends BasePerformance {
    indexTime: string // 将 indexTime 替换为 IndexTime 类型
}

// 继承基础接口，并扩展新字段
export interface CombinedPerformance extends BasePerformance {
    indexTime: string
    answerWeighting: number // 添加 answerWeighting
    satisfactionWeighting: number // 添加 satisfactionWeighting
    playAtWeighting: number // 添加 playAtWeighting
    unsentWeighting: number // 添加 unsentWeighting
    undoneWeighting: number // 添加 undoneWeighting
    finalScore: number // 添加 finalScore
}

/**
 * 客服指标
 * @param data
 * @returns
 */
export const getServiceIndexAPI = (
    data: PageReq<{ userId: string; date: string }>
): Promise<Result<PageRes<CombinedPerformance>>> =>
    request("/index/list", {
        method: "POST",
        data,
    })

/**
 * 客服指标
 * @param data
 * @returns
 */
export const delServiceIndexAPI = (data: { id: string }): Promise<Result<boolean>> =>
    request("/index", {
        method: "DELETE",
        data,
    })

/**
 * 修改客服指标
 * @param data
 * @returns
 */
export const putServiceIndexAPI = (data: PutUserPerformance): Promise<Result<boolean>> =>
    request("/index", {
        method: "PUT",
        data,
    })

/**
 * 添加客服指标
 * @param data
 * @returns
 */
export const addServiceIndexAPI = (data: PutUserPerformance): Promise<Result<boolean>> =>
    request("/index/add", {
        method: "POST",
        data,
    })
