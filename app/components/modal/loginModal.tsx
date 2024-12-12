import type { FormikProps } from "formik";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<{
    username: string;
    secret_phrase: string;
  }>;
}

export default function LoginModal({
  isOpen,
  onClose,
  formik,
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed z-10 inset-0 overflow-y-auto'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity'
          aria-hidden='true'
        ></div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white dark:bg-gray-800 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-4 border-blue-200 dark:border-blue-700'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 px-6 pt-6 pb-6 sm:p-8'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:text-left w-full'>
                <h3
                  className='text-2xl leading-6 font-bold text-blue-600 dark:text-blue-300 mb-6'
                  id='modal-title'
                >
                  Login
                </h3>
                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                    >
                      Username
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      className='block w-full px-4 py-3 rounded-xl border-2 border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:border-blue-600 dark:text-white transition-all duration-200 ease-in-out hover:border-blue-300 dark:hover:border-blue-500'
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <div className='text-red-500 text-sm mt-1'>
                        {formik.errors.username}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                    >
                      Secret_phrase
                    </label>
                    <input
                      type='password'
                      name='secret_phrase'
                      id='secret_phrase'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.secret_phrase}
                      className='block w-full px-4 py-3 rounded-xl border-2 border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:border-blue-600 dark:text-white transition-all duration-200 ease-in-out hover:border-blue-300 dark:hover:border-blue-500'
                    />
                    {formik.touched.secret_phrase &&
                    formik.errors.secret_phrase ? (
                      <div className='text-red-500 text-sm mt-1'>
                        {formik.errors.secret_phrase}
                      </div>
                    ) : null}
                  </div>
                  <div className='mt-8 sm:flex sm:flex-row-reverse'>
                    <button
                      type='submit'
                      disabled={formik.isSubmitting}
                      className='w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 text-white font-medium text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'
                    >
                      {formik.isSubmitting ? "Logging in..." : "Submit"}
                    </button>
                    <button
                      type='button'
                      className='mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 rounded-full bg-white text-blue-600 font-medium text-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border-2 border-blue-200 dark:bg-gray-700 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
