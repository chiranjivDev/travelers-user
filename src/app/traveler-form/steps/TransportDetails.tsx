import {
  FiAlertTriangle,
  FiCheck,
  FiDollarSign,
  FiInfo,
  FiStar,
  FiTruck,
} from 'react-icons/fi';
import { Select } from '@/components/ui/Select';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TransportDetails = ({ register, errors, control, watch, setValue }) => {
  // Watch responsibilities state to check if all are checked
  const responsibilities = watch('responsibilities', {
    verifyContents: false,
    noRestrictedItems: false,
    reportSuspicious: false,
    legalResponsibilities: false,
  });

  const allResponsibilitiesChecked =
    responsibilities.verifyContents &&
    responsibilities.noRestrictedItems &&
    responsibilities.reportSuspicious &&
    responsibilities.legalResponsibilities;

  // Watch the preference field to apply conditional styles or logic
  const watchPreference = watch('packagePreferences.preferences');

  // Handle selection of the "Open to All Items" preference
  const handleOpenToAllSelection = () => {
    setValue('packagePreferences.preferences', 'openToAll');
  };

  // Handle selection of the "Basic Items Only" preference
  const handleBasicItemsSelection = () => {
    setValue('packagePreferences.preferences', 'basicItemsOnly');
  };

  return (
    <div className="relative w-full">
      {/* Package Preferences Section */}
      <div className="bg-gray-900/20 backdrop-blur-sm rounded-2xl p-8">
        {/* Package Preferences Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Package Preferences
            </h3>
            <InfoIcon content="Configure what types of packages you can transport">
              <div className="text-gray-400 hover:text-blue-400 transition-colors">
                <FiInfo className="w-5 h-5" />
              </div>
            </InfoIcon>
          </div>
        </div>

        {/* Form Sections Container */}
        <div className="space-y-8">
          {/* Maximum Weight Capacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                Maximum Weight Capacity
              </h4>
            </div>
            <div className="relative">
              <Controller
                name="packagePreferences.maxWeight"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Please select a weight capacity.',
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select weight capacity"
                    options={WEIGHT_OPTIONS}
                    dropdownClassName="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
                    optionClassName="px-4 py-3 text-left hover:bg-gray-700 text-white transition-all duration-300 cursor-pointer group"
                    containerClassName="w-full"
                  />
                )}
              />
            </div>
            {errors?.packagePreferences?.maxWeight && (
              <p className="text-red-500 text-sm">
                {errors.packagePreferences.maxWeight.message}
              </p>
            )}
          </div>

          {/* Special Handling Services */}
          <motion.div
            whileHover={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
            className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-blue-400/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-2 mb-4">
              <h4 className="text-lg font-medium text-white">
                Special Handling Services
              </h4>
              <InfoIcon content="Additional services you can provide">
                <div className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FiInfo className="w-4 h-4" />
                </div>
              </InfoIcon>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {SERVICES.map((service) => (
                <Controller
                  key={service.id}
                  name={`packagePreferences.${service.id}`}
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-start space-x-3 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-all duration-300 group cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          {service.label}
                        </span>
                        <p className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors">
                          {service.description}
                        </p>
                      </div>
                    </label>
                  )}
                />
              ))}
            </div>
          </motion.div>

          {/* Quick Preference Selection */}
          <motion.div
            whileHover={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
            className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-blue-400/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-2 mb-6">
              <h4 className="text-lg font-medium text-white">
                Quick Preference Selection
              </h4>
              <InfoIcon content="Choose your package handling preferences">
                <div className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FiInfo className="w-4 h-4" />
                </div>
              </InfoIcon>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Open to All Option */}
              <motion.div
                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 ${
                  watchPreference === 'openToAll'
                    ? 'ring-2 ring-blue-500 bg-blue-900/20'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenToAllSelection} // Set preference when clicked
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <motion.div
                        animate={
                          watchPreference === 'openToAll'
                            ? { scale: [1, 1.2, 1] }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                        className={`w-4 h-4 rounded-full border-2 ${
                          watchPreference === 'openToAll'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-500'
                        }`}
                      >
                        {watchPreference === 'openToAll' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-full w-full flex items-center justify-center"
                          >
                            <FiCheck className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        Open to All Items
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Accept all allowed items within weight limit
                      </p>

                      <motion.div
                        initial={false}
                        animate={{
                          height: watchPreference === 'openToAll' ? 'auto' : 0,
                          opacity: watchPreference === 'openToAll' ? 1 : 0,
                        }}
                        className="overflow-hidden"
                      >
                        {watchPreference === 'openToAll' && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center space-x-2 text-blue-400">
                              <FiStar className="w-4 h-4" />
                              <span className="text-sm">
                                Maximum flexibility
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-green-400">
                              <FiTruck className="w-4 h-4" />
                              <span className="text-sm">
                                More delivery opportunities
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-yellow-400">
                              <FiDollarSign className="w-4 h-4" />
                              <span className="text-sm">
                                Higher earning potential
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Basic Items Only Option */}
              <motion.div
                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200 ${
                  watchPreference === 'basicItemsOnly'
                    ? 'ring-2 ring-green-500 bg-green-900/20'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBasicItemsSelection} // Set preference when clicked
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <motion.div
                        animate={
                          watchPreference === 'basicItemsOnly'
                            ? { scale: [1, 1.2, 1] }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                        className={`w-4 h-4 rounded-full border-2 ${
                          watchPreference === 'basicItemsOnly'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-500'
                        }`}
                      >
                        {watchPreference === 'basicItemsOnly' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-full w-full flex items-center justify-center"
                          >
                            <FiCheck className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">Basic Items Only</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Low-risk items only
                      </p>
                      <motion.div
                        initial={false}
                        animate={{
                          height:
                            watchPreference === 'basicItemsOnly' ? 'auto' : 0,
                          opacity: watchPreference === 'basicItemsOnly' ? 1 : 0,
                        }}
                        className="overflow-hidden"
                      >
                        {watchPreference === 'basicItemsOnly' && (
                          <div className="mt-3 text-sm text-green-400">
                            Safe and simple items for easy transport
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Traveler Responsibilities */}
          <motion.div
            whileHover={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
            className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-blue-400/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-2 mb-4">
              <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
              <h4 className="text-lg font-medium text-white">
                Traveler Responsibilities
              </h4>
            </div>

            <p className="text-gray-400 mb-4">
              As a traveler, you must understand and acknowledge your
              responsibilities regarding restricted items.
            </p>

            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('responsibilities.verifyContents')}
                  className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I will verify the contents of packages before accepting them
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('responsibilities.noRestrictedItems')}
                  className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I will not transport any restricted or prohibited items
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('responsibilities.reportSuspicious')}
                  className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I will report any suspicious packages or contents
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('responsibilities.legalResponsibilities')}
                  className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  I understand my legal responsibilities as a traveler
                </span>
              </label>
            </div>
            {!allResponsibilitiesChecked && (
              <p className="mt-4 text-sm text-orange-400">
                Please acknowledge all responsibilities to continue
              </p>
            )}
            <Link
              target="_blank"
              href="/restricted-items"
              className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View complete restricted items guide
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default TransportDetails;

interface InfoIconProps {
  content: string;
}

const InfoIcon: React.FC<InfoIconProps & { children: React.ReactNode }> = ({
  content,
  children,
}) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {content}
      </div>
    </div>
  );
};

// data
const WEIGHT_OPTIONS = [
  {
    value: '5',
    label: 'Up to 5 kg',
    description: 'Small packages and documents',
  },
  { value: '10', label: 'Up to 10 kg', description: 'Medium-sized packages' },
  { value: '20', label: 'Up to 20 kg', description: 'Large packages' },
  { value: '50', label: 'Up to 50 kg', description: 'Very large shipments' },
  {
    value: '100',
    label: 'Up to 100 kg',
    description: 'Commercial shipments',
  },
];

const SERVICES = [
  {
    id: 'secureHandling',
    label: 'Secure & Careful Handling',
    description: 'Extra care and security for valuable or delicate items',
  },
  {
    id: 'expressDelivery',
    label: 'Express Delivery',
    description: 'Quick delivery upon arrival at destination',
  },
];