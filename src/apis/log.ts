import request from "@/utils/request"
import type { PageRes, Result } from "@/type"
import type { OperationLog } from "@/entity"
import type { SkuListReq } from "./types/sku"

/**
 * 获取操作日志列表
 * @param data
 */
export const listLog = (data: SkuListReq): Promise<Result<PageRes<OperationLog>>> => {
    return request("/log/list", {
        method: "POST",
        data,
    })
}

/**
 * 删除操作日志
 * @param id 操作日志ID
 */
export const deleteOperationLog = (id: string): Promise<Result<boolean>> => {
    return request("/log", {
        method: "DELETE",
        params: {
            id,
        },
    })
}
