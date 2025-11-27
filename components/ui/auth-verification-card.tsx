// AlignUI AuthVerificationCard v0.0.0

'use client';

import * as React from 'react';

import { RiMailCheckFill } from '@remixicon/react';

import * as DigitInput from '@/components/ui/digit-input';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as LinkButton from '@/components/ui/link-button';

import { cn } from '@/utils/cn';

const AUTH_VERIFICATION_CARD_ROOT_NAME = 'AuthVerificationCardRoot';
const AUTH_VERIFICATION_CARD_ICON_NAME = 'AuthVerificationCardIcon';
const AUTH_VERIFICATION_CARD_HEADER_NAME = 'AuthVerificationCardHeader';
const AUTH_VERIFICATION_CARD_TITLE_NAME = 'AuthVerificationCardTitle';
const AUTH_VERIFICATION_CARD_DESCRIPTION_NAME =
  'AuthVerificationCardDescription';
const AUTH_VERIFICATION_CARD_INPUT_NAME = 'AuthVerificationCardInput';
const AUTH_VERIFICATION_CARD_SUBMIT_NAME = 'AuthVerificationCardSubmit';
const AUTH_VERIFICATION_CARD_FOOTER_NAME = 'AuthVerificationCardFooter';

type AuthVerificationCardRootProps = React.HTMLAttributes<HTMLDivElement>;

const AuthVerificationCardRoot = React.forwardRef<
  HTMLDivElement,
  AuthVerificationCardRootProps
