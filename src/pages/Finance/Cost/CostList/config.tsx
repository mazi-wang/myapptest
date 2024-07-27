import type { Dispatch, SetStateAction } from "react"
import type { ProColumns } from "@ant-design/pro-components"
import type { User } from "@/entity"
import { Button, message, Popconfirm } from "antd"
import { deletePostAPI } from "@/apis/post"
import type { EditConfigProps, ModifyPwdConfigProps } from "@/pages/UserManage/UserList/index"

export const columns: (
    editConfig: EditConfigProps,
    setEditConfig: Dispatch<SetStateAction<EditConfigProps>>,
    modifyPwdConfig: ModifyPwdConfigProps,
    setModifyPwdConfig: Dispatch<SetStateAction<ModifyPwdConfigProps>>
) => ProColumns<User>[] = (editConfig, setEditConfig, modifyPwdConfig, setModifyPwdConfig) => [
    {
        title: "岗位编号",
        key: "id",
        fixed: "left",
        dataIndex: "id",
        width: 50,
        copyable: true,
        ellipsis: true,
    },
    {
        title: "岗位名称",
        key: "name",
        width: 150,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
    },

    {
        title: "操作",
        valueType: "option",
        key: "option",
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
                修改项目
            </Button>,
            <Popconfirm
                key="delete"
                title="删除员工"
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
            <Button
                key="copy"
                size={"small"}
                onClick={() => {
                    let content = ""
                    for (const key in record) {
                        content += `${key}: ${record[key]}; `
                    }
                    console.log("复制内容：", content)
                    navigator?.clipboard?.writeText(content)
                    message.success("复制成功")
                }}
            >
                复制
            </Button>,
        ],
    },
]
