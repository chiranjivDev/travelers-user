export const Step5 = ({ formData }: any) => {
  // Helper function to render nested objects
  const renderNestedData = (data: any) => {
    return Object.keys(data).map((key) => (
      <div key={key} className="flex justify-between pl-4">
        <span className="font-semibold">{key}</span>
        <span>{data[key]}</span>
      </div>
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Step 5: Review & Submit
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700">Review your details</label>
        <div className="space-y-2 text-gray-700">
          {Object.keys(formData).map((key) => {
            const value = formData[key];

            // Check if the value is an object and render nested data accordingly
            if (typeof value === 'object' && value !== null) {
              return (
                <div key={key}>
                  <span className="font-semibold">{key}</span>
                  {renderNestedData(value)}
                </div>
              );
            }

            // Render simple key-value pairs for non-object values
            return (
              <div key={key} className="flex justify-between">
                <span className="font-semibold">{key}</span>
                <span>{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
