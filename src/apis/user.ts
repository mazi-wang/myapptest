import type { PageReq, PageRes, Result } from "@/type"
import request from "@/utils/request"
import type { User, UserInfo } from "@/entity"
import type { UserAddParam, UserListReq, UserModify, UserModifyPwd } from "@/apis/types/user"

/**
 * 登录
 * @param data
 */
export const login = (data: User.LoginParams): Promise<Result<boolean>> => {
    return request("/user/login", {
        method: "POST",
        data,
    })
}

/**
 * 退出登录
 */
export const logout = (): Promise<Result<boolean>> => {
    return request("/user/logout", {
        method: "POST",
    })
}

/**
 * 获取员工信息
 */
export const getUserInfo = (): Promise<Result<UserInfo>> => {
    return request("/user", {
        method: "GET",
    })
}

/**
 * 上传员工头像
 * @param avatar
 */
export const uploadUserAvatar = (avatar: File): Promise<Result<string>> => {
    const data = new FormData()
    data.append("avatar", avatar)
    return request("/upload/user/avatar", {
        method: "POST",
        data,
    })
}

/**
 * 创建员工
 * @param data
 */
export const addUser = (data: UserAddParam): Promise<Result<string>> => {
    return request("/user", {
        method: "POST",
        data,
    })
}

/**
 * 获取员工列表
 * @param data
 */
export const listUser = (data: UserListReq): Promise<Result<PageRes<User>>> => {
    return request("/user/list", {
        method: "POST",
        data,
    })
}

/**
 * 修改员工信息
 * @param data
 */
export const modifyUser = (data: UserModify): Promise<Result<PageRes<boolean>>> => {
    return request("/user", {
        method: "PUT",
        data,
    })
}

/**
 * 修改员工密码
 * @param data
 */
export const modifyUserPwd = (data: UserModifyPwd): Promise<Result<PageRes<boolean>>> => {
    return request("/user/pwd", {
        method: "PUT",
        data,
    })
}

/**
 * 删除员工
 * @param uid
 */
export const deleteUser = (uid: string): Promise<Result<PageRes<boolean>>> => {
    return request("/user", {
        method: "DELETE",
        params: {
            uid,
        },
    })
}
