'use client';

// imports
import { useEffect } from 'react';
import TripCard from '@/components/trips/TripCard';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/contexts/AuthContext';
import { TRAVELER_PACKAGES } from '../../redux/tripsAction';

export default function TravelerTrips() {
  const { travelerPackages } = useSelector((state) => state.trips);
  console.log('traveler packages', travelerPackages); // traveler packages

  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.permissions === 'traveler') {
      console.log('inside fetch traveler packages effect');
      dispatch({
        type: TRAVELER_PACKAGES,
        payload: { travelerId: user.userId },
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Trips</h1>
            <p className="text-gray-400 mt-2">
              {travelerPackages.length} trips available
            </p>
          </div>
        </div>

        {/* Trip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelerPackages.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {/* Empty State */}
        {travelerPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              No trips found matching your criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
