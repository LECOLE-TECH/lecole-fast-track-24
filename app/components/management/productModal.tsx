import type { FormikProps } from "formik";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  formik: FormikProps<{
    name: string;
    description: string;
    price: number;
    stock: number;
  }>;
  isEditing: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  formik,
  isEditing,
}: ProductModalProps) {
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
                  {isEditing ? "Edit Product" : "Add New Product"}
                </h3>
                <form onSubmit={formik.handleSubmit} className='space-y-6'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                    >
                      Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      className='block w-full px-4 py-3 rounded-xl border-2 border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:border-blue-600 dark:text-white transition-all duration-200 ease-in-out hover:border-blue-300 dark:hover:border-blue-500'
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className='text-red-500 text-sm mt-1'>
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor='description'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                    >
                      Description
                    </label>
                    <textarea
                      name='description'
                      id='description'
                      rows={4}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.description}
                      className='block w-full px-4 py-3 rounded-xl border-2 border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:border-blue-600 dark:text-white transition-all duration-200 ease-in-out hover:border-blue-300 dark:hover:border-blue-500'
                    ></textarea>
                    {formik.touched.description && formik.errors.description ? (
                      <div className='text-red-500 text-sm mt-1'>
                        {formik.errors.description}
                      </div>
                    ) : null}
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label
                        htmlFor='price'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                      >
                        Price
                      </label>
                      <input
                        type='number'
                        name='price'
                        id='price'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.price}
                        className='block w-full px-4 py-3 rounded-xl border-2 border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:border-blue-600 dark:text-white transition-all duration-200 ease-in-out hover:border-blue-300 dark:hover:border-blue-500'
                      />
                      {formik.touched.price && formik.errors.price ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.price}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor='stock'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
                      >
                        Stock
                      </label>
                      <input
                        type='number'
                        name='stock'
                        id='stock'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.stock}
                        className='block w-full px-4 py-3 rounded-xl border-2 border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white dark:bg-gray-700 dark:border-blue-600 dark:text-white transition-all duration-200 ease-in-out hover:border-blue-300 dark:hover:border-blue-500'
                      />
                      {formik.touched.stock && formik.errors.stock ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.stock}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className='mt-8 sm:flex sm:flex-row-reverse'>
                    <button
                      type='submit'
                      className='w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 text-white font-medium text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg'
                    >
                      {isEditing ? "Update" : "Create"}
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
