import request from "@/utils/request"
import type { PageReq, PageRes, Result } from "@/type"

export interface UserType<T> {
    id: string
    name: string
    paySheetList: T[]
}

export interface EmployeeCompensation {
    id: string
    userId: string
    basicWage: number
    performance: number
    allDay: number
    rate: string
    rateBonus: number
    specialBonus: number
    allowance: number
    leaveDays: number
    deduct: number
    late: number
    assessDel: number
    grantTime: string
}

export interface AddEmployeeCompensation {
    userId: string
    basicWage: number
    allDay: number
    rate: string
    rateBonus: number
    specialBonus: number
    allowance: number
    leaveDays: number
    deduct: number
    late: number
    assessDel: number
    grantTime: string
}

interface PaySearch {
    userId?: string
    date?: string
}

export type GetPayList = PageReq<PaySearch>
export type GetPayType = UserType<EmployeeCompensation>
export type UserLeaveDaysResponse = {
    // * 用户的请假天数和迟到次数
    late_count: number
    leave_days: number
}

export const getPayListAPI = (data: PageReq<PaySearch>): Promise<Result<PageRes<GetPayType>>> =>
    request("/pay/list", { method: "POST", data })

/**
 * 修改工资
 * @param data
 * @returns
 */
export const putPayAPI = (data: EmployeeCompensation): Promise<Result<boolean>> =>
    request("/pay", { method: "PUT", data })

/**
 * 添加工资
 * @param data
 * @returns
 */
export const addPayAPI = (data: AddEmployeeCompensation): Promise<Result<boolean>> =>
    request("/pay/add", { method: "POST", data })

/**
 * 删除工资
 * @param data  { id: string }
 * @returns
 */
export const delPayAPI = (data: { id: string }): Promise<Result<boolean>> =>
    request("/pay", { method: "DELETE", data })

/**
 * 获取用户的请假天数和迟到次数
 * @param data - { "name": "string", "month_year": "string"}
 * @returns - { "code": 0, "message": "string", "data": {"late_count": 0,"leave_days": 0}}
 */
export const getUserLeaveDaysAPI = (data: {
    name: string
    month_year: string
}): Promise<Result<UserLeaveDaysResponse>> => request("/monthly/user", { method: "POST", data })
