import type { FilterSort, PageReq } from "@/type"

/**
 * 列表参数
 */
export type LogListReq = PageReq<{
    id: string
    uid: string
    name: string
    path: string
    params: string
    gmtCreatedTime: FilterSort<string>
}>
