import { Button, Popconfirm } from "antd"
import type { Service } from "@/apis/shop"

import { switchSelectFetchFn } from "@/components/FormSelect"
import { ProFormSelect } from "@ant-design/pro-components"
import dayjs from "dayjs"

export const columns = (setModifyConfig) => [
    {
        title: "店铺名称",
        dataIndex: "store_id",
        key: "store_id",
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
        hideInTable: true,
    },
    {
        title: "店铺ID",
        dataIndex: "storeId",
        key: "storeId",
        hideInSearch: true,
    },
    {
        title: "店铺名称",
        dataIndex: "storeName",
        key: "userId",
        hideInSearch: true,
        ellipsis: true,
        copyable: true,
    },
    {
        title: "操作",
        key: "action",
        hideInSearch: true,
        render: (dom, entity, index, action, schema) => [
            <span key="add">
                <Button
                    type="dashed"
                    color="red"
                    onClick={() => {
                        setModifyConfig((prevConfig) => ({
                            ...prevConfig,
                            isOpen: true,
                            data: {
                                storeId: entity.storeId,
                                swipingTime: dayjs().format("YYYY-MM-DD"),
                            },
                        }))
                    }}
                >
                    添加刷单
                </Button>
            </span>,
        ],
    },
    {
        title: "时间",
        key: "date",
        dataIndex: "date",
        hideInTable: true,
        valueType: "dateMonth",
    },
]

export const searchConfig = {
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

export const childColumns = (
    deleteService: (id: string, action: any) => void,
    openPutServiceModal: (data: Service) => void,
    action: any
) => [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "刷单时间",
        dataIndex: "swipingTime",
        key: "swipingTime",
        valueType: "date",
    },
    {
        title: "链接属性",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "订单号",
        dataIndex: "number",
        key: "number",
    },
    {
        title: "佣金",
        dataIndex: "money",
        key: "money",
    },
    {
        title: "次数",
        dataIndex: "degree",
        key: "degree",
    },
    {
        title: "返还金额",
        dataIndex: "refund",
        key: "refund",
    },
    {
        title: "用户名",
        dataIndex: "userName",
        key: "userName",
    },
    {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
    },
    {
        title: "返款日期",
        dataIndex: "refundTime",
        key: "refundTime",
    },
    {
        title: "操作",
        key: "action",
        fixed: "right", // 固定在右侧
        width: 100,
        render: (_, entity) => [
            <div
                key={"action"}
                style={{
                    display: "flex",
                    flexWrap: "wrap-reverse",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Popconfirm
                    key="delete"
                    title="删除"
                    onConfirm={() => deleteService(entity.id, action)}
                    okText="是的"
                    cancelText="取消"
                >
                    <Button size="small" danger>
                        删除
                    </Button>
                </Popconfirm>
                <Button
                    key={"put"}
                    onClick={() => {
                        openPutServiceModal(entity)
                    }}
                >
                    修改刷单
                </Button>
            </div>,
        ],
    },
]
