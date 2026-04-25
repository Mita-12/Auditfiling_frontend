import React, { useState } from 'react';

const PaymentHistory = () => {
  const [activeTab, setActiveTab] = useState('full');

  // Static Full Payment Data
  const fullPayments = [
    { id: 1, paymentId: 'PAY-1001', userName: 'John Doe', paymentMode: 'Credit Card', paymentType: 'Full', serviceName: 'Premium Subscription', status: 'Completed' },
    { id: 2, paymentId: 'PAY-1002', userName: 'Jane Smith', paymentMode: 'PayPal', paymentType: 'Full', serviceName: 'Annual Maintenance', status: 'Completed' },
    { id: 3, paymentId: 'PAY-1003', userName: 'Robert Johnson', paymentMode: 'Debit Card', paymentType: 'Full', serviceName: 'Cloud Storage', status: 'Pending' },
    { id: 4, paymentId: 'PAY-1004', userName: 'Emily Davis', paymentMode: 'Bank Transfer', paymentType: 'Full', serviceName: 'Web Development', status: 'Completed' },
    { id: 5, paymentId: 'PAY-1005', userName: 'Michael Brown', paymentMode: 'Credit Card', paymentType: 'Full', serviceName: 'SEO Optimization', status: 'Failed' }
  ];

  // Static Partial Payment Data
  const partialPayments = [
    { id: 1, paymentId: 'PPAY-2001', userName: 'Sarah Wilson', paymentMode: 'Credit Card', paymentType: 'Partial', serviceName: 'Consulting Services', status: 'Partial' },
    { id: 2, paymentId: 'PPAY-2002', userName: 'David Lee', paymentMode: 'PayPal', paymentType: 'Partial', serviceName: 'Software License', status: 'Partial' },
    { id: 3, paymentId: 'PPAY-2003', userName: 'Lisa Anderson', paymentMode: 'Debit Card', paymentType: 'Partial', serviceName: 'Marketing Package', status: 'Pending' },
    { id: 4, paymentId: 'PPAY-2004', userName: 'James Taylor', paymentMode: 'Bank Transfer', paymentType: 'Partial', serviceName: 'IT Support', status: 'Partial' },
    { id: 5, paymentId: 'PPAY-2005', userName: 'Maria Garcia', paymentMode: 'Credit Card', paymentType: 'Partial', serviceName: 'Training Program', status: 'Overdue' }
  ];

  const getStatusBadge = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800',
      'Partial': 'bg-blue-100 text-blue-800',
      'Overdue': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const currentData = activeTab === 'full' ? fullPayments : partialPayments;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <p className="text-gray-500 text-sm">Manage and track payment transactions</p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('full')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'full' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Full Payments ({fullPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('partial')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
            activeTab === 'partial' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Partial Payments ({partialPayments.length})
        </button>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-600">Payment ID</th>
              <th className="text-left p-3 font-semibold text-gray-600">User Name</th>
              <th className="text-left p-3 font-semibold text-gray-600">Payment Mode</th>
              <th className="text-left p-3 font-semibold text-gray-600">Payment Type</th>
              <th className="text-left p-3 font-semibold text-gray-600">Service Name</th>
              <th className="text-left p-3 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">{payment.paymentId}</td>
                <td className="p-3">{payment.userName}</td>
                <td className="p-3">{payment.paymentMode}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.paymentType === 'Full' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {payment.paymentType}
                  </span>
                </td>
                <td className="p-3">{payment.serviceName}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500 text-right">
        Total {activeTab} payments: {currentData.length}
      </div>
    </div>
  );
};

export default PaymentHistory;