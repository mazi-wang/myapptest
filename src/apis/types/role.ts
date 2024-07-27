import type {FilterSort} from "@/type"

/**
 * 新增参数
 */
export type RoleAddParam = {
    name: string
    interfaceIdList: string[]
    pathList: string[]
}

export type RoleListReq = {
    id: string
    name: string
    gmtCreatedTime: FilterSort<string>
    gmtLastModifiedTime: FilterSort<string>
    isDeleted: string[]
}
