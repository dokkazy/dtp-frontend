export interface WithdrawRequest {
    amount: number;
    otp: string;
    bankAccountNumber: string;
    bankName: string;
    bankAccount: string
}