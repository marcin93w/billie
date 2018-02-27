export type Debt = {
    id: string,
    user1: string, 
    user2: string, 
    threadId: string, 
    debtType: number, 
    amount: number, 
    date: Date,
    comment: string,
    isCanceled: boolean,
    canceledByCreator: boolean
}

export type PendingDebt = {
    id: string,
    userId: string, 
    threadId: string, 
    debtType: number, 
    amount: number, 
    date: Date,
    comment: string,
    isCanceled: boolean
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
