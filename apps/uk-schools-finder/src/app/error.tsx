'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Full error object:', {
    message: error.message,
    stack: error.stack,
    cause: error.cause,
    name: error.name,
  });

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-semibold text-red-700">Something went wrong!</h2>
      <pre className="mt-2 text-sm text-red-500 whitespace-pre-wrap">
        {error.message}
        {process.env.NODE_ENV !== 'production' && error.stack && (
          <>
            {'\n\nStack trace:\n'}
            {error.stack}
          </>
        )}
      </pre>
      <button 
        onClick={reset}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
} 