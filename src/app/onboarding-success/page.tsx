'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const OnboardingSuccess = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const statusQuery = searchParams.get('status');
    setStatus(statusQuery);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white text-center">
          {status === 'success'
            ? 'Stripe Account Connected!'
            : 'Onboarding Failed'}
        </h2>
        <p className="text-sm text-gray-400 text-center mt-1">
          {status === 'success'
            ? 'Your Stripe account has been successfully connected. You can now start receiving payments.'
            : 'There was an issue with your onboarding. Please try again later.'}
        </p>

        <div className="mt-6">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            onClick={() => router.push('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
