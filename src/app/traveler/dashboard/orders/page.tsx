'use client';

import { FETCH_ORDERS } from '@/app/sender/dashboard/redux/orderAction';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TravelerOrdersPage = () => {
  const { orders, fetchOrdersLoading } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('TravelerDashboard.orders');

  // dispatch
  const dispatch = useDispatch();
  // fetch orders
  useEffect(() => {
    dispatch({ type: FETCH_ORDERS });
  }, []);

  // Handle Mark as delivered
  const handleMarkDelivered = async (order) => {
    console.log('mark as delivered', order);
    setSelectedOrder(order);
    setIsModalOpen(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}orders/send-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: order?.sender?.email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert('OTP sent successfully');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to send OTP', error);
      alert('Failed to send OTP. Try again.');
    }
  };

  // Handle OTP submit
  const handleOtpSubmit = async () => {
    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}orders/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: selectedOrder?.sender?.email,
            order_id: selectedOrder?.order_id,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        alert('OTP verified successfully. Order marked as Delivered.');
        setOtp('');
        // dispatch({ type: FETCH_ORDERS });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('OTP verification failed', error);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  // Show action button for only in-progress orders
  const inProgressOrders = orders.filter(
    (order) =>
      order.order_status === 'In Progress' || order.order_status === 'PENDING'
  );
  const showActionsColumn = inProgressOrders.length > 0;

  // No orders available
  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-300">{t('noOrdersAssigned')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 w-4/5 mx-auto">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {t('associatedOrders')}
          </h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase">
                {t('orderId')}
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase">
                {t('pickupAddress')}
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase">
                {t('deliveryAddress')}
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase">
                {t('status')}
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase">
                {t('payment')}
              </th>
              {showActionsColumn && (
                <th className="text-left text-xs font-medium text-gray-400 uppercase py-3 px-6">
                  {t('actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders.map((order) => (
              <tr
                key={order.order_id}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-4 px-6 text-sm font-medium text-white">
                  {order.order_id}
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">
                  {order.origin?.city}
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">
                  {order.destination?.city}
                </td>
                <td className="py-4 px-6 text-sm font-medium text-yellow-500">
                  {order.order_status}
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">
                  {order.payment_status}
                </td>
                {showActionsColumn && (
                  <td className="py-4 px-6">
                    {order.order_status === 'PENDING' && (
                      <button
                        onClick={() => handleMarkDelivered(order)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      >
                        {t('markAsDelivered')}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OTP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold text-white mb-4">
              {t('enterOtp')}
            </h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:outline-none"
              placeholder="Enter OTP"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleOtpSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelerOrdersPage;
