import type { ProColumns } from "@ant-design/pro-components"
import type { MonthlyItem } from "@/apis/monthly"
import { DatePicker } from "antd"
import moment from "moment"
import type { Moment } from "moment"

const disabledDate = (current: Moment | null): boolean => {
    return current ? current < moment("2023-12") || current > moment("2025-01") : false
}

export const columns: () => ProColumns<MonthlyItem>[] = () => [
    {
        title: "员工编号",
        key: "id",
        fixed: "left",
        dataIndex: "id",
        width: 100,
        copyable: true,

        hideInSearch: true,
    },
    {
        title: "员工姓名",
        key: "name",
        width: 80,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "应出勤天数",
        dataIndex: "expectedAttendanceDays",
        hideInSearch: true,
    },
    {
        title: "实际出勤天数",
        dataIndex: "actualAttendanceDays",
        hideInSearch: true,
    },
    {
        title: "计薪时长（小时）",
        dataIndex: "paidHours",
        hideInSearch: true,
    },
    {
        title: "迟到次数",
        dataIndex: "lateCount",
        hideInSearch: true,
    },
    {
        title: "请假天数",
        dataIndex: "leaveDays",
        hideInSearch: true,
    },
    {
        title: "计算后的迟到次数",
        dataIndex: "calculatedLateCount",
        hideInSearch: true,
    },
    {
        title: "当前月份",
        dataIndex: "monthYear",
        hideInSearch: true,
    },
    {
        title: "选择要查询的日期",
        key: "month_year",
        dataIndex: "month_year",
        hideInTable: true,
        valueType: "dateMonth",
        renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
            if (type === "form") {
                // 在表单模式下自定义渲染
                return <DatePicker picker="month" disabledDate={disabledDate} {...rest} />
            }
            // 默认渲染
            return defaultRender(_)
        },

        initialValue: moment().format("YYYY-MM"),
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
