'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  FiStar,
  FiMapPin,
  FiCalendar,
  FiPackage,
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiFlag,
} from 'react-icons/fi';
// import { MOCK_TRIPS } from '@/data/mockTrips'
import { MOCK_USERS } from '@/data/mockUsers';
import Avatar from '@/components/common/Avatar';
import TripCard from '@/components/trips/TripCard';
import { useNotification } from '@/contexts/NotificationContext';
import { MOCK_TRIPS } from '../redux/tripsSaga';
import { useDispatch, useSelector } from 'react-redux';
import { TRAVELER_DETAIL, TRAVELER_PACKAGES } from '../redux/tripsAction';

export default function TravelerProfile() {
  const { travelerPackages, traveler } = useSelector((state) => state.trips);
  const params = useParams();
  const { showNotification } = useNotification();
  const [showContactInfo, setShowContactInfo] = useState(false);
  // Safely access the id parameter
  const travelerId = params?.id as string;

  console.log('travelerProfile', traveler);
  console.log('traveler packages', travelerPackages);

  // fetch traveler details
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: TRAVELER_DETAIL, payload: travelerId });
  }, [travelerId]);

  // fetch trip or traveler packages
  useEffect(() => {
    console.log('inside fetch traveler packages effect');
    dispatch({
      type: TRAVELER_PACKAGES,
      payload: { travelerId: travelerId },
    });
  }, [travelerId]);

  // Find traveler from mock data (only if we have an id)
  // const traveler = travelerId
  //   ? MOCK_USERS.find((user) => user.id === travelerId)
  //   : null;
  // const travelerTrips = travelerId
  //   ? MOCK_TRIPS.filter((trip) => trip.traveler.id === travelerId)
  //   : [];

  if (!travelerId || !traveler) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Traveler not found</div>
      </div>
    );
  }

  const handleChatClick = (travelerId: string) => {
    showNotification('Opening chat...', 'info');
    // Handle chat logic here
  };

  const handleReport = () => {
    showNotification('Report submitted', 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar
              src={traveler.picture_url || '/default-avatar.png'} // Handle null picture URL
              alt={traveler.name || 'Unknown Traveler'} // Handle null name
              size={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {traveler.name || 'No Name Provided'}
                {traveler.is_email_verified && (
                  <span className="ml-2 px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded-full">
                    Verified
                  </span>
                )}
              </h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center">
                  <FiStar className="mr-1 text-yellow-500" />
                  <span className="font-medium text-white">
                    {traveler.rating ?? 'N/A'}
                  </span>
                  <span className="ml-1">
                    ({traveler.reviewCount ?? 0} reviews)
                  </span>
                </div>
                <div>
                  <span className="font-medium text-white">
                    {traveler.completedTrips ?? 0}
                  </span>
                  <span className="ml-1">trips completed</span>
                </div>
              </div>
              {traveler.languages?.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-2">Languages</div>
                  <div className="flex space-x-2">
                    {traveler.languages.map((lang) => (
                      <span
                        key={lang}
                        className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleChatClick(traveler.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiMessageSquare className="inline-block mr-2" />
              Message
            </button>
            <button
              onClick={handleReport}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
              title="Report User"
            >
              <FiFlag />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-700">
          <div>
            <div className="text-gray-400 text-sm">Response Time</div>
            <div className="mt-1 text-white flex items-center">
              <FiClock className="mr-2 text-blue-400" />
              {traveler.stats?.responseTime ?? 'Unknown'}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Success Rate</div>
            <div className="mt-1 text-white flex items-center">
              <FiCheck className="mr-2 text-green-400" />
              {traveler.stats?.successRate
                ? `${traveler.stats.successRate}%`
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Completed Trips</div>
            <div className="mt-1 text-white flex items-center">
              <FiPackage className="mr-2 text-purple-400" />
              {traveler.stats?.completedTrips ?? 0}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Member Since</div>
            <div className="mt-1 text-white flex items-center">
              <FiCalendar className="mr-2 text-yellow-400" />
              {traveler.created_at
                ? new Date(traveler.created_at).toLocaleDateString()
                : 'Unknown'}
            </div>
          </div>
        </div>

        {/* About */}
        {traveler.about && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-2">About</h2>
            <p className="text-gray-300">
              {traveler.about || 'No information available.'}
            </p>
          </div>
        )}
      </div>

      {/* Trips */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Active Trips</h2>
        {travelerPackages.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {travelerPackages.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onChatClick={handleChatClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No active trips</div>
        )}
      </div>
    </div>
  );
}
