import { SectionWrapper } from './components/section-wrapper';
import { TypographyShowcase } from './components/typography-showcase';
import { ColorsShowcase } from './components/colors-showcase';
import { ShadowsShowcase } from './components/shadows-showcase';
import { BorderRadiusShowcase } from './components/border-radius-showcase';
import { ButtonsShowcase } from './components/buttons-showcase';
import { FormInputsShowcase } from './components/form-inputs-showcase';
import { FeedbackShowcase } from './components/feedback-showcase';
import { OverlaysShowcase } from './components/overlays-showcase';
import { NavigationShowcase } from './components/navigation-showcase';
import { DataDisplayShowcase } from './components/data-display-showcase';
import { PatternsShowcase } from './components/patterns-showcase';

export default function LibraryPage() {
  return (
    <div className='container mx-auto flex-1 px-5 py-16'>
      <div className='mx-auto max-w-7xl'>
        {/* Hero Section */}
        <div className='mb-16 text-center'>
          <h1 className='text-title-h1 mb-6 text-text-strong-950'>
            Component Library
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-paragraph-lg text-text-sub-600'>
            A comprehensive showcase of our AlignUI-based design system. Explore
            typography, colors, components, and patterns.
          </p>
        </div>

        {/* Foundation Section */}
        <section id='foundation' className='mb-20 scroll-mt-20'>
          <SectionWrapper
            title='Foundation'
            description='Design tokens including typography, colors, shadows, and border radius'
          >
            <div className='space-y-16'>
              <TypographyShowcase />
              <ColorsShowcase />
              <ShadowsShowcase />
              <BorderRadiusShowcase />
            </div>
          </SectionWrapper>
        </section>

        {/* Components Section */}
        <section id='components' className='mb-20 scroll-mt-20'>
          <SectionWrapper
            title='Components'
            description='Interactive UI components built with AlignUI'
          >
            <div className='space-y-16'>
              <ButtonsShowcase />
              <FormInputsShowcase />
              <FeedbackShowcase />
              <OverlaysShowcase />
              <NavigationShowcase />
              <DataDisplayShowcase />
            </div>
          </SectionWrapper>
        </section>

        {/* Patterns Section */}
        <section id='patterns' className='mb-20 scroll-mt-20'>
          <SectionWrapper
            title='Patterns'
            description='Reusable component patterns and compositions'
          >
            <PatternsShowcase />
          </SectionWrapper>
        </section>
      </div>
    </div>
  );
}
