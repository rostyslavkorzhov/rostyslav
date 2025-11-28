import { SectionWrapper } from './section-wrapper';

const titleStyles = [
  { className: 'text-title-h1', label: 'Title H1', sample: 'The quick brown fox' },
  { className: 'text-title-h2', label: 'Title H2', sample: 'The quick brown fox' },
  { className: 'text-title-h3', label: 'Title H3', sample: 'The quick brown fox' },
  { className: 'text-title-h4', label: 'Title H4', sample: 'The quick brown fox' },
  { className: 'text-title-h5', label: 'Title H5', sample: 'The quick brown fox' },
  { className: 'text-title-h6', label: 'Title H6', sample: 'The quick brown fox' },
];

const labelStyles = [
  { className: 'text-label-xl', label: 'Label XL', sample: 'Label text' },
  { className: 'text-label-lg', label: 'Label LG', sample: 'Label text' },
  { className: 'text-label-md', label: 'Label MD', sample: 'Label text' },
  { className: 'text-label-sm', label: 'Label SM', sample: 'Label text' },
  { className: 'text-label-xs', label: 'Label XS', sample: 'Label text' },
];

const paragraphStyles = [
  { className: 'text-paragraph-xl', label: 'Paragraph XL', sample: 'The quick brown fox jumps over the lazy dog' },
  { className: 'text-paragraph-lg', label: 'Paragraph LG', sample: 'The quick brown fox jumps over the lazy dog' },
  { className: 'text-paragraph-md', label: 'Paragraph MD', sample: 'The quick brown fox jumps over the lazy dog' },
  { className: 'text-paragraph-sm', label: 'Paragraph SM', sample: 'The quick brown fox jumps over the lazy dog' },
  { className: 'text-paragraph-xs', label: 'Paragraph XS', sample: 'The quick brown fox jumps over the lazy dog' },
];

const subheadingStyles = [
  { className: 'text-subheading-md', label: 'Subheading MD', sample: 'Subheading text' },
  { className: 'text-subheading-sm', label: 'Subheading SM', sample: 'Subheading text' },
  { className: 'text-subheading-xs', label: 'Subheading XS', sample: 'Subheading text' },
  { className: 'text-subheading-2xs', label: 'Subheading 2XS', sample: 'Subheading text' },
];

function TypographySample({
  className,
  label,
  sample,
}: {
  className: string;
  label: string;
  sample: string;
}) {
  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-4'>
      <div className='mb-2 text-label-xs uppercase text-text-soft-400'>
        {label}
      </div>
      <div className={className + ' text-text-strong-950'}>{sample}</div>
      <code className='mt-2 block text-paragraph-xs text-text-sub-600'>
        {className}
      </code>
    </div>
  );
}

export function TypographyShowcase() {
  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Typography</h3>

      <div className='space-y-8'>
        {/* Titles */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>Titles</h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {titleStyles.map((style) => (
              <TypographySample
                key={style.className}
                className={style.className}
                label={style.label}
                sample={style.sample}
              />
            ))}
          </div>
        </div>

        {/* Labels */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>Labels</h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {labelStyles.map((style) => (
              <TypographySample
                key={style.className}
                className={style.className}
                label={style.label}
                sample={style.sample}
              />
            ))}
          </div>
        </div>

        {/* Paragraphs */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>
            Paragraphs
          </h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {paragraphStyles.map((style) => (
              <TypographySample
                key={style.className}
                className={style.className}
                label={style.label}
                sample={style.sample}
              />
            ))}
          </div>
        </div>

        {/* Subheadings */}
        <div>
          <h4 className='text-title-h5 mb-4 text-text-strong-950'>
            Subheadings
          </h4>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {subheadingStyles.map((style) => (
              <TypographySample
                key={style.className}
                className={style.className}
                label={style.label}
                sample={style.sample}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
