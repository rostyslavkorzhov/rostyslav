'use client';

import * as React from 'react';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as LabelPrimitive from '@radix-ui/react-label';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLock2Line,
  RiMailLine,
  RiUserFill,
} from '@remixicon/react';

import { AuthService } from '@/lib/services/auth.service';
import * as Checkbox from '@/components/ui/checkbox';
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const authService = new AuthService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signIn(email, password);
      const redirect = searchParams.get('redirect') || '/admin';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
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
            <RiUserFill className='size-6 text-text-sub-600 md:size-8' />
          </div>
        </div>

        <div className='space-y-1 text-center'>
          <div className='text-title-h6 text-text-strong-950 md:text-title-h5'>
            Sign In
          </div>
          <div className='text-paragraph-sm text-text-sub-600 md:text-paragraph-md'>
            Sign in to access the admin panel
          </div>
        </div>
      </div>

      <Divider.Root />

      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
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
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='password'>
            Password <Label.Asterisk />
          </Label.Root>
          <PasswordInput
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && (
          <Alert.Root variant='lighter' status='error' size='small'>
            <Alert.Icon as={RiErrorWarningLine} />
            {error}
          </Alert.Root>
        )}

        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-start gap-2'>
            <Checkbox.Root
              id='keepLoggedIn'
              checked={keepLoggedIn}
              onCheckedChange={(checked) =>
                setKeepLoggedIn(checked === true)
              }
              disabled={loading}
            />
            <LabelPrimitive.Root
              htmlFor='keepLoggedIn'
              className='block cursor-pointer text-paragraph-sm'
            >
              Keep me logged in
            </LabelPrimitive.Root>
          </div>
          <LinkButton.Root variant='gray' size='medium' underline>
            Forgot password?
          </LinkButton.Root>
        </div>

        <FancyButton.Root
          type='submit'
          variant='primary'
          size='medium'
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </FancyButton.Root>
      </form>

      <p className='text-center text-paragraph-sm text-text-sub-600'>
        Don't have an account?{' '}
        <LinkButton.Root
          variant='primary'
          size='medium'
          asChild
          className='inline'
        >
          <a href='/signup'>Sign up</a>
        </LinkButton.Root>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

