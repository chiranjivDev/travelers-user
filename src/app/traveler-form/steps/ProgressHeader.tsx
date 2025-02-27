import { useTranslations } from 'next-intl';

// Progress Headers
export const ProgressHeader = ({ step }) => {
  const t = useTranslations('travellerForm.progressHeaders'); // language translation

  // header steps
  const steps = [
    {
      icon: '📍',
      title: t('travelRoute'),
    },
    {
      icon: '✈️',
      title: t('transportDetails'),
    },
    {
      icon: '💬',
      title: t('communication'),
    },
    {
      icon: '💷',
      title: t('pricing'),
    },
    {
      icon: '✓',
      title: t('reviewOffer'),
    },
  ];

  return (
    <>
      {steps.map((stepItem, index) => (
        <div
          key={index}
          className={`flex items-center ${
            index !== steps.length - 1 ? 'flex-1' : ''
          }`}
        >
          <div className="text-center flex-1">
            <div
              className={`
                      w-12 h-12 mx-auto rounded-full flex items-center justify-center
                      ${
                        step > index + 1
                          ? 'bg-green-500 text-white'
                          : step === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200/10 text-gray-500'
                      }
                      mb-2 text-xl
                    `}
            >
              {stepItem.icon}
            </div>
            <p className="text-sm text-gray-300 mt-2 max-w-[150px] mx-auto">
              {stepItem.title}
            </p>
          </div>
          {index !== steps.length - 1 && (
            <div className="flex-1 h-1 mx-4">
              <div className="h-full bg-gray-700 rounded">
                <div
                  className={`h-full ${
                    step > index + 1 ? 'bg-green-500' : 'bg-gray-700'
                  } rounded transition-all duration-300`}
                  style={{
                    width: step > index + 1 ? '100%' : '0%',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
