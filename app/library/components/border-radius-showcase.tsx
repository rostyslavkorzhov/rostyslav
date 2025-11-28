function BorderRadiusSample({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'>
      <div className='mb-4 text-label-sm font-medium text-text-strong-950'>
        {name}
      </div>
      <div
        className={`h-24 w-full bg-primary-alpha-10 ${className} border border-primary-base`}
      />
      <code className='mt-4 block text-paragraph-xs text-text-sub-600'>
        {className}
      </code>
    </div>
  );
}

export function BorderRadiusShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>
        Border Radius
      </h3>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <BorderRadiusSample name='Rounded LG' className='rounded-lg' />
        <BorderRadiusSample name='Rounded XL' className='rounded-xl' />
        <BorderRadiusSample name='Rounded 10' className='rounded-10' />
        <BorderRadiusSample name='Rounded 20' className='rounded-20' />
        <BorderRadiusSample name='Rounded 2XL' className='rounded-2xl' />
        <BorderRadiusSample name='Rounded MD' className='rounded-md' />
      </div>
    </div>
  );
}
