import React, { useEffect } from "react";
import type { FormikProps } from "formik";
import type { User } from "~/types/user";

interface UpdateSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<{ new_secret_phrase: string }>;
  selectedUser: User | null;
}

export default function UpdateSecretModal({
  isOpen,
  onClose,
  formik,
  selectedUser,
}: UpdateSecretModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 transition-opacity'
          aria-hidden='true'
          onClick={onClose}
        >
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>

        <span
          className='hidden sm:inline-block sm:h-screen sm:align-middle'
          aria-hidden='true'
        >
          &#8203;
        </span>

        <div
          className='inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
        >
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                <h3
                  className='text-lg font-medium leading-6 text-gray-900'
                  id='modal-headline'
                >
                  Update Secret Phrase for {selectedUser?.username}
                </h3>
                <div className='mt-2'>
                  <form onSubmit={formik.handleSubmit}>
                    <input
                      type='text'
                      name='new_secret_phrase'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.new_secret_phrase}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                      placeholder='New secret phrase'
                    />
                    {formik.touched.new_secret_phrase &&
                    formik.errors.new_secret_phrase ? (
                      <div className='mt-1 text-sm text-red-500'>
                        {formik.errors.new_secret_phrase}
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
            <button
              type='submit'
              className='inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
            >
              Update Secret Phrase
            </button>
            <button
              type='button'
              className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
