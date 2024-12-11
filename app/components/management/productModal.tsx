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
        <div className='inline-block align-bottom bg-card text-card-foreground rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                <h3
                  className='text-lg leading-6 font-semibold text-foreground'
                  id='modal-title'
                >
                  {isEditing ? "Edit Product" : "Add New Product"}
                </h3>
                <form onSubmit={formik.handleSubmit} className='mt-4'>
                  <div className='space-y-4'>
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-muted-foreground'
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
                        className='mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm'
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
                        className='block text-sm font-medium text-muted-foreground'
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
                        className='mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm'
                      ></textarea>
                      {formik.touched.description &&
                      formik.errors.description ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.description}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor='price'
                        className='block text-sm font-medium text-muted-foreground'
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
                        className='mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm'
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
                        className='block text-sm font-medium text-muted-foreground'
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
                        className='mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm'
                      />
                      {formik.touched.stock && formik.errors.stock ? (
                        <div className='text-red-500 text-sm mt-1'>
                          {formik.errors.stock}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                    <button
                      type='submit'
                      className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring sm:ml-3 sm:w-auto sm:text-sm'
                    >
                      {isEditing ? "Update" : "Create"}
                    </button>
                    <button
                      type='button'
                      className='mt-3 w-full inline-flex justify-center rounded-md border border-input shadow-sm px-4 py-2 bg-background text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring sm:mt-0 sm:w-auto sm:text-sm'
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
