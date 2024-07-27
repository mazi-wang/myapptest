import type { Dispatch, SetStateAction } from "react"
import { ProFormSelect, ProFormText, type ProColumns } from "@ant-design/pro-components"
import type { User } from "@/entity"
import { Button, Divider, Input, message, Popconfirm, Space } from "antd"
import { deleteUser } from "@/apis/user"
import type { EditConfigProps, ModifyPwdConfigProps } from "@/pages/UserManage/UserList/index"
import {
    MyFormSelect,
    switchSelectFetchDebounce,
    switchSelectFetchFn,
} from "@/components/FormSelect"
import { addUserPostAPI, delUserPostAPI } from "@/apis/post"
import MyModalForm from "@/components/ModalForm"

// * 添加员工岗位API fn
async function onFinishPutPost(params, stationId, action) {
    try {
        const res = await addUserPostAPI(params, stationId)
        if (res.code !== 200) throw new Error(res.message)
        message.success("成功")
        action?.reload()
        return true
    } catch (err) {
        return false
    }
}

export const columns: (
    editConfig: EditConfigProps,
    setEditConfig: Dispatch<SetStateAction<EditConfigProps>>,
    modifyPwdConfig: ModifyPwdConfigProps,
    setModifyPwdConfig: Dispatch<SetStateAction<ModifyPwdConfigProps>>
) => ProColumns<User>[] = (editConfig, setEditConfig, modifyPwdConfig, setModifyPwdConfig) => [
    {
        title: "选择员工",
        dataIndex: "id",
        key: "id",
        hideInTable: true,
        valueType: "select",
        renderFormItem(schema, config, form, action) {
            return (
                <ProFormSelect
                    showSearch
                    debounceTime={300}
                    placeholder="请输入员工名称"
                    request={({ keyWords }) => {
                        return switchSelectFetchFn("user", keyWords)
                    }}
                />
            )
        },
    },
    {
        title: "员工编号",
        key: "id",
        dataIndex: "id",
        width: 100,
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "姓名",
        key: "name",
        fixed: "left",
        width: 150,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "员工登录名",
        key: "username",
        width: 150,
        dataIndex: "username",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "岗位名称",
        key: "stationName",
        width: 150,
        dataIndex: "stationName",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "性别",
        key: "gender",
        width: 150,
        dataIndex: "gender",
        copyable: true,
        ellipsis: true,
        render: (_, entity) => {
            return entity.gender === 1 ? "男" : "女"
        },
        hideInSearch: true,
    },
    {
        title: "角色名",
        width: 120,
        key: "roleName",
        dataIndex: "roleName",
        hideInSearch: true,
        copyable: true,
    },
    {
        title: "操作",
        valueType: "option",
        key: "option",
        fixed: "right",
        width: 300,
        render: (dom, record, _, action) => [
            <span key={"put"}>
                {record.stationId ? null : (
                    <MyModalForm
                        title="添加员工岗位"
                        btnName="添加员工岗位"
                        onFormSubmit={async (values) =>
                            onFinishPutPost(record.id, values.stationId, action)
                        }
                    >
                        <FromItem id={record.id} />
                    </MyModalForm>
                )}
            </span>,
            <DeleteUserStation
                id={record.id}
                stationId={record.stationId}
                action={action}
                key="delStation"
            />,
            <Button
                key="putUser"
                onClick={() => {
                    setEditConfig({
                        ...editConfig,
                        data: record,
                        isOpen: true,
                    })
                }}
                type="text"
                style={{ color: "#108ee9" }}
            >
                修改员工信息
            </Button>,
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
                修改密码
            </Button>,

            <Popconfirm
                key="delete"
                title="此操作是不可逆的，确定删除吗"
                onConfirm={async () => {
                    const result = await deleteUser(record.id)
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
                    删除员工
                </Button>
            </Popconfirm>,
        ],
    },
]

function FromItem({ id }: { id: string }) {
    return (
        <>
            <ProFormText
                name="id"
                width="md"
                label="用户编号"
                fieldProps={{
                    disabled: true,
                    value: id,
                }}
            />
            <MyFormSelect name="stationId" label="选择岗位" type="station" />
        </>
    )
}

function DeleteUserStation({ id, stationId, action }) {
    if (!stationId) return null

    return (
        <Popconfirm
            title="删除用户岗位"
            description="此操作是不可逆的，确定删除吗？"
            onConfirm={async () => {
                const result = await delUserPostAPI(id, stationId)
                if (result.data) {
                    message.success(result.message)
                    action?.reload()
                }
            }}
            okText="是的"
            cancelText="取消"
        >
            <Button type="text" danger>
                删除员工岗位
            </Button>
        </Popconfirm>
    )
}
