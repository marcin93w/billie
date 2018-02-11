export type Debt = {
    id: string,
    user1: string, 
    user2: string, 
    threadId: string, 
    debtType: number, 
    amount: number, 
    date: Date
}

export type PendingDebt = {
    id: string,
    userId: string, 
    threadId: string, 
    debtType: number, 
    amount: number, 
    date: Date
}

export type User = {
    id: string, 
    psid: string, 
    fbid: string, 
    name: string, 
    fullName: string, 
    gender: string, 
    avatarUrl: string
}

export type UserDebtBalance = {
    userId: string,
    name: string,
    fullName: string,
    gender: string,
    avatarUrl: string,
    amount: number
}
