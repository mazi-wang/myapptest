import type {InterfaceGroup} from "@/entity";

export type InterfaceGroupAddReq = {
    name: string,
    idList: string[]
}

export type InterfaceGroupListItem = InterfaceGroup & { idList: string[] }

export type InterfaceGroupListReq = {
    groupList: InterfaceGroupListItem[]
}

export type InterfaceGroupModifyReqVO = {
    id: string,
    name: string,
    interfaceIdList: string
}

