'use client';

import * as React from 'react';
import Link from 'next/link';
import * as Table from '@/components/ui/table';
import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as Input from '@/components/ui/input';
import { Input as InputEl } from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Hint from '@/components/ui/hint';
import { useNotification } from '@/hooks/use-notification';
import { RiEditLine, RiDeleteBinLine } from '@remixicon/react';

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

export default function DataPage() {
  const { notification } = useNotification();
  const [data, setData] = React.useState<AuthData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<AuthData | null>(null);
  const [editFormData, setEditFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [editErrors, setEditErrors] = React.useState<FormErrors>({});
  const [isSaving, setIsSaving] = React.useState(false);

  const loadData = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('authData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setData(parsedData);
        } catch (error) {
          console.error('Error parsing stored data:', error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEditForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!editFormData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!editFormData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!editFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(editFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!editFormData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRowClick = (entry: AuthData) => {
    setSelectedEntry(entry);
    setEditFormData({
      firstName: entry.firstName,
      lastName: entry.lastName,
      email: entry.email,
      password: entry.password,
    });
    setEditErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (field: keyof typeof editFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!selectedEntry) return;

    if (!validateEditForm()) {
      notification({
        status: 'error',
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update the entry in localStorage
      const updatedData = data.map((item) =>
        item.id === selectedEntry.id
          ? {
              ...item,
              firstName: editFormData.firstName.trim(),
              lastName: editFormData.lastName.trim(),
              email: editFormData.email.trim(),
              password: editFormData.password,
            }
          : item
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem('authData', JSON.stringify(updatedData));
      }

      setData(updatedData);
      setIsModalOpen(false);
      setSelectedEntry(null);

      notification({
        status: 'success',
        title: 'Entry Updated',
        description: 'The entry has been successfully updated.',
      });
    } catch (error) {
      notification({
        status: 'error',
        title: 'Error',
        description: 'Failed to update entry. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      // Remove the entry from localStorage
      const updatedData = data.filter((item) => item.id !== selectedEntry.id);

      if (typeof window !== 'undefined') {
        localStorage.setItem('authData', JSON.stringify(updatedData));
      }

      setData(updatedData);
      setIsModalOpen(false);
      setSelectedEntry(null);

      notification({
        status: 'success',
        title: 'Entry Deleted',
        description: 'The entry has been successfully deleted.',
      });
    } catch (error) {
      notification({
        status: 'error',
        title: 'Error',
        description: 'Failed to delete entry. Please try again.',
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
    setEditFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    setEditErrors({});
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className='container mx-auto flex-1 px-5 py-16 bg-bg-weak-50'>
        <div className='mx-auto max-w-7xl'>
          <div className='flex items-center justify-center py-16'>
            <p className='text-paragraph-md text-text-sub-600'>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className='container mx-auto flex-1 px-5 py-16 bg-bg-weak-50'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-8'>
            <h1 className='text-title-h4 text-text-strong-950 mb-2'>Data</h1>
            <p className='text-paragraph-md text-text-sub-600'>
              View all submitted form data
            </p>
          </div>

          <div className='rounded-20 bg-bg-white-0 p-12 shadow-regular-lg'>
            <div className='flex flex-col items-center justify-center text-center'>
              <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-bg-weak-50'>
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-text-sub-600'
                >
                  <path
                    d='M9 12h6M9 16h6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <h2 className='text-title-h5 text-text-strong-950 mb-2'>
                No data yet
              </h2>
              <p className='text-paragraph-md text-text-sub-600 mb-8 max-w-md'>
                You haven't submitted any form data yet. Create an account to get
                started.
              </p>
              <Button.Root variant='primary' mode='filled' size='medium' asChild>
                <Link href='/auth-card'>Create Account</Link>
              </Button.Root>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto flex-1 px-5 py-16 bg-bg-weak-50'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-title-h4 text-text-strong-950 mb-2'>Data</h1>
            <p className='text-paragraph-md text-text-sub-600'>
              View all submitted form data ({data.length} {data.length === 1 ? 'entry' : 'entries'})
            </p>
          </div>
          <Button.Root variant='neutral' mode='stroke' size='medium' asChild>
            <Link href='/auth-card'>Add New</Link>
          </Button.Root>
        </div>

        <div className='rounded-20 bg-bg-white-0 p-8 shadow-regular-lg'>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>First Name</Table.Head>
                <Table.Head>Last Name</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head>Password</Table.Head>
                <Table.Head>Created At</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Table.Row
                    className='cursor-pointer'
                    onClick={() => handleRowClick(item)}
                  >
                    <Table.Cell>
                      <span className='text-paragraph-sm text-text-strong-950'>
                        {item.firstName}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-paragraph-sm text-text-strong-950'>
                        {item.lastName}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-paragraph-sm text-text-strong-950'>
                        {item.email}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-paragraph-sm text-text-strong-950 font-mono'>
                        {item.password}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-paragraph-sm text-text-sub-600'>
                        {formatDate(item.createdAt)}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  {index < data.length - 1 && <Table.RowDivider />}
                </React.Fragment>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal.Root open={isModalOpen} onOpenChange={handleModalClose}>
        <Modal.Content className='max-w-[500px]'>
          <Modal.Header
            icon={RiEditLine}
            title='Edit Entry'
            description='Update the entry information below'
          />
          <Modal.Body>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className='space-y-4'
            >
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
                {/* First Name */}
                <div>
                  <Label.Root htmlFor='edit-firstName' className='mb-2 block'>
                    First Name
                  </Label.Root>
                  <Input.Root hasError={!!editErrors.firstName}>
                    <Input.Wrapper>
                      <InputEl
                        type='text'
                        id='edit-firstName'
                        placeholder='John'
                        value={editFormData.firstName}
                        onChange={handleInputChange('firstName')}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {editErrors.firstName && (
                    <Hint.Root hasError className='mt-1.5'>
                      {editErrors.firstName}
                    </Hint.Root>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Label.Root htmlFor='edit-lastName' className='mb-2 block'>
                    Last Name
                  </Label.Root>
                  <Input.Root hasError={!!editErrors.lastName}>
                    <Input.Wrapper>
                      <InputEl
                        type='text'
                        id='edit-lastName'
                        placeholder='Doe'
                        value={editFormData.lastName}
                        onChange={handleInputChange('lastName')}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {editErrors.lastName && (
                    <Hint.Root hasError className='mt-1.5'>
                      {editErrors.lastName}
                    </Hint.Root>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label.Root htmlFor='edit-email' className='mb-2 block'>
                  Email Address
                </Label.Root>
                <Input.Root hasError={!!editErrors.email}>
                  <Input.Wrapper>
                    <InputEl
                      type='email'
                      id='edit-email'
                      placeholder='john.doe@example.com'
                      value={editFormData.email}
                      onChange={handleInputChange('email')}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {editErrors.email && (
                  <Hint.Root hasError className='mt-1.5'>
                    {editErrors.email}
                  </Hint.Root>
                )}
              </div>

              {/* Password */}
              <div>
                <Label.Root htmlFor='edit-password' className='mb-2 block'>
                  Password
                </Label.Root>
                <Input.Root hasError={!!editErrors.password}>
                  <Input.Wrapper>
                    <InputEl
                      type='text'
                      id='edit-password'
                      placeholder='••••••••'
                      value={editFormData.password}
                      onChange={handleInputChange('password')}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {editErrors.password && (
                  <Hint.Root hasError className='mt-1.5'>
                    {editErrors.password}
                  </Hint.Root>
                )}
              </div>

              {/* Created At (Read-only) */}
              {selectedEntry && (
                <div>
                  <Label.Root className='mb-2 block'>Created At</Label.Root>
                  <div className='rounded-10 bg-bg-weak-50 px-3 py-2.5'>
                    <span className='text-paragraph-sm text-text-sub-600'>
                      {formatDate(selectedEntry.createdAt)}
                    </span>
                  </div>
                </div>
              )}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              variant='error'
              mode='stroke'
              size='medium'
              onClick={handleDelete}
            >
              <Button.Icon as={RiDeleteBinLine} />
              Delete
            </Button.Root>
            <div className='flex gap-3'>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='medium'
                onClick={handleModalClose}
              >
                Cancel
              </Button.Root>
              <Button.Root
                variant='primary'
                mode='filled'
                size='medium'
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button.Root>
            </div>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

