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
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          aria-hidden='true'
        ></div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <form onSubmit={formik.handleSubmit}>
            <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                  <h3
                    className='text-lg leading-6 font-medium text-gray-900'
                    id='modal-title'
                  >
                    {isEditing ? "Edit Product" : "Add New Product"}
                  </h3>
                  <div className='mt-2'>
                    <div className='mb-4'>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700'
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
                        className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.name}
                        </div>
                      ) : null}
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='description'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Description
                      </label>
                      <textarea
                        name='description'
                        id='description'
                        rows={3}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      ></textarea>
                      {formik.touched.description &&
                      formik.errors.description ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.description}
                        </div>
                      ) : null}
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='price'
                        className='block text-sm font-medium text-gray-700'
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
                        className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                      {formik.touched.price && formik.errors.price ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.price}
                        </div>
                      ) : null}
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='stock'
                        className='block text-sm font-medium text-gray-700'
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
                        className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                      {formik.touched.stock && formik.errors.stock ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.stock}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <button
                type='submit'
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'
              >
                {isEditing ? "Update" : "Create"}
              </button>
              <button
                type='button'
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
