export default function TailwindTest() {
  return (
    <div className='min-h-screen bg-red-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-blue-600 mb-6'>Tailwind CSS Test</h1>

        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Basic Colors</h2>
          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-red-500 text-white p-4 rounded'>Red 500</div>
            <div className='bg-blue-500 text-white p-4 rounded'>Blue 500</div>
            <div className='bg-green-500 text-white p-4 rounded'>Green 500</div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Layout Classes</h2>
          <div className='flex flex-wrap gap-2 mb-4'>
            <span className='px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm'>
              Flex
            </span>
            <span className='px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm'>
              Flex Wrap
            </span>
            <span className='px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm'>Gap</span>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-gray-100 p-4 text-center rounded'>1</div>
            <div className='bg-gray-200 p-4 text-center rounded'>2</div>
            <div className='bg-gray-300 p-4 text-center rounded'>3</div>
            <div className='bg-gray-400 p-4 text-center rounded text-white'>4</div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Spacing & Typography</h2>
          <p className='text-lg text-gray-600 mb-2'>Large text with margin bottom</p>
          <p className='text-sm text-gray-500 mb-4'>Small text with different color</p>
          <div className='border-2 border-dashed border-gray-300 p-4 rounded'>
            <p className='font-mono text-xs'>Dashed border with monospace font</p>
          </div>
        </div>
      </div>
    </div>
  );
}
