import type { Dispatch, SetStateAction } from "react"
import {
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    type ProColumns,
} from "@ant-design/pro-components"
import { Button, message, Popconfirm, Tag } from "antd"
import { addStoreDitchAPI, addStoreStaffAPI, deleteStoreAPI, putStoreStatusAPI } from "@/apis/shop"
import type { EditConfigProps, ModifyPwdConfigProps } from "@/pages/UserManage/UserList/index"
import MyModalForm from "@/components/ModalForm"
import {
    MyFormSelect,
    switchSelectFetchDebounce,
    switchSelectFetchFn,
} from "@/components/FormSelect"

interface ShopState {
    id: string
    name: string
    status: number
}

// * 店铺添加用户
const onFinishStaffStore: FormProps<{ id: string; userId: string }>["onFinish"] = async (
    values,
    storeId
) => {
    const shop = {
        storeId: storeId,
        id: values.userId,
    }
    const result = await addStoreStaffAPI(shop.id, shop.storeId)
    if (result.data) {
        message.success(result.message)
        return true
    } else return false
}

// * 店铺添加渠道
const onFinishDitchStore: FormProps<{ id: string; userId: string }>["onFinish"] = async (
    values,
    id
) => {
    const shop = {
        id,
        ditchName: values.name,
    }
    console.log("shop: ", shop)
    const result = await addStoreDitchAPI(shop.id, shop.ditchName)
    if (result.data) {
        message.success(result.message)
        return true
    } else return false
}

export const columns: (
    editConfig: EditConfigProps,
    setEditConfig: Dispatch<SetStateAction<EditConfigProps>>,
    modifyPwdConfig: ModifyPwdConfigProps,
    setModifyPwdConfig: Dispatch<SetStateAction<ModifyPwdConfigProps>>
) => ProColumns<ShopState>[] = (editConfig, setEditConfig, modifyPwdConfig, setModifyPwdConfig) => [
    {
        title: "选择店铺",
        dataIndex: "id",
        key: "id",
        width: 100,
        hideInTable: true,
        renderFormItem(schema, config, form, action) {
            return (
                <ProFormSelect
                    showSearch
                    debounceTime={300}
                    placeholder="请选择店铺"
                    request={({ keyWords }) => {
                        return switchSelectFetchFn("store", keyWords)
                    }}
                />
            )
        },
    },
    {
        title: "店铺名称",
        key: "name",
        width: 50,
        dataIndex: "name",
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "状态",
        width: 40,
        dataIndex: "status",
        search: false,
        render: (dom) =>
            dom ? <Tag color="red">店铺已禁用</Tag> : <Tag color="green">店铺已启用</Tag>,
    },
    {
        title: "操作",
        valueType: "option",
        key: "option",
        width: 120,
        render: (dom, record, _, action) => [
            <MyModalForm
                btnName="店铺管理员工"
                title="添加店铺管理员工"
                key={"addStoreAdmin"}
                onFormSubmit={(values) => onFinishStaffStore(values, record.id)}
            >
                <>
                    <ProFormText
                        name="id"
                        width="md"
                        label="店铺ID"
                        fieldProps={{
                            disabled: true,
                            value: record.id,
                        }}
                    />
                    <ProFormSelect
                        name="userId"
                        label="选择员工"
                        fieldProps={{
                            showSearch: true,
                            filterOption: false,
                        }}
                        request={async (params) => {
                            return await switchSelectFetchDebounce("user", params.keyWords)
                        }}
                    />
                </>
            </MyModalForm>,

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
                编辑店铺信息
            </Button>,

            <Popconfirm
                title="修改店铺状态"
                key="status"
                onConfirm={async () => {
                    const result = await putStoreStatusAPI(record.id)
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
                <Button size={"small"} type="link">
                    修改店铺状态
                </Button>
            </Popconfirm>,

            <Popconfirm
                title="删除"
                description="此操作是不可逆的，确定删除吗？"
                key="delete"
                onConfirm={async () => {
                    const result = await deleteStoreAPI(record.id)
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
                <Button size={"small"} type="danger">
                    删除
                </Button>
            </Popconfirm>,
        ],
    },
]
