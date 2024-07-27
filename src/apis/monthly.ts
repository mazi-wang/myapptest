import request from "@/utils/request"
import type { PageReq, PageRes, Result } from "@/type"

interface DailyRecord {
    hour: number
    minute: number
    second: number
    nano: number
}

export interface MonthlyItem {
    id: number
    name: string
    expectedAttendanceDays: number
    actualAttendanceDays: number
    paidHours: number
    lateCount: number
    leaveDays: number
    calculatedLateCount: number
    monthYear: string
    dailyRecords: Record<string, DailyRecord>
}

/**
 * 考勤表
 * @param monthYear
 */
export const getMonthlyListAPI = (
    data: PageReq<{ month_year: string }>
): Promise<Result<PageRes<MonthlyItem>>> => {
    return request("/monthly/get", {
        method: "POST",
        data,
    })
}

/**
 *  导入考勤表
 */
export const importMonthlyFileAPI = (file: File): Promise<Result<string[]>> => {
    const data = new FormData()
    data.append("file", file)
    return request("/monthly/import", {
        method: "POST",
        data,
    })
}

/**
 * 导出考勤表
 * @param pathList 菜单path列表
 */
export const exportMonthlyAPI = (): Promise<Blob> => {
    return request("/monthly/export", {
        method: "GET",
    })
}

// * 考勤表
