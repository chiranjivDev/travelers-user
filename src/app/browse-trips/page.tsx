'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TripCard from '@/components/trips/TripCard';
import { FiSearch, FiSliders, FiCalendar } from 'react-icons/fi';
import { useDebounce } from '@/hooks/useDebounce';
import { useDispatch, useSelector } from 'react-redux';
import { SEARCH_TRAVELER_PACKAGE, TRIPS } from '../traveler/redux/tripsAction';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'framer-motion';

type SortOption = 'rating' | 'price' | 'date';
type FilterOption = 'all' | 'small' | 'medium' | 'large';

export default function BrowseTrips() {
  const { trips: MOCK_TRIPS, loading: tripsAreLoading } = useSelector(
    (state) => state.trips,
  );
  const t = useTranslations('BrowseTips');

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!MOCK_TRIPS.length) {
      dispatch({
        type: SEARCH_TRAVELER_PACKAGE,
        payload: {
          searchKeyword: '',
          startDate: '',
          endDate: '',
        },
      });
    }
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [sizeFilter, setSizeFilter] = useState<FilterOption>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  const handleChatClick = useCallback(
    (travelerId: string, travelerPkgId: string) => {
      router.push(`/chat?user=${travelerId}&travelerPkgId=${travelerPkgId}`);
    },
    [router],
  );

  const debouncedSearch = useDebounce(searchQuery, 700);
  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchQuery(keyword);
  };

  useEffect(() => {
    dispatch({
      type: SEARCH_TRAVELER_PACKAGE,
      payload: {
        searchKeyword: debouncedSearch,
        startDate: '',
        endDate: '',
      },
    });
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (dateRange?.start && dateRange?.end) {
      dispatch({
        type: SEARCH_TRAVELER_PACKAGE,
        payload: {
          searchKeyword: debouncedSearch,
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
      });
    }
  }, [dateRange.start, dateRange.end, debouncedSearch]);

  // handle Details Click
  const [selectedTravelerPackage, setSelectedTravelerPackage] = useState('');

  const handleDetailsClick = (packageId: string) => {
    setSelectedTravelerPackage(packageId);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
            <p className="text-gray-400 mt-2">
              {MOCK_TRIPS.length} {t('tripsAvailable')}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl  p-4 mb-8">
          <div className="grid grid-cols-2 sm:flex max-sm:flex-col max-sm:items-start w-full flex-wrap gap-4">
            <div className="flex-1 max-sm:col-span-2 max-sm:w-full min-w-[200px] ">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start max-sm:row-span-2 sm:items-center space-x-2">
              <FiCalendar className="text-gray-400" />
              <div className="flex items-center justify-center gap-3 flex-col sm:flex-row">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FiSliders className="text-gray-400" />
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as FilterOption)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-gray-700 text-white max-sm:mt-8 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {tripsAreLoading ? (
          <>
            <div className="flex flex-col gap-4 items-center justify-center py-[88px]">
              <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-b-gray-300 animate-spin"></div>
              <div className="text-lg font-bold">Loading Trips....</div>
            </div>
          </>
        ) : (
          <>
            {MOCK_TRIPS.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_TRIPS.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onChatClick={handleChatClick}
                    onDetailsClick={handleDetailsClick}
                  />
                ))}
              </div>
            ) : (
              <>
                {MOCK_TRIPS.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg">
                      {t('noTripsFound')}
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSizeFilter('all');
                        setDateRange({ start: '', end: '' });
                      }}
                      className="mt-4 text-blue-400 hover:text-blue-300"
                    >
                      {t('clearAllFilters')}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Package Details Modal */}
      <AnimatePresence>
        {selectedTravelerPackage && (
          <TravelerPackageDetailsModal
            isOpen={!!selectedTravelerPackage}
            onClose={() => setSelectedTravelerPackage(null)}
            selectedPackage={selectedTravelerPackage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Traveler Package modal
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX, FiMapPin } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const TravelerPackageDetailsModal = ({ isOpen, onClose, selectedPackage }) => {
  const t = useTranslations('BrowseTips.TripDetailsModal');

  console.log('selected trip', selectedPackage);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-white"
                  >
                    {t('title')}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Traveler Information */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">
                    {t('travelerInfo')}
                  </h4>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {selectedPackage?.traveler.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-white font-medium">
                            {selectedPackage?.traveler.name}
                          </h5>
                          <h5 className="text-white font-medium">
                            {selectedPackage?.traveler.email}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">
                    {t('routeInfo')}
                  </h4>
                  <div className="bg-gray-700 rounded-lg p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="text-gray-400" />
                      <div>
                        <div className="text-white">
                          {t('from')} :{' '}
                          {selectedPackage?.tripDetails?.departureLocation}
                        </div>
                        <div className="text-white">
                          {t('to')}:{' '}
                          {selectedPackage?.tripDetails?.arrivalLocation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trips Details */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">{t('title')}</h4>
                  <div className="bg-gray-700 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white flex items-center">
                        <FiCalendar className="mr-2" />
                        {format(
                          parseISO(
                            selectedPackage.tripDetails.departureDateTime,
                          ),
                          'MMM d',
                        )}{' '}
                        -{' '}
                        {format(
                          parseISO(selectedPackage.tripDetails.arrivalDateTime),
                          'MMM d, yyyy',
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-400 mb-2">{t('weight')}</div>
                      <div className="text-white">
                        {selectedPackage?.pricingDetails?.weight} kg{' '}
                        {t('available')}
                      </div>
                      <div className="text-white">
                        Max {selectedPackage.transportDetails.maxWeightCapacity}{' '}
                        kg {t('perPackage')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">{t('price')}</h4>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-400">{t('basePrice')}</div>
                      <div className="text-2xl font-bold text-white">
                        ${selectedPackage?.pricingDetails?.baseRate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {t('close')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
