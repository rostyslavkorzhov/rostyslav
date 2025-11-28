interface SectionWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionWrapper({
  title,
  description,
  children,
}: SectionWrapperProps) {
  return (
    <div>
      <div className='mb-8'>
        <h2 className='text-title-h2 mb-2 text-text-strong-950'>{title}</h2>
        {description && (
          <p className='text-paragraph-md text-text-sub-600'>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
