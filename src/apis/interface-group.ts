import request from "@/utils/request";
import type {InterfaceGroupAddReq} from "@/apis/types/interface-group";
import {InterfaceGroupListReq} from "@/apis/types/interface-group";
import type {Result} from "@/type";

/**
 * 增加接口分组
 * @param data 分组数据
 */
export const addInterfaceGroup = (data: InterfaceGroupAddReq): Promise<Result<boolean>> => {
    return request("/interface-group", {
        method: "POST",
        data
    })
}

/**
 * 获取接口分组
 */
export const listInterfaceGroup = (): Promise<Result<InterfaceGroupListReq>> => {
    return request("/interface-group/list", {
        method: "GET",
    })
}

/**
 * 删除接口分组
 */
export const delInterfaceGroup = (id: string): Promise<Result<boolean>> => {
    return request("/interface-group", {
        method: "DELETE",
        params: {
            id
        }
    })
}

/**
 * 修改接口分组
 */
export const modifyInterfaceGroup = (data: InterfaceGroupModifyReqVO): Promise<Result<boolean>> => {
    return request("/interface-group", {
        method: "PUT",
        data
    })
}
