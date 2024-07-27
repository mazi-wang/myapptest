import type { Dispatch, SetStateAction } from "react"
import { ProFormSelect, type ProColumns } from "@ant-design/pro-components"
import type { User } from "@/entity"
import { Button, message, Popconfirm } from "antd"
import { deletePostAPI } from "@/apis/post"

import { switchSelectFetchDebounce, switchSelectFetchFn } from "@/components/FormSelect"
interface EditConfigProps {
    id: string | null
    isOpen: boolean
    isLoading: boolean
}

interface ModifyConfigProps {}

export const columns: (
    modifyConfig: ModifyConfigProps,
    setModifyConfig: SetStateAction<ModifyConfigProps>,
    setAddModifyConfig: SetStateAction<ModifyConfigProps>
) => ProColumns<User>[] = (modifyConfig, setModifyConfig, setAddModifyConfig) => [
    {
        title: "岗位名称",
        dataIndex: "id",
        key: "id",
        hideInTable: true,
        valueType: "select",
        renderFormItem(schema, config, form, action) {
            return (
                <ProFormSelect
                    showSearch
                    debounceTime={300}
                    placeholder="请输入岗位名称"
                    request={({ keyWords }) => {
                        return switchSelectFetchFn("station", keyWords)
                    }}
                />
            )
        },
    },
    {
        title: "岗位名称",
        key: "name",
        width: 50,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },

    {
        title: "操作",
        valueType: "option",
        key: "option",
        width: 50,
        render: (dom, record, _, action) => [
            <Button
                type="primary"
                onClick={() => {
                    setAddModifyConfig((prevModifyConfig) => ({
                        ...prevModifyConfig,
                        id: record.id,
                        isOpen: true,
                    }))
                }}
                key={"addUser"}
            >
                添加用户
            </Button>,
            <Button
                key="modifyPwd"
                type="primary"
                size={"small"}
                onClick={() => {
                    setModifyConfig({
                        ...modifyConfig,
                        id: record.id,
                        isOpen: true,
                    })
                }}
            >
                编辑岗位
            </Button>,
            <Popconfirm
                key="delete"
                title="删除岗位"
                description="此操作是不可逆的，确定删除吗？"
                onConfirm={async () => {
                    const result = await deletePostAPI(record.id)
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
