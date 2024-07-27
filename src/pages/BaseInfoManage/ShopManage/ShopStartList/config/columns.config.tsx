import React from "react"
import {
    Button,
    Popconfirm,
    message,
    Tag,
    Table,
    Space,
    Divider,
    List,
    Skeleton,
    Avatar,
} from "antd"
import type { Dispatch, SetStateAction } from "react"
import { ProFormSelect, type ProColumns } from "@ant-design/pro-components"
import type { ActionType } from "@ant-design/pro-table"

import type { TableListItem, ModifyConfigProps } from "../index"
import { putStoreStatusAPI, delStoreDitchAPI, delStoreStaffAPI, delSellDistAPI } from "@/apis/shop"
import { switchSelectFetchFn } from "@/components/FormSelect"

type ModifyTable = ModifyConfigProps<TableListItem>
const handleModifyStore = (
    record: TableListItem,
    setModifyConfig: Dispatch<SetStateAction<ModifyTable>>
) => {
    setModifyConfig((modifyConfig) => ({
        ...modifyConfig,
        data: record,
        isOpen: true,
    }))
}

const handleStatusChange = async (
    record: TableListItem,
    actionRef: React.MutableRefObject<ActionType | undefined>
) => {
    const result = await putStoreStatusAPI(record.storeId)
    if (result.data) {
        message.success(result.message)
        actionRef.current?.reload()
    } else {
        message.error(result.message)
    }
}

const handleDelete = async (
    record: TableListItem,
    actionRef: React.MutableRefObject<ActionType | undefined>
) => {
    const result = await delStoreStaffAPI({ userId: record.id, storeId: record.storeId })
    if (result.data) {
        message.success(result.message)
        actionRef.current?.reload()
    }
}

const userColumns = (
    setModifyConfig: Dispatch<SetStateAction<ModifyTable>>,
    actionRef: React.Ref<ActionType | undefined>
): ProColumns<{
    id: string
    name: string
    status: number
    storeName: string
    storeId: string
}>[] => [
    {
        title: "员工名称",
        dataIndex: "userId",
        key: "userId",
        hideInTable: true,
        width: 200,
        renderFormItem(schema, config, form, action) {
            return (
                <ProFormSelect
                    style={{ width: "200px" }}
                    showSearch
                    debounceTime={300}
                    placeholder="请选择员工"
                    request={({ keyWords }) => {
                        return switchSelectFetchFn("user", keyWords)
                    }}
                />
            )
        },
    },
    {
        title: "店铺负责人",
        dataIndex: "name",
        key: "name",
        hideInSearch: true,
    },
    {
        title: "店铺ID",
        dataIndex: "storeId",
        hideInSearch: true,
    },
    {
        title: "店铺名",
        dataIndex: "storeName",
        hideInSearch: true,
    },
    {
        title: "店铺状态",
        dataIndex: "status",
        hideInSearch: true,
        render(dom, entity, index, action, schema) {
            return (
                <Tag color={entity.status ? "red" : "green"}>
                    {entity.status ? "店铺已经关闭" : "店铺开启中"}
                </Tag>
            )
        },
    },
    {
        title: "操作",
        valueType: "option",
        width: 120,
        key: "option",
        render: (dom, record) => [
            <Button
                key="modifyStore"
                type="primary"
                size="small"
                onClick={() => handleModifyStore(record, setModifyConfig)}
            >
                新增店铺渠道
            </Button>,
            <Popconfirm
                title="修改店铺状态"
                key="status"
                onConfirm={() => handleStatusChange(record, actionRef)}
                okText="是的"
                cancelText="取消"
            >
                <Button size="small" type="primary">
                    修改店铺状态
                </Button>
            </Popconfirm>,
            <Popconfirm
                title="删除用户店铺"
                key="delete"
                onConfirm={() => handleDelete(record, actionRef)}
                okText="是的"
                cancelText="取消"
            >
                <Button size="small" danger>
                    删除
                </Button>
            </Popconfirm>,
        ],
    },
]

const ditchColumns = (
    setModifyConfig,
    actionRef,
    storeId,
    showDrawer,
    setIsModalCostOpen,
    setCostProps,
    setModifyEditConfig
) => [
    { title: "渠道名称", dataIndex: "name", key: "name" },
    {
        title: "平台列表",
        dataIndex: "sellList",
        key: "sellList",
        render: (dom, record) => {
            return (
                <List
                    dataSource={record.sellList}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <a
                                    key="list-loadmore-edit"
                                    onClick={() => {
                                        showDrawer(record.id, item.id)
                                    }}
                                >
                                    查看成本
                                </a>,
                                <a
                                    key="list-loadmore-edit"
                                    onClick={() => {
                                        setCostProps((prevCostProps) => ({
                                            ...prevCostProps,
                                            ditchId: record.id,
                                            sellId: item.id,
                                        }))

                                        setIsModalCostOpen((prevModalCost) => ({
                                            ...prevModalCost,
                                            isOpen: true,
                                        }))
                                    }}
                                >
                                    添加成本与销售额
                                </a>,
                                <Popconfirm
                                    title="删除"
                                    key="delete"
                                    onConfirm={async () => {
                                        const result = await delSellDistAPI(record.id, item.id)
                                        if (result.data) {
                                            message.success(result.message)
                                            actionRef.current?.reload()
                                        }
                                    }}
                                    okText="是的"
                                    cancelText="取消"
                                >
                                    <a type="danger">删除渠道平台</a>
                                </Popconfirm>,
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <a
                                        onClick={() => {
                                            showDrawer(record.id, item.id)
                                        }}
                                    >
                                        {item.name}
                                    </a>
                                }
                                description={`ID: ${item.id}`}
                            />
                        </List.Item>
                    )}
                />
            )
        },
    },
    {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        valueType: "option",
        render: (dom, record, _, action) => [
            <Button
                type="text"
                key="edit"
                style={{ color: "#1677FF" }}
                onClick={() => {
                    setModifyEditConfig((modifyEditConfig) => ({
                        ...modifyEditConfig,
                        id: record.id,
                        isOpen: true,
                    }))
                }}
            >
                编辑渠道
            </Button>,
            <a
                key="modifyStore"
                onClick={() => {
                    setModifyConfig((modifyConfig) => ({
                        ...modifyConfig,
                        id: record.id,
                        isOpen: true,
                    }))
                }}
            >
                新增渠道平台
            </a>,
            <Popconfirm
                title="是否删除店铺渠道"
                key="delete"
                onConfirm={async () => {
                    const result = await delStoreDitchAPI({ id: storeId, ditchId: record.id })
                    if (result.data) {
                        message.success(result.message)
                        action?.reload()
                    }
                }}
                okText="是的"
                cancelText="取消"
            >
                <a type="danger">删除渠道</a>
            </Popconfirm>,
        ],
    },
]

const searchConfig = {
    labelWidth: 120,
    defaultCollapsed: false,
    collapsed: false,
    collapseRender: (collapsed, onCollapse) => (
        <a onClick={onCollapse}>{collapsed ? "展开" : "折叠"}</a>
    ),
    optionRender: (searchConfig, formProps, dom) => [...dom],
    searchText: "查询",
    resetText: "重置",
    span: { xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 },
}

export { userColumns, ditchColumns, searchConfig }
