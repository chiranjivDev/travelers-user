'use client';

import { useEffect, useState } from 'react';
import PackageCard from '@/components/packages/PackageCard';
import PackageDetailsModal from '@/components/packages/PackageDetailsModal';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { SENDER_PACKAGES } from '../redux/packagesAction';
import { useAuth } from '@/contexts/AuthContext';
import { FiPackage } from 'react-icons/fi';

export default function BrowseMyPackagesPage() {
  const { senderPackages } = useSelector((state) => state.packages);
  const [selectedPackage, setSelectedPackage] = useState(null);
  console.log('sender packages from chat window', senderPackages);

  const { user } = useAuth(); // Fetch user

  const dispatch = useDispatch(); // dispatch

  // fetch sender packages
  useEffect(() => {
    console.log('inside fetch sender packages effect');
    dispatch({
      type: SENDER_PACKAGES,
      payload: { senderId: user?.userId },
    });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">My Packages</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Found {senderPackages.length} packages matching your criteria
          </p>
        </div>

        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
          {senderPackages.map((pkg) => {
            return (
              <PackageCard
                key={pkg.id}
                package={pkg}
                onViewDetails={() => setSelectedPackage(pkg)}
              />
            );
          })}
        </div>

        {/* No Results */}
        {senderPackages.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No packages found</h3>
          </div>
        )}

        {/* Package Details Modal */}
        <AnimatePresence>
          {selectedPackage && (
            <PackageDetailsModal
              isOpen={!!selectedPackage}
              onClose={() => setSelectedPackage(null)}
              package={selectedPackage}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
