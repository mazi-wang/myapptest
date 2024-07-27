export type InterfaceListByRoleId = {
    id: string
    name: string
    path: string
    method: string
    description: string
    status: number
    isPower: number
    hasPower: number
}

export type InterfaceList = {
    idList: string[]
    version: string | undefined
}
