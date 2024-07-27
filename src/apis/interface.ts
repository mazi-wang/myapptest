import request from "@/utils/request"
import type {Result} from "@/type"
import type {Interface} from "@/entity"
import {InterfaceList} from "@/apis/types/interface";

/**
 * 根据角色ID获取接口列表
 * @param roleId 角色ID
 */
export const getInterfaceByRoleId = (roleId: number): Promise<Result<string[]>> => {
    return request("/interface", {
        method: "GET",
        params: {
            roleId,
        },
    })
}

/**
 * 批量获取接口信息
 * @param data
 */
export const getInterfaceByIdList = (data: InterfaceList): Promise<Result<{
    list: Interface[],
    version: string
}>> => {
    return request("/interface/list", {
        method: "POST",
        data
    })
}

/**
 * 获取接口默认值列表
 */
export const listInterfaceDefault = (): Promise<Result<string[]>> => {
    return request("/interface/default", {
        method: "GET",
    })
}


/**
 * 更新接口默认值
 * @param idList 接口ID列表
 */
export const updateInterfaceDefault = (idList: string[]): Promise<Result<boolean>> => {
    return request("/interface/update/default", {
        method: "PUT",
        data: {
            idList
        }
    })
}

