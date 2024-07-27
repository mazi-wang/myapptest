import type { EditConfigProps } from "@/type"
import type { Dispatch, SetStateAction } from "react"
import type { ProColumns } from "@ant-design/pro-components"
import type { Role } from "@/entity"
import { Button, message, Popconfirm } from "antd"
import { deleteRole } from "@/apis/role"

export const columns: (
    editConfig: EditConfigProps,
    setEditConfig: Dispatch<SetStateAction<EditConfigProps>>,
    showInterfaceDrawer: () => void,
    showMenuDrawer: () => void
) => ProColumns<Role>[] = (editConfig, setEditConfig, showInterfaceDrawer, showMenuDrawer) => [
    {
        title: "编号",
        key: "id",
        fixed: "left",
        dataIndex: "id",
        hideInSearch: true,
        width: 150,
        ellipsis: true,
    },
    {
        title: "角色名",
        key: "name",
        width: 150,
        dataIndex: "name",
        hideInSearch: true,
        ellipsis: true,
    },
    {
        title: "创建时间",
        width: 120,
        key: "gmtCreatedTime",
        dataIndex: "gmtCreatedTime",
        valueType: "date",
        hideInSearch: true,
    },
    {
        title: "更新时间",
        width: 120,
        key: "gmtLastModifiedTime",
        dataIndex: "gmtLastModifiedTime",
        valueType: "date",
        hideInSearch: true,
    },
    {
        title: "操作",
        valueType: "option",
        key: "option",
        fixed: "right",
        render: (dom, record, index, action) => {
            const confirmDelete = async (e: React.MouseEvent<HTMLElement>) => {
                console.log(e)
                console.log("删除", record.id)
                const result = await deleteRole(record.id)
                if (result.data) {
                    message.success(result.message)
                    action?.reload()
                }
            }
            return [
                <Button
                    key="edit"
                    type="primary"
                    onClick={() => {
                        setEditConfig({
                            ...editConfig,
                            id: record.id,
                            isOpen: true,
                        })
                        console.log("record: ", record)
                        console.log("editConfig: ", editConfig)
                    }}
                >
                    编辑
                </Button>,
                <Popconfirm
                    title="确认删除这个角色吗？"
                    onConfirm={confirmDelete}
                    okText="确认"
                    cancelText="取消"
                    key="delete"
                >
                    <Button type="dashed" size={"small"} danger>
                        删除
                    </Button>
                </Popconfirm>,
                <Button
                    key="check-interface"
                    color="#599e5e"
                    onClick={() => showInterfaceDrawer(record.id)}
                >
                    接口权限
                </Button>,
                <Button key="check-menu" type="primary" onClick={() => showMenuDrawer(record.id)}>
                    菜单权限
                </Button>,
            ]
        },
    },
]
