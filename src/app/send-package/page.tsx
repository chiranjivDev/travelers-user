'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { senderMultistep } from './steps';
import { PackageDetails } from './steps/PackageDetails';
import { Step2 } from './steps/step2';
import { Step3 } from './steps/step3';
import { Step4 } from './steps/step4';
import { Step5 } from './steps/step5';
import { PlaceOrder } from './steps/PlaceOrder';

const PackageCreationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      subcategory: '',
      price: '',
      description: '',
      dimension: {
        length: '',
        width: '',
        height: '',
      },
      weight: '',
      origin: {
        street: '',
        postal: '',
        city: '',
      },
      destination: {
        street: '',
        postal: '',
        city: '',
      },
      // for pickup
      pickupDate: '',
      preferredTime: '',
      phone: '',
      communication: [],
      packagePhotos: [],
      // for delivery
      deliveryDate: '',
      preferredDeliveryTime: '',
    },
  });

  // Function to handle Next step with validation and form submission
  const nextStep = async () => {
    const isValid = await trigger();

    if (isValid) {
      if (currentStep === 5) {
        submitForm(getValues());
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
      }
    } else {
      console.log('Validation failed for step:', currentStep);
    }
  };

  // handle previous
  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // handle next
  const submitForm = (data) => {
    console.log('Form submitted:', data);

    // Create a payload as per our backend implementation and make api call
    const payload = {
      name: data?.name,
      categoryId: data?.category,
      subcategoryId: data?.subcategory,
      price: Number(data?.price),
      description: data?.description,
      packagePhotos: data?.packagePhotos || [],
      weight: Number(data?.weight),
      pickupLocation: data?.origin?.city || '', // Pickup location needs to be modified in the backend
      deliveryLocation: data?.destination?.city || '', // Delivery location needs to be modified in the backend
      dimensions: {
        length: Number(data?.dimension?.length),
        width: Number(data?.dimension?.width),
        height: Number(data?.dimension?.height),
      },
      preferredTimes: data?.preferredTime || 'Weekdays after 5 PM',
      preferredDate: data?.pickupDate || '2025-01-02',
      communicationPreferences: data?.communication?.join(', ') || 'whatsapp',
      deliveryDate: data?.deliveryDate || '2025-01-02',

      // Form data does not include the below fields
      requiresCarefulHandling: data?.requiresCarefulHandling || false, // Form data does not include this field
      isFragile: data?.isFragile || false, // Form data does not include this field
      specialInstructions: data?.specialInstructions || '', // Form data does not include this field

      availabilityDates: data?.pickupDate || '2025-01-07T11:03:47.523Z',
      insurance: true, // Form data does not include this field
      priority: true, // Form data does not include this field
      tracking: 'tracking', // Form data does not include this field

      allowPostalDelivery: true, // Form data does not include this field
      postalDeliveryDetails: '', // Form data includes "origin.postal"
      restricted: false, // Form data does not include this field
    };
    console.log('updated payload', payload);

    // later will move to useEffect
    if (true) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            {/* Progress Indicator */}
            <div className="flex flex-col items-center p-6">
              {/* Steps container */}
              <div className="flex justify-between items-start w-full">
                {senderMultistep.map((s) => (
                  <div
                    key={s.id}
                    className={`flex flex-col items-center w-1/5 ${s.id === currentStep ? 'opacity-100' : 'opacity-60'} `}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
            ${s.id <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
            ${s.id === currentStep ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                    >
                      {s.icon}
                    </div>

                    {/* Step title and subtitle */}
                    <div className="text-center">
                      <p
                        className={`text-sm font-medium mb-1 ${s.id === currentStep ? 'text-blue-600' : 'text-gray-600'}`}
                      >
                        {s.title}
                      </p>
                      <p className="text-xs text-gray-500 max-w-[120px] mx-auto">
                        {s.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              {currentStep === 1 && (
                <PackageDetails
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  getValues={getValues}
                />
              )}
              {currentStep === 2 && <Step2 control={control} errors={errors} />}
              {currentStep === 3 && <Step3 control={control} errors={errors} />}
              {currentStep === 4 && <Step4 control={control} errors={errors} />}
              {currentStep === 5 && <Step5 formData={getValues()} />}
              {currentStep === 6 && <PlaceOrder />}
            </div>

            {/* Navigation buttons */}
            {currentStep < 6 && (
              <div
                className={`flex items-center mt-6 ${
                  currentStep === 1 ? 'justify-end' : 'justify-between'
                }`}
              >
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 focus:outline-none"
                  >
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none"
                >
                  {currentStep === 5 ? 'Create Package' : 'Next'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PackageCreationForm;
