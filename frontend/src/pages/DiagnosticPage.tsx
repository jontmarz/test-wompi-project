import React from 'react';

const DiagnosticPage: React.FC = () => {
  const envVars = {
    VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_WOMPI_PUBLIC_KEY_TEST: import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST ? 
      import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST.substring(0, 15) + '...' : 'not set',
    VITE_WOMPI_PUBLIC_KEY_PROD: import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD ? 
      import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD.substring(0, 15) + '...' : 'not set',
    VITE_WOMPI_INTEGRITY_KEY_PROD: import.meta.env.VITE_WOMPI_INTEGRITY_KEY_PROD ? 
      'SET (length: ' + import.meta.env.VITE_WOMPI_INTEGRITY_KEY_PROD.length + ')' : 'not set',
    VITE_WOMPI_INTEGRITY_KEY_TEST: import.meta.env.VITE_WOMPI_INTEGRITY_KEY_TEST ? 
      'SET (length: ' + import.meta.env.VITE_WOMPI_INTEGRITY_KEY_TEST.length + ')' : 'not set'
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Diagnostic</h1>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
        <pre className="text-sm">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4">
        <button
          onClick={() => {
            console.log('Full environment:', import.meta.env);
            console.log('Wompi test key:', import.meta.env.VITE_WOMPI_PUBLIC_KEY_TEST);
            console.log('Wompi prod key:', import.meta.env.VITE_WOMPI_PUBLIC_KEY_PROD);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Log Full Environment to Console
        </button>
      </div>
    </div>
  );
};

export default DiagnosticPage;
