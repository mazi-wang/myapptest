import type { PageReq, PageRes, Result } from "@/type"
import request from "@/utils/request"
import type { User, UserInfo } from "@/entity"
import type { UserAddParam, UserListReq, UserModify, UserModifyPwd } from "@/apis/types/user"

export type APIResult<T> = Result<PageRes<T>>

/**
 * 创建项目
 * @param data
 */
export const addPostAPI = (data: { name: string }): Promise<Result<string>> => {
    return request("/station/add", {
        method: "POST",
        data,
    })
}

/**
 * 获取项目列表
 * @param data
 */
export const listPostAPI = (data: UserListReq): Promise<Result<PageRes<User>>> => {
    return request("/station/list", {
        method: "POST",
        data,
    })
}

/**
 * 修改项目名称
 * @param data
 */
export const putPostNameAPI = (data: UserModifyPwd): Promise<Result<PageRes<boolean>>> => {
    return request("/station", {
        method: "PUT",
        data,
    })
}

/**
 * 删除项目
 * @param uid
 */
export const deletePostAPI = (uid: string): Promise<Result<PageRes<boolean>>> => {
    return request("/station", {
        method: "DELETE",
        data: {
            id: uid,
        },
    })
}

/**
 * 获取所有员工岗位列表
 */
export const getUserPostAllAPI = (
    data: PageReq<{ name?: string }>
): Promise<Result<PageRes<{ id: string; name: string; stationName: string }>>> => {
    return request("/station/user_station", {
        method: "POST",
        data,
    })
}

/**
 * 获取某个员工岗位列表
 * @param id
 */
export const getUserPostAPI = (id: string): Promise<Result<PageRes<User>>> => {
    return request("/station/user", {
        method: "GET",
        data: { id },
    })
}

/**
 * 添加某个员工岗位
 * @param id 用户ID
 * @param stationId 岗位ID
 * @returns
 */
export const addUserPostAPI = (id: string, stationId: string): Promise<Result<Result<boolean>>> => {
    return request("/station/user", {
        method: "POST",
        data: { id, stationId },
    })
}

/**
 * 删除用户岗位
 * @param id
 * @param stationId
 * @returns
 */
export const delUserPostAPI = (
    userId: string,
    stationId: string
): Promise<Result<Result<boolean>>> => {
    return request("/station/user", {
        method: "DELETE",
        data: { userId, stationId },
    })
}
/* *********************************************************************************** */
