export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>CueTimer</h1>
          <p className='text-xl text-gray-600 mb-8'>
            Professional timing that works when technology doesn't
          </p>
          <div className='bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Coming Soon</h2>
            <p className='text-gray-600 mb-6'>
              Offline-first countdown timer for events, presentations, and conferences.
            </p>
            <div className='space-y-4'>
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-sm text-gray-600'>Next.js + TypeScript ✅</span>
              </div>
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-sm text-gray-600'>Tailwind CSS ✅</span>
              </div>
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-sm text-gray-600'>Husky + Prettier ✅</span>
              </div>
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-3 h-3 bg-yellow-500 rounded-full animate-pulse'></div>
                <span className='text-sm text-gray-600'>QuoteKit Integration 🚧</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
