'use client';
import { CREATE_ORDER } from '@/app/sender/dashboard/redux/orderAction';
import { clearOrdersState } from '@/app/sender/dashboard/redux/orderSlice';
import { TRIPS } from '@/app/traveler/redux/tripsAction';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const PlaceOrder = () => {
  const [selectedTrip, setSelectedTrip] = useState('');
  const { trips } = useSelector((state) => state.trips);
  const { createOrderSuccess } = useSelector((state) => state.order);
  const { sendPackageResponse } = useSelector((state) => state.packages);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!trips.length) {
      dispatch({ type: TRIPS });
    }
  }, [dispatch, trips]);

  // handle create Order
  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!selectedTrip) {
      alert('Please select a traveler package.');
      return;
    }
    const payload = {
      senderId: sendPackageResponse?.sender?.id,
      traveler_package_id: selectedTrip,
      sender_package_id: sendPackageResponse?.packageID,
    };
    dispatch({ type: CREATE_ORDER, payload });
  };

  // on success navigate to home screen
  useEffect(() => {
    if (createOrderSuccess) {
      router.push('/');
      dispatch(clearOrdersState());
    }
  }, [createOrderSuccess]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Select a Traveler and Place Your Order
      </h2>
      {/* Select a trip/traveler package */}
      <select
        value={selectedTrip}
        onChange={(e) => setSelectedTrip(e.target.value)}
        className="mb-6 p-3 border border-gray-300 rounded-lg w-full bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="">Select a Traveler</option>
        {trips?.map((trip) => (
          <option key={trip.id} value={trip.id}>
            {trip.name}
          </option>
        ))}
      </select>

      {/* Place Order Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCreateOrder}
          className="py-3 px-6 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
