import type { BadgeProps } from "antd"
import { Badge, Calendar } from "antd"
import type { Moment } from "moment"
import moment from "moment"
import React from "react"

const getListData = (date: string, data: [string, string | null][]) => {
    const t = data.find((item) => item[0] === date)
    if (t) {
        return [
            t[1] ? { type: "success", content: t[1] } : { type: "warning", content: "记录为空" },
        ]
    } else {
        return [{ type: "error", content: "没有记录" }]
    }
}

const getMonthData = (value: Moment) => {
    if (value.month() === 8) {
        return 1394
    }
}

const currentYear = moment().year()

const CalendarApp: React.FC<{ dataRender: Record<string, string> }> = ({ dataRender }) => {
    let month, day
    const processedData = Object.entries(dataRender).map(([key, value]) => {
        // 提取月份和日期
        const [dayOfWeek, monthDay] = key.split("\n")
        ;[month, day] = monthDay.split("-")

        // 创建日期对象
        const date = moment(`${currentYear}-${month}-${day}`, "YYYY-MM-DD")

        // 格式化日期
        const formattedDate = date.format("YYYY-MM-DD")

        // 将日期与时间结合起来
        const dateTime = formattedDate

        const content = value ? `打卡时间：${value}` : null

        return {
            dayOfWeek,
            dateData: [dateTime, content] as [string, string | null],
        }
    })

    const dataMonth = moment(`${currentYear}-${month}-01`, "YYYY-MM-DD")
    const validRange: [Moment, Moment] = [dataMonth.startOf("month"), dataMonth.endOf("month")]

    const monthCellRender = (value: Moment) => {
        const num = getMonthData(value)
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null
    }

    const dateCellRender = (value: Moment) => {
        const listData = getListData(
            value.format("YYYY-MM-DD"),
            processedData.map((item) => item.dateData)
        )
        return (
            <ul className="events">
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type as BadgeProps["status"]} text={item.content} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <Calendar
            headerRender={() => null}
            defaultValue={dataMonth}
            validRange={validRange}
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
        />
    )
}

export default CalendarApp
