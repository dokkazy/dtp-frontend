import React from 'react';
import { Transaction } from '@/types/wallet';
import { formatDate } from '@/lib/utils';
import { formatPrice } from '@/lib/client/utils';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const getTransactionTypeLabel = (type: string): string => {
  switch (type) {
    case 'ThirdPartyPayment':
      return 'Thanh toán';
    case 'Withdraw':
      return 'Rút tiền';
    default:
      return type;
  }
};

const getTypeStyle = (type: string): string => {
  switch (type) {
    case 'ThirdPartyPayment':
      return 'text-amber-600 bg-amber-50';
    case 'Withdraw':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-r-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="ml-2 text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-gray-500">Chưa có giao dịch nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Ngày giao dịch</th>
            <th scope="col" className="px-6 py-3">Nội dung</th>
            <th scope="col" className="px-6 py-3">Loại giao dịch</th>
            <th scope="col" className="px-6 py-3">Mã giao dịch</th>
            <th scope="col" className="px-6 py-3 text-right">Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(transaction.createdAt)}
              </td>
              <td className="px-6 py-4">
                {transaction.description}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeStyle(transaction.type)}`}>
                  {getTransactionTypeLabel(transaction.type)}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs">
                {transaction.transactionCode}
              </td>
              <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${
                transaction.type === 'Withdraw' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'Withdraw' ? '+ ' : ''}{formatPrice(transaction.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;