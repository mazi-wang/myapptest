import type { Dispatch, SetStateAction } from "react"
import type { ProColumns } from "@ant-design/pro-components"
import type { User } from "@/entity"
import { Button, message, Popconfirm } from "antd"
import { deleteShopChannelAPI } from "@/apis/shop"
import type { EditConfigProps, ModifyPwdConfigProps } from "@/pages/UserManage/UserList/index"

import { switchSelectFetchDebounce } from "@/components/FormSelect"

export const columns: (
    editConfig: EditConfigProps,
    setEditConfig: Dispatch<SetStateAction<EditConfigProps>>,
    modifyPwdConfig: ModifyPwdConfigProps,
    setModifyPwdConfig: Dispatch<SetStateAction<ModifyPwdConfigProps>>
) => ProColumns<User>[] = (editConfig, setEditConfig, modifyPwdConfig, setModifyPwdConfig) => [
    {
        title: "选择渠道",
        dataIndex: "id",
        key: "id",
        copyable: true,
        valueType: "select",
        request: async (params) => {
            return switchSelectFetchDebounce("ditch", params.keyWords)
        },
        fieldProps: {
            showSearch: true,
            filterOption: false,
        },
        width: 80,
        hideInTable: true,
    },
    {
        title: "渠道编号",
        key: "id",
        dataIndex: "id",
        width: 80,
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "渠道名称",
        key: "name",
        width: 150,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },

    {
        title: "操作",
        valueType: "option",
        key: "option",
        fixed: "right",
        width: 100,
        render: (dom, record, _, action) => [
            <Button
                key="modifyPwd"
                type="primary"
                size={"small"}
                onClick={() => {
                    setModifyPwdConfig({
                        ...modifyPwdConfig,
                        id: record.id,
                        isOpen: true,
                    })
                }}
            >
                修改渠道
            </Button>,
            <Popconfirm
                key="delete"
                title="删除渠道信息"
                description="此操作是不可逆的，确定删除吗？"
                onConfirm={async () => {
                    const result = await deleteShopChannelAPI(record.id)
                    if (result.data) {
                        message.success(result.message)
                        action?.reload()
                    } else {
                        message.error(result.message)
                    }
                }}
                okText="是的"
                cancelText="取消"
            >
                <Button size={"small"} type={"danger"}>
                    删除
                </Button>
            </Popconfirm>,
        ],
    },
]
