import type { InterfaceCache, LocalInterfaceCache } from "@/cache/type/interface"
import { LOC_INTER_LIST_KEY, LOC_INTER_LIST_TIME, LOC_INTER_UPDATE_VERSION } from "@/constant/local"
import { getInterfaceByIdList } from "@/apis/interface"
import type { Interface } from "@/entity"

/**
 * 保存接口列表
 * @param list
 * @param version
 */
const saveInterfaceList = (list: Interface[], version: string) => {
    const cache = { list, expire: Date.now() + LOC_INTER_LIST_TIME }
    localStorage.setItem(LOC_INTER_LIST_KEY, JSON.stringify(cache))
    localStorage.setItem(LOC_INTER_UPDATE_VERSION, version)
}

/**
 * 获取本地接口版本
 */
export const getInterfaceVersion = () => {
    return localStorage.getItem(LOC_INTER_UPDATE_VERSION)
}

/**
 * 清除接口缓存
 */
export const clearInterfaceCache = () => {
    localStorage.removeItem(LOC_INTER_LIST_KEY)
    localStorage.removeItem(LOC_INTER_UPDATE_VERSION)
}

/**
 * 重建缓存
 */
const rebuildCache = async (idList: string[] = []): Promise<Interface[]> => {
    // 获取本地接口版本
    const version = getInterfaceVersion() || undefined
    const result = await getInterfaceByIdList({
        idList,
        version: localStorage.getItem(LOC_INTER_UPDATE_VERSION) || undefined,
    })
    if (result.data) {
        let newList = []
        // 判断版本是否相同
        if (result.data.version === version) {
            newList.push(...result.data.list)
        } else {
            newList = result.data.list
        }
        // 保存缓存
        saveInterfaceList(newList, result.data.version)
        return newList
    } else {
        return []
    }
}

/**
 * 获取全部接口列表
 * @param idList
 */
export const getInterfaceList = async (
    idList: string[],
    keywords: string = ""
): Promise<InterfaceCache> => {
    // 获取本地接口版本
    const version = getInterfaceVersion() || undefined
    // 1. 判断本地缓存中是否存在
    const { list = [], expire = Date.now() + LOC_INTER_LIST_TIME }: Partial<LocalInterfaceCache> =
        JSON.parse(localStorage.getItem(LOC_INTER_LIST_KEY) || "{}")
    const interfaceCache: InterfaceCache = {
        list: list || [],
    }
    if (version && version !== "undefined" && list && list.length) {
        // 1.1 判断缓存是否
        if (expire > Date.now()) {
            // 判断本地缓存中是否有该角色所有接口信息
            const notFoundIdList = idList.filter((id) => !list.find((item) => item.id === id))
            if (notFoundIdList && notFoundIdList.length) {
                // 获取新接口
                interfaceCache.list = await rebuildCache(notFoundIdList)
            }
        } else {
            // 1.2 缓存过期，缓存重建
            interfaceCache.list = await rebuildCache()
        }
    } else {
        // 1.3 缓存不存在，缓存重建
        interfaceCache.list = await rebuildCache()
    }
    interfaceCache.list = interfaceCache.list.filter((item) => item.name.includes(keywords))
    return interfaceCache
}
