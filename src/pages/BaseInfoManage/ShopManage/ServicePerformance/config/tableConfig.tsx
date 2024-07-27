import { Button, Popconfirm } from "antd"
import type { Service } from "@/apis/shop"
import { switchSelectFetchFn } from "@/components/FormSelect"
import { ProFormSelect } from "@ant-design/pro-components"
import dayjs from "dayjs"

export const columns = (
    deleteService: (id: string, action: any) => void,
    setModifyConfig: (data: Service) => void,
    initialSearchParams: { userId: string } | undefined
) => [
    { title: "客服绩效id", dataIndex: "id", key: "id", hideInSearch: true },
    {
        title: "客服名称",
        dataIndex: "userId",
        key: "userId",
        width: 120,
        hideInTable: true,
        renderFormItem(schema, config, form, action) {
            return (
                <ProFormSelect
                    showSearch
                    debounceTime={300}
                    placeholder="请选择客服名称"
                    request={({ keyWords }) => {
                        return switchSelectFetchFn("user", keyWords)
                    }}
                />
            )
        },
    },
    {
        title: "客服名",
        dataIndex: "userName",
        key: "userName",
        hideInSearch: true,
        copyable: true,
    },
    {
        title: "绩效月份",
        key: "serviceTime",
        dataIndex: "serviceTime",
        valueType: "dateMonth",
        initialValue: dayjs().format("YYYY-MM"),
    },

    { title: "店铺名称", dataIndex: "storeName", key: "storeName", hideInSearch: true },
    { title: "实销金额", dataIndex: "actualValue", key: "actualValue", hideInSearch: true },
    {
        title: "实际佣金",
        dataIndex: "actualCommission",
        key: "actualCommission",
        hideInSearch: true,
    },
    { title: "退款金额", dataIndex: "refundValue", key: "refundValue", hideInSearch: true },
    {
        title: "退款佣金",
        dataIndex: "refundCommission",
        key: "refundCommission",
        hideInSearch: true,
    },
    {
        title: "操作",
        key: "action",
        hideInSearch: true,
        render: (dom, entity, index, action) => [
            <Button
                key="put"
                style={{ marginRight: "10px" }}
                onClick={() =>
                    setModifyConfig({ data: entity, isOpen: true, type: "edit", isLoading: true })
                }
            >
                修改客服绩效
            </Button>,
            <Popconfirm
                key="delete"
                title="删除"
                onConfirm={() => deleteService(entity.id, action)}
                okText="是的"
                cancelText="取消"
            >
                <Button size="small" type="danger">
                    删除
                </Button>
            </Popconfirm>,
        ],
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
