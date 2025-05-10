export interface WithdrawRequest {
  amount: number;
  otp: string;
  bankAccountNumber: string;
  bankName: string;
  bankAccount: string;
}

export interface Transaction {
  createdAt: string;
  id: string;
  description: string;
  amount: number;
  type: string;
  transactionCode: string;
}
