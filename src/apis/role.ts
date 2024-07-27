import type {PageReq, PageRes, Result} from "@/type"
import request from "@/utils/request"
import type {RoleAddParam, RoleListReq} from "@/apis/types/role"
import type {Role} from "@/entity" // export interface RoleListRes {

export interface RoleListRes {
    id: string
    name: string
}

/**
 * 分页获取角色数据
 * @param page 角色数据分页数据
 */
export const listSelectRole = (page: PageReq<string>): Promise<Result<PageRes<RoleListRes>>> => {
    return request("/role/select-list", {
        method: "GET",
        params: page,
    })
}

/**
 * 获取角色列表
 * @param data
 */
export const listRole = (data: RoleListReq): Promise<Result<PageRes<Role>>> => {
    return request("/role/list", {
        method: "POST",
        data,
    })
}

/**
 * 修改角色基本信息
 * @param data
 */
export const modifyRole = (data: RoleListReq): Promise<Result<boolean>> => {
    return request("/role", {
        method: "PUT",
        data,
    })
}

/**
 * 修改角色接口信息
 * @param roleId 角色ID
 * @param idList 接口ID列表
 */
export const modifyRoleInterface = (roleId: number, idList: string[]): Promise<Result<boolean>> => {
    return request("/role/interface", {
        method: "PUT",
        data: {
            roleId,
            idList,
        },
    })
}

/**
 * 修改角色菜单信息
 * @param roleId 角色ID
 * @param pathList 菜单ID列表
 */
export const modifyRoleMenu = (roleId: number, pathList: string[]): Promise<Result<boolean>> => {
    return request("/role/menu", {
        method: "PUT",
        data: {
            roleId,
            pathList,
        },
    })
}

/**
 * 增加角色
 * @param data 角色信息
 */
export const addRole = (data: RoleAddParam): Promise<Result<boolean>> => {
    return request("/role", {
        method: "POST",
        data,
    })
}

/**
 * 删除角色
 * @param id 角色ID
 */
export const deleteRole = (id: string): Promise<Result<boolean>> => {
    return request("/role", {
        method: "DELETE",
        params: {
            id,
        },
    })
}
