import type { PageReq, PageRes, Result } from "@/type"
import request from "@/utils/request"
import type { User } from "@/entity"
import type { UserListReq, UserModifyPwd } from "@/apis/types/user"

interface UserListParams {
    id: string
    articleId: string
}

interface ProjectAddParam {
    name: string
    startTime: string
}

/**
 * 创建项目
 * @param data
 */
export const addProjectAPI = (data: ProjectAddParam): Promise<Result<string>> => {
    return request("/article/add", {
        method: "POST",
        data,
    })
}

/**
 * 获取项目列表
 * @param data
 */
export const listProjectAPI = (data: UserListReq): Promise<Result<PageRes<User>>> => {
    return request("/article/list", {
        method: "POST",
        data,
    })
}

/**
 * 修改项目名称
 * @param data
 */
export const putProjectNameAPI = (data: UserModifyPwd): Promise<Result<PageRes<boolean>>> => {
    return request("/article", {
        method: "PUT",
        data,
    })
}

/**
 * 删除项目
 * @param uid
 */
export const deleteProjectAPI = (uid: string): Promise<Result<PageRes<boolean>>> => {
    return request("/article", {
        method: "DELETE",
        data: {
            id: uid,
        },
    })
}

// ************************************************

interface Article {
    id: string
    name: string
    articleId: string
    articleName: string
    articleCreatedTime: string // 或者可以使用 Date 类型：Date
}

/**
 * 新增用户项目
 * @param data
 */
export const addProjectUserAPI = ({
    id,
    articleId,
}: {
    id: string
    articleId: string
}): Promise<Result<string>> => {
    return request("/article/user", {
        method: "POST",
        data: {
            id,
            articleId,
        },
    })
}

/**
 * 删除员工负责的项目
 * @param data
 */
export const deleteProjectUserAPI = (data: UserListParams): Promise<Result<string>> => {
    return request("/article/user", {
        method: "DELETE",
        data,
    })
}

/**
 * 获取某个员工负责的项目列表
 * @param id String
 */
export const getProjectUserAPI = (id: string): Promise<Result<string>> => {
    return request("/article/list/user", {
        method: "GET",
        id,
    })
}

/**
 * 获取所有员工所有项目
 * @param id String
 */
export const getProjectAllUserAPI = (
    data?: PageReq<{ userId: string }>
): Promise<Result<PageRes<Article>>> => {
    return request("/article/all", {
        method: "POST",
        data,
    })
}

/**
 * 删除某员工负责的项目
 * @param uid
 */
export const deleteUserProjectAPI = (data: {
    id: string
    articleId: string
}): Promise<Result<PageRes<boolean>>> => {
    return request("/article/user", {
        method: "DELETE",
        data,
    })
}
