function ShadowSample({ name, className }: { name: string; className: string }) {
  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'>
      <div className='mb-4 text-label-sm font-medium text-text-strong-950'>
        {name}
      </div>
      <div
        className={`h-24 w-full rounded-lg bg-bg-white-0 ${className} border border-stroke-soft-200`}
      />
      <code className='mt-4 block text-paragraph-xs text-text-sub-600'>
        {className}
      </code>
    </div>
  );
}

export function ShadowsShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Shadows</h3>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <ShadowSample name='Regular XS' className='shadow-regular-xs' />
        <ShadowSample name='Regular SM' className='shadow-regular-sm' />
        <ShadowSample name='Regular MD' className='shadow-regular-md' />
        <ShadowSample
          name='Button Primary Focus'
          className='shadow-button-primary-focus'
        />
        <ShadowSample
          name='Button Important Focus'
          className='shadow-button-important-focus'
        />
        <ShadowSample
          name='Button Error Focus'
          className='shadow-button-error-focus'
        />
        <ShadowSample name='Custom XS' className='shadow-custom-xs' />
        <ShadowSample name='Custom SM' className='shadow-custom-sm' />
        <ShadowSample name='Custom MD' className='shadow-custom-md' />
        <ShadowSample name='Custom LG' className='shadow-custom-lg' />
      </div>
    </div>
  );
}
