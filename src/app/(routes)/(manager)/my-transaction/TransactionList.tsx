import React from "react";
import { Transaction } from "@/types/wallet";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/lib/client/utils";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const getTransactionTypeLabel = (type: string): string => {
  switch (type) {
    case "ThirdPartyPayment":
      return "Thanh toán";
    case "Withdraw":
      return "Rút tiền";
    case "Refund":
      return "Hoàn tiền";
    default:
      return type;
  }
};

const getTypeStyle = (type: string): string => {
  switch (type) {
    case "ThirdPartyPayment":
      return "text-amber-600 bg-amber-50";
    case "Withdraw":
      return "text-red-600 bg-red-50";
    case "Refund":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-blue-500 border-l-transparent border-r-transparent border-t-blue-500"></div>
          <p className="ml-2 text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-lg border py-8 text-center">
        <p className="text-gray-500">Chưa có giao dịch nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Ngày giao dịch
            </th>
            <th scope="col" className="px-6 py-3">
              Nội dung
            </th>
            <th scope="col" className="px-6 py-3">
              Loại giao dịch
            </th>
            <th scope="col" className="px-6 py-3">
              Mã giao dịch
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Số tiền
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b bg-white hover:bg-gray-50"
            >
              <td className="whitespace-nowrap px-6 py-4">
                {formatDate(transaction.createdAt)}
              </td>
              <td className="px-6 py-4">{transaction.description}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-2 py-1 text-xs font-bold ${getTypeStyle(transaction.type)}`}
                >
                  {getTransactionTypeLabel(transaction.type)}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs">
                {transaction.transactionCode}
              </td>
              <td
                className={`whitespace-nowrap px-6 py-4 text-right font-semibold ${
                  transaction.type === "Withdraw"
                    ? "text-red-600"
                    : transaction.type === "Refund"
                      ? "text-green-600"
                      : transaction.type === "ThirdPartyPayment"
                        ? "text-amber-600"
                        : "text-gray-600"
                }`}
              >
                {formatPrice(transaction.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
