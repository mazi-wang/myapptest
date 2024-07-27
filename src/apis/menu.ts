import request from "@/utils/request"
import type {Result} from "@/type"

/**
 * 根据角色ID获取菜单列表
 * @param roleId 角色ID
 */
export const getMenuByRoleId = (roleId: number): Promise<Result<string[]>> => {
    return request("/menu", {
        method: "GET",
        params: {
            roleId,
        },
    })
}

/**
 * 过去菜单默认值列表
 */
export const listMenuDefault = (): Promise<Result<string[]>> => {
    return request("/menu/default", {
        method: "GET",
    })
}

/**
 * 更新菜单默认值
 * @param pathList 菜单path列表
 */
export const updateMenuDefault = (pathList: string[]): Promise<Result<boolean>> => {
    return request("/menu/update/default", {
        method: "PUT",
        data: {
            pathList
        }
    })
}
