'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiInformationFill,
  RiLock2Line,
  RiMailLine,
  RiUserAddFill,
  RiUserFill,
} from '@remixicon/react';

import { AuthService } from '@/lib/services/auth.service';
import { signupSchema, extractFieldErrors } from '@/lib/validations';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import * as Alert from '@/components/ui/alert';
import { RiErrorWarningLine } from '@remixicon/react';
import { cn } from '@/utils/cn';

function PasswordInput(
  props: React.ComponentPropsWithoutRef<typeof Input.Input>,
) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input.Root>
      <Input.Wrapper>
        <Input.Icon as={RiLock2Line} />
        <Input.Input
          type={showPassword ? 'text' : 'password'}
          placeholder='••••••••••'
          {...props}
        />
        <button type='button' onClick={() => setShowPassword((s) => !s)}>
          {showPassword ? (
            <RiEyeOffLine className='size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300' />
          ) : (
            <RiEyeLine className='size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300' />
          )}
        </button>
      </Input.Wrapper>
    </Input.Root>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    fullName?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const authService = new AuthService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setLoading(true);

    // Client-side validation
    const validationResult = signupSchema.safeParse({
      email,
      password,
      fullName: fullName || undefined,
    });

    if (!validationResult.success) {
      const errors = extractFieldErrors<{
        email: string;
        password: string;
        fullName: string;
      }>(validationResult.error);
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await authService.signUp(email, password, fullName);
      router.push('/discover/home');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full max-w-[440px] flex-col gap-6 rounded-20 bg-bg-white-0 p-5 md:p-8'>
      <div className='flex flex-col items-center gap-2'>
        {/* icon */}
        <div
          className={cn(
            'relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl md:size-24',
            // bg
            'before:absolute before:inset-0 before:rounded-full',
            'before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10',
          )}
        >
          <div className='relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:size-16'>
            <RiUserAddFill className='size-6 text-text-sub-600 md:size-8' />
          </div>
        </div>

        <div className='space-y-1 text-center'>
          <div className='text-title-h6 text-text-strong-950 md:text-title-h5'>
            Create a new account
          </div>
          <div className='text-paragraph-sm text-text-sub-600 md:text-paragraph-md'>
            Enter your details to register.
          </div>
        </div>
      </div>

      <Divider.Root />

      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='fullname'>
            Full Name <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiUserFill} />
              <Input.Input
                id='fullname'
                type='text'
                placeholder='James Brown'
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (validationErrors.fullName) {
                    setValidationErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                required
                disabled={loading}
              />
            </Input.Wrapper>
          </Input.Root>
          {validationErrors.fullName && (
            <p className='text-paragraph-xs text-red-600'>{validationErrors.fullName}</p>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='email'>
            Email Address <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiMailLine} />
              <Input.Input
                id='email'
                type='email'
                placeholder='hello@alignui.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                required
                disabled={loading}
              />
            </Input.Wrapper>
          </Input.Root>
          {validationErrors.email && (
            <p className='text-paragraph-xs text-red-600'>{validationErrors.email}</p>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='password'>
            Password <Label.Asterisk />
          </Label.Root>
          <PasswordInput
            id='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            required
            minLength={8}
            disabled={loading}
          />
          {validationErrors.password ? (
            <p className='text-paragraph-xs text-red-600'>{validationErrors.password}</p>
          ) : (
            <div className='flex gap-1 text-paragraph-xs text-text-sub-600'>
              <RiInformationFill className='size-4 shrink-0 text-text-soft-400' />
              Must contain 1 uppercase letter, 1 number, min. 8 characters.
            </div>
          )}
        </div>

        {error && (
          <Alert.Root variant='lighter' status='error' size='small'>
            <Alert.Icon as={RiErrorWarningLine} />
            {error}
          </Alert.Root>
        )}

        <FancyButton.Root
          type='submit'
          variant='primary'
          size='medium'
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Register'}
        </FancyButton.Root>
      </form>

      <div className='text-center text-paragraph-sm text-text-sub-600'>
        By clicking Register, you agree to accept Apex Financial&apos;s{' '}
        <LinkButton.Root
          variant='black'
          size='medium'
          underline
          className='inline px-1'
        >
          Terms of Service
        </LinkButton.Root>
      </div>

      <p className='text-center text-paragraph-sm text-text-sub-600'>
        Already have an account?{' '}
        <LinkButton.Root
          variant='primary'
          size='medium'
          asChild
          className='inline'
        >
          <a href='/login'>Sign in</a>
        </LinkButton.Root>
      </p>
    </div>
  );
}

