import type { TreeDataNode } from "antd"
import { Button, Drawer, Input, message, Modal, notification, Tree } from "antd"
import React, { useEffect, useState } from "react"
import { getInterfaceByRoleId } from "@/apis/interface"
import { modifyRoleInterface } from "@/apis/role"
import { getInterfaceList } from "@/cache/interface"
import type { Interface } from "@/entity"
import type { SearchProps } from "antd/lib/input/Search"

type Props = {
    onClose: () => void
    open: boolean
    roleId: number
    setOpen: (isOpenDrawer: boolean) => void
}

const Context = React.createContext({ name: "Default" })

const RoleInterfaceModal = (props: Props) => {
    const [interfaceList, setInterfaceList] = useState<Interface[]>([])
    const [interfaceListTreeData, setInterfaceListTreeData] = useState<TreeDataNode[]>([])
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
    const [originCheckedKeys, setOriginCheckedKeys] = useState<React.Key[]>([])
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [api, contextHolder] = notification.useNotification()
    const [isOpenModifyConfirm, setIsOpenModifyConfirm] = useState<boolean>(false)

    /**
     * 修改数据
     */
    const modify = async () => {
        // 修改角色接口权限
        message.loading("修改中...")
        const result = await modifyRoleInterface(props.roleId, checkedKeys as string[])
        message.destroy()
        if (result.data) {
            message.success(result.message)
        } else {
            message.error(result.message)
        }
    }

    const onCheck = (checkedKeysValue: React.Key[]) => {
        console.log("onCheck", checkedKeysValue)
        setCheckedKeys(checkedKeysValue)
    }

    const onSelect = (selectedKeysValue: React.Key[]) => {
        console.log("selected-key", selectedKeysValue)
        setSelectedKeys(selectedKeysValue)
        const interItem = interfaceList.find((inter) => inter.id === selectedKeysValue[0])
        api.info({
            message: `接口描述`,
            description: interItem?.description,
            placement: "topRight",
        })
    }

    const onClose = async () => {
        // 判断值是否被更改过
        if (originCheckedKeys.length !== checkedKeys.length) {
            // 打开确认框
            setIsOpenModifyConfirm(true)
        } else {
            // 否则直接退出
            props.setOpen(false)
        }
    }

    /**
     * 确认修改
     */
    const confirmModify = () => {
        modify()
        setIsOpenModifyConfirm(false)
        // 关闭抽屉
        props.setOpen(false)
    }

    const getList = async function (keywords: string = "") {
        // 清空选中的
        setCheckedKeys([])
        setOriginCheckedKeys([])
        const idResult = await getInterfaceByRoleId(props.roleId)
        // console.log("接口ID列表为：", idResult.data)
        if (idResult.data) {
            const interfaceListResult = await getInterfaceList(idResult.data, keywords)
            setInterfaceList(interfaceListResult.list)
            // 数据转换  名称+路径+方法+是否是权限路径
            const data: { title: string; key: string }[] = interfaceListResult.list.map((inter) => {
                // 顺便把有权限的接口过滤出来
                if (idResult.data.includes(inter.id)) {
                    setCheckedKeys((prevKeys) => [...prevKeys, inter.id])
                    // 记录初始值
                    setOriginCheckedKeys((prevKeys) => [...prevKeys, inter.id])
                }
                return {
                    key: inter.id,
                    title: inter.name + "-" + inter.path + "-" + inter.method,
                }
            })
            console.log("过滤后的数据：", data)
            setInterfaceListTreeData(data)
        }
    }

    useEffect(() => {
        getList()
    }, [props.roleId])

    const onSearch: SearchProps["onSearch"] = (value: string) => {
        console.log("搜索接口关键词：", value)
        getList(value)
    }

    return (
        <Context.Provider value={{ name: "接口描述" }}>
            {contextHolder}
            <Drawer
                title="接口权限"
                onClose={onClose}
                open={props.open}
                footer={
                    <>
                        <Button type="primary" onClick={confirmModify}>
                            确认修改
                        </Button>
                        <Button
                            onClick={() => {
                                props.setOpen(false)
                            }}
                            style={{ marginLeft: "10px" }}
                        >
                            取消修改
                        </Button>
                        <div style={{ marginTop: "10px" }}>Tips: 名称-路径-方法</div>
                    </>
                }
            >
                <Input.Search
                    placeholder="请输入你要搜索的接口名称"
                    onSearch={onSearch}
                    style={{ width: "100%", padding: "10px 0" }}
                />
                <Tree
                    checkable
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={interfaceListTreeData}
                />
            </Drawer>
            <Modal
                open={isOpenModifyConfirm}
                title="修改角色接口权限"
                onOk={() => {
                    setIsOpenModifyConfirm(false)
                    // 关闭抽屉
                    props.setOpen(false)
                }}
                onCancel={() => {
                    setIsOpenModifyConfirm(false)
                }}
                footer={
                    <>
                        <Button
                            type="primary"
                            onClick={() => {
                                setIsOpenModifyConfirm(false)
                                // 关闭抽屉
                                props.setOpen(false)
                            }}
                        >
                            确认退出
                        </Button>
                        <Button
                            onClick={() => {
                                setIsOpenModifyConfirm(false)
                                props.setOpen(false)
                            }}
                            style={{ marginLeft: "10px" }}
                        >
                            取消
                        </Button>
                    </>
                }
            >
                是否修改接口权限
            </Modal>
        </Context.Provider>
    )
}

export default RoleInterfaceModal
