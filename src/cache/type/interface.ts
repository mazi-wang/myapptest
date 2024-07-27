import type { Interface } from "@/entity"

export type InterfaceCache = {
    list: Interface[]
}

export type LocalInterfaceCache = {
    list: Interface[]
    expire: number
}
