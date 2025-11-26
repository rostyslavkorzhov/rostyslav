import { texts } from '@/tailwind.config';

interface FontStyle {
  name: string;
  className: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  category: string;
  fontFamily: 'sans' | 'mono';
}

// Transform the texts object into a structured format
function parseTextStyles(): FontStyle[] {
  const styles: FontStyle[] = [];
  
  Object.entries(texts).forEach(([key, value]) => {
    const fontSize = Array.isArray(value) ? value[0] : '';
    const config = Array.isArray(value) && typeof value[1] === 'object' ? value[1] : {};
    const lineHeight = config.lineHeight || '';
    const fontWeight = config.fontWeight || '400';
    
    // Determine category
    let category = 'other';
    if (key.startsWith('title-')) category = 'titles';
    else if (key.startsWith('label-')) category = 'labels';
    else if (key.startsWith('paragraph-')) category = 'paragraphs';
    else if (key.startsWith('subheading-')) category = 'subheadings';
    else if (key.startsWith('doc-')) category = 'doc';
    
    // Determine font family (most use sans, but we'll show both)
    const fontFamily: 'sans' | 'mono' = 'sans';
    
    styles.push({
      name: key,
      className: `text-${key}`,
      fontSize,
      lineHeight,
      fontWeight,
      category,
      fontFamily,
    });
  });
  
  return styles.sort((a, b) => {
    // Sort by category first, then by name
    if (a.category !== b.category) {
      const categoryOrder = ['titles', 'labels', 'paragraphs', 'subheadings', 'doc', 'other'];
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    }
    return a.name.localeCompare(b.name);
  });
}

const fontStyles = parseTextStyles();

const categoryLabels: Record<string, string> = {
  titles: 'Titles',
  labels: 'Labels',
  paragraphs: 'Paragraphs',
  subheadings: 'Subheadings',
  doc: 'Documentation Styles',
  other: 'Other',
};

const sampleTexts: Record<string, string> = {
  titles: 'Typography Reference',
  labels: 'Label Text',
  paragraphs: 'The quick brown fox jumps over the lazy dog. This is sample paragraph text to demonstrate line height and readability.',
  subheadings: 'Subheading Text',
  doc: 'Documentation style text example',
  other: 'Sample text',
};

function FontStyleCard({ style }: { style: FontStyle }) {
  const sampleText = sampleTexts[style.category] || sampleTexts.other;
  const isTitle = style.category === 'titles';
  const displayText = isTitle ? 'Typography Reference' : sampleText;
  
  return (
    <div className='border-b border-stroke-soft-200 py-8 last:border-b-0'>
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div className='flex-1'>
          <div className='mb-2 flex items-center gap-3'>
            <h3 className='text-label-lg text-text-strong-950 font-medium'>
              {style.name}
            </h3>
            <code className='rounded bg-bg-soft-200 px-2 py-1 text-label-xs text-text-sub-600 font-mono'>
              {style.className}
            </code>
          </div>
          <div className='flex flex-wrap gap-4 text-label-sm text-text-sub-600'>
            <span>
              <strong className='text-text-strong-950'>Font:</strong>{' '}
              {style.fontFamily === 'sans' ? 'Switzer' : 'Geist Mono'}
            </span>
            <span>
              <strong className='text-text-strong-950'>Size:</strong> {style.fontSize}
            </span>
            <span>
              <strong className='text-text-strong-950'>Line Height:</strong> {style.lineHeight}
            </span>
            <span>
              <strong className='text-text-strong-950'>Weight:</strong> {style.fontWeight}
            </span>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <div
          className={`${style.className} text-text-strong-950 ${
            style.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
          }`}
        >
          {displayText}
        </div>
      </div>
    </div>
  );
}

function FontFamilySection() {
  return (
    <div className='mb-16 rounded-2xl bg-bg-white-0 p-8 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200'>
      <h2 className='text-title-h3 text-text-strong-950 mb-6'>Font Families</h2>
      <div className='space-y-8'>
        <div>
          <h3 className='text-label-lg text-text-strong-950 mb-2 font-medium'>Switzer</h3>
          <p className='text-paragraph-md text-text-sub-600 mb-4'>
            Primary sans-serif font family used for most text styles.
          </p>
          <div className='text-title-h4 text-text-strong-950 font-sans'>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
        <div className='border-t border-stroke-soft-200 pt-8'>
          <h3 className='text-label-lg text-text-strong-950 mb-2 font-medium'>Geist Mono</h3>
          <p className='text-paragraph-md text-text-sub-600 mb-4'>
            Monospace font family for code and technical content.
          </p>
          <div className='text-title-h4 text-text-strong-950 font-mono'>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TypographyPage() {
  const groupedStyles = fontStyles.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, FontStyle[]>);

  return (
    <div className='container mx-auto flex-1 px-5 py-16'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-12 text-center'>
          <h1 className='text-title-h1 text-text-strong-950 mb-4'>
            Typography Reference
          </h1>
          <p className='text-paragraph-lg text-text-sub-600'>
            Complete reference of all font styles and classes available in the design system.
          </p>
        </div>

        <FontFamilySection />

        <div className='space-y-12'>
          {Object.entries(groupedStyles).map(([category, styles]) => (
            <div
              key={category}
              className='rounded-2xl bg-bg-white-0 p-8 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200'
            >
              <h2 className='text-title-h3 text-text-strong-950 mb-8'>
                {categoryLabels[category] || category}
              </h2>
              <div className='space-y-0'>
                {styles.map((style) => (
                  <FontStyleCard key={style.name} style={style} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

