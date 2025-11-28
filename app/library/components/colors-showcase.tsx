interface ColorSwatchProps {
  name: string;
  className: string;
  description?: string;
}

function ColorSwatch({ name, className, description }: ColorSwatchProps) {
  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden'>
      <div className={className + ' h-24 w-full'} />
      <div className='p-4'>
        <div className='text-label-sm font-medium text-text-strong-950'>
          {name}
        </div>
        {description && (
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            {description}
          </div>
        )}
        <code className='mt-2 block text-paragraph-xs text-text-sub-600'>
          {className}
        </code>
      </div>
    </div>
  );
}

export function ColorsShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Colors</h3>

      <div className='space-y-8'>
        {/* Semantic Background Colors */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>
            Semantic Background Colors
          </h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <ColorSwatch
              name='BG Strong 950'
              className='bg-bg-strong-950'
              description='Strongest background'
            />
            <ColorSwatch
              name='BG Surface 800'
              className='bg-bg-surface-800'
              description='Surface background'
            />
            <ColorSwatch
              name='BG Sub 300'
              className='bg-bg-sub-300'
              description='Subtle background'
            />
            <ColorSwatch
              name='BG Soft 200'
              className='bg-bg-soft-200'
              description='Soft background'
            />
            <ColorSwatch
              name='BG Weak 50'
              className='bg-bg-weak-50'
              description='Weak background'
            />
            <ColorSwatch
              name='BG White 0'
              className='bg-bg-white-0'
              description='Base white background'
            />
          </div>
        </div>

        {/* Semantic Text Colors */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>
            Semantic Text Colors
          </h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <ColorSwatch
              name='Text Strong 950'
              className='bg-text-strong-950'
              description='Strongest text color'
            />
            <ColorSwatch
              name='Text Sub 600'
              className='bg-text-sub-600'
              description='Subdued text color'
            />
            <ColorSwatch
              name='Text Soft 400'
              className='bg-text-soft-400'
              description='Soft text color'
            />
            <ColorSwatch
              name='Text Disabled 300'
              className='bg-text-disabled-300'
              description='Disabled text color'
            />
            <ColorSwatch
              name='Text White 0'
              className='bg-text-white-0 border border-stroke-soft-200'
              description='White text color'
            />
          </div>
        </div>

        {/* Semantic Stroke Colors */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>
            Semantic Stroke Colors
          </h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <ColorSwatch
              name='Stroke Strong 950'
              className='bg-stroke-strong-950'
              description='Strongest stroke'
            />
            <ColorSwatch
              name='Stroke Sub 300'
              className='bg-stroke-sub-300'
              description='Subdued stroke'
            />
            <ColorSwatch
              name='Stroke Soft 200'
              className='bg-stroke-soft-200'
              description='Soft stroke'
            />
            <ColorSwatch
              name='Stroke White 0'
              className='bg-stroke-white-0 border border-stroke-soft-200'
              description='White stroke'
            />
          </div>
        </div>

        {/* Primary Colors */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>
            Primary Colors
          </h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <ColorSwatch
              name='Primary Dark'
              className='bg-primary-dark'
              description='Primary dark variant'
            />
            <ColorSwatch
              name='Primary Darker'
              className='bg-primary-darker'
              description='Primary darker variant'
            />
            <ColorSwatch
              name='Primary Base'
              className='bg-primary-base'
              description='Primary base color'
            />
          </div>
        </div>

        {/* Status Colors */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>
            Status Colors
          </h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <ColorSwatch
              name='Error Base'
              className='bg-error-base'
              description='Error status'
            />
            <ColorSwatch
              name='Success Base'
              className='bg-success-base'
              description='Success status'
            />
            <ColorSwatch
              name='Warning Base'
              className='bg-warning-base'
              description='Warning status'
            />
            <ColorSwatch
              name='Information Base'
              className='bg-information-base'
              description='Information status'
            />
          </div>
        </div>

        {/* Raw Palette - Blue */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>Blue Palette</h4>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            <ColorSwatch name='Blue 50' className='bg-blue-50' />
            <ColorSwatch name='Blue 100' className='bg-blue-100' />
            <ColorSwatch name='Blue 200' className='bg-blue-200' />
            <ColorSwatch name='Blue 300' className='bg-blue-300' />
            <ColorSwatch name='Blue 400' className='bg-blue-400' />
            <ColorSwatch name='Blue 500' className='bg-blue-500' />
            <ColorSwatch name='Blue 600' className='bg-blue-600' />
            <ColorSwatch name='Blue 700' className='bg-blue-700' />
            <ColorSwatch name='Blue 800' className='bg-blue-800' />
            <ColorSwatch name='Blue 900' className='bg-blue-900' />
            <ColorSwatch name='Blue 950' className='bg-blue-950' />
          </div>
        </div>

        {/* Raw Palette - Gray */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>Gray Palette</h4>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            <ColorSwatch name='Gray 0' className='bg-gray-0 border border-stroke-soft-200' />
            <ColorSwatch name='Gray 50' className='bg-gray-50' />
            <ColorSwatch name='Gray 100' className='bg-gray-100' />
            <ColorSwatch name='Gray 200' className='bg-gray-200' />
            <ColorSwatch name='Gray 300' className='bg-gray-300' />
            <ColorSwatch name='Gray 400' className='bg-gray-400' />
            <ColorSwatch name='Gray 500' className='bg-gray-500' />
            <ColorSwatch name='Gray 600' className='bg-gray-600' />
            <ColorSwatch name='Gray 700' className='bg-gray-700' />
            <ColorSwatch name='Gray 800' className='bg-gray-800' />
            <ColorSwatch name='Gray 900' className='bg-gray-900' />
            <ColorSwatch name='Gray 950' className='bg-gray-950' />
          </div>
        </div>
      </div>
    </div>
  );
}
