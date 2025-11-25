'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import * as Button from '@/components/ui/button';
import * as SocialButton from '@/components/ui/social-button';
import * as Input from '@/components/ui/input';
import { Input as InputEl } from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Divider from '@/components/ui/divider';
import * as LinkButton from '@/components/ui/link-button';
import * as Hint from '@/components/ui/hint';
import { useNotification } from '@/hooks/use-notification';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

// LinkedIn Icon Component
const LinkedInIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    ref={ref}
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
      fill='currentColor'
    />
  </svg>
));
LinkedInIcon.displayName = 'LinkedInIcon';

interface AuthData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export default function AuthCardPage() {
  const router = useRouter();
  const { notification } = useNotification();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      notification({
        status: 'error',
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new auth data entry
      const newAuthData: AuthData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        createdAt: new Date().toISOString(),
      };

      // Get existing data from localStorage
      const existingData = typeof window !== 'undefined' 
        ? localStorage.getItem('authData')
        : null;
      
      const dataArray: AuthData[] = existingData 
        ? JSON.parse(existingData)
        : [];

      // Add new entry
      dataArray.push(newAuthData);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authData', JSON.stringify(dataArray));
      }

      // Show success notification
      notification({
        status: 'success',
        title: 'Account Created',
        description: 'Your account has been created successfully!',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
      setErrors({});
      setShowPassword(false);

      // Navigate to data page
      router.push('/data');
    } catch (error) {
      notification({
        status: 'error',
        title: 'Error',
        description: 'Failed to save data. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearPassword = () => {
    setFormData((prev) => ({ ...prev, password: '' }));
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  return (
    <div className='container mx-auto flex-1 px-5 py-16 bg-bg-weak-50'>
      <div className='mx-auto flex max-w-md items-center justify-center'>
        <div className='w-full rounded-20 bg-bg-white-0 p-8 shadow-regular-lg'>
          {/* Logo */}
          <div className='mb-6 flex justify-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-500'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6 12C6 14 8 16 10 16C12 16 14 14 14 12C14 10 12 8 10 8C8 8 6 10 6 12Z'
                  fill='white'
                />
                <path
                  d='M2 12C2 14 4 16 6 16C8 16 10 14 10 12C10 10 8 8 6 8C4 8 2 10 2 12Z'
                  fill='white'
                />
                <path
                  d='M10 12C10 14 12 16 14 16C16 16 18 14 18 12C18 10 16 8 14 8C12 8 10 10 10 12Z'
                  fill='white'
                />
                <path
                  d='M14 12C14 14 16 16 18 16C20 16 22 14 22 12C22 10 20 8 18 8C16 8 14 10 14 12Z'
                  fill='white'
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className='text-title-h6 text-text-strong-950 mb-2 text-center'>
            Create an account
          </h1>
          <p className='text-paragraph-sm text-text-sub-600 mb-6 text-center'>
            Please enter your details to create an account.
          </p>

          {/* LinkedIn Button */}
          <div className='mb-6'>
            <SocialButton.Root brand='linkedin' mode='stroke' className='w-full'>
              <SocialButton.Icon as={LinkedInIcon} className='text-[#0077b5]' />
              Continue with LinkedIn
            </SocialButton.Root>
          </div>

          {/* Divider */}
          <div className='mb-6'>
            <Divider.Root variant='line-text'>OR</Divider.Root>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Name Fields */}
            <div className='grid grid-cols-2 gap-4'>
              {/* First Name */}
              <div>
                <Label.Root htmlFor='firstName' className='mb-2 block'>
                  First Name
                </Label.Root>
                <Input.Root hasError={!!errors.firstName}>
                  <Input.Wrapper>
                    <InputEl
                      type='text'
                      id='firstName'
                      placeholder='John'
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.firstName && (
                  <Hint.Root hasError className='mt-1.5'>
                    {errors.firstName}
                  </Hint.Root>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label.Root htmlFor='lastName' className='mb-2 block'>
                  Last Name
                </Label.Root>
                <Input.Root hasError={!!errors.lastName}>
                  <Input.Wrapper>
                    <InputEl
                      type='text'
                      id='lastName'
                      placeholder='Doe'
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.lastName && (
                  <Hint.Root hasError className='mt-1.5'>
                    {errors.lastName}
                  </Hint.Root>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label.Root htmlFor='email' className='mb-2 block'>
                Email Address
              </Label.Root>
              <Input.Root hasError={!!errors.email}>
                <Input.Wrapper>
                  <InputEl
                    type='email'
                    id='email'
                    placeholder='john.doe@example.com'
                    value={formData.email}
                    onChange={handleInputChange('email')}
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.email && (
                <Hint.Root hasError className='mt-1.5'>
                  {errors.email}
                </Hint.Root>
              )}
            </div>

            {/* Password */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <Label.Root htmlFor='password' className='block'>
                  Password
                </Label.Root>
                <button
                  type='button'
                  onClick={handleClearPassword}
                  className='text-label-sm text-text-sub-600 hover:text-text-strong-950 transition-colors'
                >
                  Clear
                </button>
              </div>
              <Input.Root hasError={!!errors.password}>
                <Input.Wrapper className='justify-between'>
                  <InputEl
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    placeholder='••••••••'
                    className='flex-1'
                    value={formData.password}
                    onChange={handleInputChange('password')}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='ml-2 flex items-center text-text-sub-600 hover:text-text-strong-950 transition-colors'
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <RiEyeOffLine className='size-5' />
                    ) : (
                      <RiEyeLine className='size-5' />
                    )}
                  </button>
                </Input.Wrapper>
              </Input.Root>
              {errors.password && (
                <Hint.Root hasError className='mt-1.5'>
                  {errors.password}
                </Hint.Root>
              )}
            </div>

            {/* Continue Button */}
            <div className='pt-2'>
              <Button.Root
                variant='primary'
                mode='filled'
                size='medium'
                className='w-full'
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Continue'}
              </Button.Root>
            </div>
          </form>

          {/* Login Link */}
          <div className='mt-6 text-center'>
            <span className='text-paragraph-sm text-text-sub-600'>
              Already have an account?{' '}
            </span>
            <LinkButton.Root variant='primary' size='small' asChild>
              <a href='#'>Login</a>
            </LinkButton.Root>
          </div>
        </div>
      </div>
    </div>
  );
}