>(({ className, children, ...rest }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      className={cn(
        'flex w-full max-w-[440px] flex-col gap-6 rounded-20 bg-bg-white-0 p-5 md:p-8',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
AuthVerificationCardRoot.displayName = AUTH_VERIFICATION_CARD_ROOT_NAME;

type AuthVerificationCardIconProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
};

const AuthVerificationCardIcon = React.forwardRef<
  HTMLDivElement,
  AuthVerificationCardIconProps
>(({ className, icon, ...rest }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      className={cn(
        'relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl md:size-24',
        // bg
        'before:absolute before:inset-0 before:rounded-full',
        'before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10',
        className,
      )}
      {...rest}
    >
      <div className='relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:size-16'>
        {icon ?? <RiMailCheckFill className='size-6 text-text-sub-600 md:size-8' />}
      </div>
    </div>
  );
});
AuthVerificationCardIcon.displayName = AUTH_VERIFICATION_CARD_ICON_NAME;

type AuthVerificationCardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const AuthVerificationCardHeader = React.forwardRef<
  HTMLDivElement,
  AuthVerificationCardHeaderProps
>(({ className, children, ...rest }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      className={cn('flex flex-col items-center gap-2', className)}
      {...rest}
    >
      {children}
    </div>
  );
});
AuthVerificationCardHeader.displayName = AUTH_VERIFICATION_CARD_HEADER_NAME;

type AuthVerificationCardTitleProps = React.HTMLAttributes<HTMLDivElement>;

const AuthVerificationCardTitle = React.forwardRef<
  HTMLDivElement,
  AuthVerificationCardTitleProps
>(({ className, children, ...rest }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      className={cn(
        'text-title-h6 text-text-strong-950 md:text-title-h5',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
AuthVerificationCardTitle.displayName = AUTH_VERIFICATION_CARD_TITLE_NAME;

type AuthVerificationCardDescriptionProps =
  React.HTMLAttributes<HTMLDivElement>;

const AuthVerificationCardDescription = React.forwardRef<
  HTMLDivElement,
  AuthVerificationCardDescriptionProps
>(({ className, children, ...rest }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      className={cn(
        'text-paragraph-sm text-text-sub-600 md:text-paragraph-md',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
AuthVerificationCardDescription.displayName =
  AUTH_VERIFICATION_CARD_DESCRIPTION_NAME;

type AuthVerificationCardInputProps = {
  numInputs?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
};

function AuthVerificationCardInput({
  numInputs = 4,
  value,
  onChange,
  hasError,
  disabled,
  className,
}: AuthVerificationCardInputProps) {
  return (
    <DigitInput.Root
      numInputs={numInputs}
      onChange={onChange}
      value={value}
      hasError={hasError}
      disabled={disabled}
      className={className}
    />
  );
}
AuthVerificationCardInput.displayName = AUTH_VERIFICATION_CARD_INPUT_NAME;

type AuthVerificationCardSubmitProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'neutral' | 'destructive' | 'basic';
    size?: 'medium' | 'small' | 'xsmall';
  };

const AuthVerificationCardSubmit = React.forwardRef<
  HTMLButtonElement,
  AuthVerificationCardSubmitProps
>(
  (
    { className, children, variant = 'primary', size = 'medium', ...rest },
    forwardedRef,
  ) => {
    return (
      <FancyButton.Root
        ref={forwardedRef}
        variant={variant}
        size={size}
        className={className}
        {...rest}
      >
        {children}
      </FancyButton.Root>
    );
  },
);
AuthVerificationCardSubmit.displayName = AUTH_VERIFICATION_CARD_SUBMIT_NAME;

type AuthVerificationCardFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  linkText?: string;
  onLinkClick?: () => void;
};

const AuthVerificationCardFooter = React.forwardRef<
  HTMLDivElement,
  AuthVerificationCardFooterProps
>(
  (
    { className, children, linkText, onLinkClick, ...rest },
    forwardedRef,
  ) => {
    return (
      <div
        ref={forwardedRef}
        className={cn(
          'flex flex-col items-center gap-1 text-center text-paragraph-sm text-text-sub-600',
          className,
        )}
        {...rest}
      >
        {children}
        {linkText && (
          <LinkButton.Root
            variant='black'
            size='medium'
            underline
            onClick={onLinkClick}
          >
            {linkText}
          </LinkButton.Root>
        )}
      </div>
    );
  },
);
AuthVerificationCardFooter.displayName = AUTH_VERIFICATION_CARD_FOOTER_NAME;

// Convenience component that composes all parts together
type AuthVerificationCardProps = {
  title?: string;
  description?: React.ReactNode;
  email?: string;
  numInputs?: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  submitText?: string;
  footerText?: string;
  resendText?: string;
  onResend?: () => void;
  icon?: React.ReactNode;
  hasError?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
};

function AuthVerificationCard({
  title = 'Enter Verification Code',
  description,
  email,
  numInputs = 4,
  value,
  onChange,
  onSubmit,
  submitText = 'Submit Code',
  footerText = 'Experiencing issues receiving the code?',
  resendText = 'Resend code',
  onResend,
  icon,
  hasError,
  disabled,
  isLoading,
  className,
}: AuthVerificationCardProps) {
  return (
    <AuthVerificationCardRoot className={className}>
      <AuthVerificationCardHeader>
        <AuthVerificationCardIcon icon={icon} />
        <div className='space-y-1 text-center'>
          <AuthVerificationCardTitle>{title}</AuthVerificationCardTitle>
          <AuthVerificationCardDescription>
            {description ?? (
              <>
                We&apos;ve sent a code to{' '}
                <span className='font-medium text-text-strong-950'>
                  {email ?? 'your email'}
                </span>
              </>
            )}
          </AuthVerificationCardDescription>
        </div>
      </AuthVerificationCardHeader>

      <Divider.Root />

      <AuthVerificationCardInput
        numInputs={numInputs}
        value={value}
        onChange={onChange}
        hasError={hasError}
        disabled={disabled || isLoading}
      />

      <AuthVerificationCardSubmit
        onClick={onSubmit}
        disabled={disabled || isLoading}
      >
        {isLoading ? 'Verifying...' : submitText}
      </AuthVerificationCardSubmit>

      <AuthVerificationCardFooter linkText={resendText} onLinkClick={onResend}>
        {footerText}
      </AuthVerificationCardFooter>
    </AuthVerificationCardRoot>
  );
}

export {
  AuthVerificationCardRoot as Root,
  AuthVerificationCardIcon as Icon,
  AuthVerificationCardHeader as Header,
  AuthVerificationCardTitle as Title,
  AuthVerificationCardDescription as Description,
  AuthVerificationCardInput as Input,
  AuthVerificationCardSubmit as Submit,
  AuthVerificationCardFooter as Footer,
  AuthVerificationCard as Composed,
};

