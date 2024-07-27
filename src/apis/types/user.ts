import type {PageReq} from "@/type"

/**
 * 列表参数
 */
export type UserListReq = PageReq<{
    id: string
    name: string
    gender: number
    age: number
    roleIdList: number[]
}>

export type UserAddParam = {
    username: string
    name: string
    gender: number
    email?: string
    password?: string
    roleIdList: string[]
}

export type UserModify = {
    id: string
    name: string
    username: string
    gender: string
    age: string
}

export type UserModifyPwd = {
    uid: string
    password: string
}
