import { Button, Form, Popconfirm } from "antd"
import {
    ProForm,
    ProFormDatePicker,
    ProFormSelect,
    type ActionType,
    type ProColumns,
} from "@ant-design/pro-components"

import type { EmployeeCompensation } from "@/apis/pay"
import type { OnDeleteFn, ChangeModalFn } from "./usePay"
import { switchSelectFetchDebounce, switchSelectFetchFn } from "@/components/FormSelect"
import dayjs from "dayjs"

export const columns = (
    initialSearchParams: any | undefined | null,
    _records: any,
    changeModal: ChangeModalFn,
    actionRef: React.MutableRefObject<ActionType | undefined>,
    handleDeleteFunction: OnDeleteFn
): ProColumns<{ id: string; name: string }>[] => [
    { title: "工资ID", dataIndex: "id", key: "id", hideInSearch: true },
    {
        title: "用户",
        dataIndex: "userName",
        key: "userName",
        hideInSearch: true,
    },
    {
        title: "选择用户",
        dataIndex: "userId",
        key: "userId",
        ellipsis: true,
        hideInTable: true,
        valueType: "select",
        request: ({ keyWords }) => {
            return switchSelectFetchFn("user", keyWords)
        },
        fieldProps: {
            labelInValue: false,
            showSearch: true,
            style: {
                minWidth: 140,
            },
        },
        debounceTime: 800,
        initialValue: initialSearchParams?.user_id || undefined,
    },
    {
        title: "发工资月份",
        dataIndex: "date",
        key: "date",
        valueType: "dateMonth",
        hideInTable: true,
        initialValue: initialSearchParams?.dateMonth || dayjs().format("YYYY-MM"),
    },

    {
        title: "发工资月份",
        dataIndex: "grantTime",
        key: "grantTime",
        valueType: "dateMonth",
        hideInSearch: true,
    },

    { title: "基本工资", dataIndex: "basicWage", key: "basicWage", hideInSearch: true },
    { title: "绩效", dataIndex: "performance", key: "performance", hideInSearch: true },
    { title: "全勤奖金", dataIndex: "allDay", key: "allDay", hideInSearch: true },
    { title: "月末评级", dataIndex: "rate", key: "rate", hideInSearch: true },
    { title: "评级奖金", dataIndex: "rateBonus", key: "rateBonus", hideInSearch: true },
    { title: "特殊奖金", dataIndex: "specialBonus", key: "specialBonus", hideInSearch: true },
    { title: "特殊津贴", dataIndex: "allowance", key: "allowance", hideInSearch: true },
    { title: "请假天数", dataIndex: "leaveDays", key: "leaveDays", hideInSearch: true },
    { title: "请假扣除", dataIndex: "deduct", key: "deduct", hideInSearch: true },
    { title: "迟到次数", dataIndex: "late", key: "late", hideInSearch: true },
    { title: "考勤扣除", dataIndex: "assessDel", key: "assessDel", hideInSearch: true },
    { title: "应发薪资", dataIndex: "salary", key: "salary", hideInSearch: true },

    {
        title: "操作",
        key: "option",
        hideInSearch: true,
        render(dom, entity, index, action, schema) {
            return [
                <Button
                    type="link"
                    onClick={() =>
                        changeModal({
                            isOpen: true,
                            isLoading: true,
                            data: { ...entity },
                            type: "edit",
                        })
                    }
                    key={"edit"}
                >
                    编辑员工工资
                </Button>,

                <Popconfirm
                    key="delete"
                    title="此操作是不可逆的，确定删除吗？"
                    onConfirm={async () => {
                        handleDeleteFunction(entity.id, action)
                        actionRef.current?.reload()
                    }}
                >
                    <Button type="text" danger>
                        删除
                    </Button>
                </Popconfirm>,
            ]
        },
    },
]

export const tableColumns = (
    handleDeleteFunction: OnDeleteFn,
    changeModal: ChangeModalFn,
    actionRef: React.MutableRefObject<ActionType | undefined>
): ProColumns<EmployeeCompensation>[] => [
    { title: "工资ID", dataIndex: "id", key: "id" },
    {
        title: "用户ID",
        dataIndex: "userId",
        key: "userId",
        ellipsis: true,
    },
    { title: "基本工资", dataIndex: "basicWage", key: "basicWage" },
    { title: "绩效", dataIndex: "performance", key: "performance" },
    { title: "全勤奖金", dataIndex: "allDay", key: "allDay" },
    { title: "月末评级", dataIndex: "rate", key: "rate" },
    { title: "评级奖金", dataIndex: "rateBonus", key: "rateBonus" },
    { title: "特殊奖金", dataIndex: "specialBonus", key: "specialBonus" },
    { title: "特殊津贴", dataIndex: "allowance", key: "allowance" },
    { title: "请假天数", dataIndex: "leaveDays", key: "leaveDays" },
    { title: "请假扣除", dataIndex: "deduct", key: "deduct" },
    { title: "迟到次数", dataIndex: "late", key: "late" },
    { title: "考勤扣除", dataIndex: "assessDel", key: "assessDel" },
    { title: "应发薪资", dataIndex: "salary", key: "salary" },
    { title: "发工资月份", dataIndex: "grantTime", key: "grantTime", valueType: "date" },
    {
        title: "操作",
        dataIndex: "option",
        valueType: "option",
        render: (_, entity, index, action) => [
            <Popconfirm
                key="delete"
                title="此操作是不可逆的，确定删除吗？"
                onConfirm={async () => {
                    handleDeleteFunction(entity.id, action)
                    actionRef.current?.reload()
                }}
            >
                <Button type="danger">删除</Button>
            </Popconfirm>,
            <Button
                key={"put"}
                onClick={() => {
                    changeModal({ data: entity, isOpen: true, isLoading: true, type: "edit" })
                }}
            >
                修改
            </Button>,
        ],
    },
]

export const searchConfig = {
    labelWidth: 120,
    defaultCollapsed: false,
    collapsed: false,
    collapseRender: (collapsed, onCollapse) => (
        <Button type="link" onClick={onCollapse}>
            {collapsed ? "展开" : "折叠"}
        </Button>
    ),
    optionRender: (searchConfig, formProps, dom) => [...dom],
    searchText: "查询",
    resetText: "重置",
    span: { xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 },
}
