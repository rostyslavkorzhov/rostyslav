import ScreenshotForm from '@/components/screenshot-form';

export default function Home() {
  return (
    <div className='container mx-auto flex-1 px-5 py-16'>
      <div className='mx-auto max-w-2xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-title-h1 text-text-strong-950 mb-4'>
            URLBOX Screenshot Capture
          </h1>
          <p className='text-paragraph-lg text-text-sub-600'>
            Capture screenshots of any webpage and store them locally for later use.
          </p>
        </div>
        <div className='rounded-2xl bg-bg-white-0 p-8 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200'>
          <ScreenshotForm />
        </div>
      </div>
    </div>
  );
}
