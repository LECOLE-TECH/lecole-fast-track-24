import { format } from "date-fns";
import { type Product } from "~/types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: ProductTableProps) {
  return (
    <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 shadow-lg rounded-3xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-blue-200 dark:divide-blue-700'>
          <thead className='bg-blue-100 dark:bg-blue-900'>
            <tr>
              {[
                "ID",
                "Name",
                "Description",
                "Price",
                "Stock",
                "Created At",
                "Updated At",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className='px-6 py-4 text-left text-xs font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wider'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-blue-100 dark:divide-blue-700'>
            {products.map((product) => (
              <tr
                key={product.id}
                className='hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-150 ease-in-out'
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                  {product.id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                  {product.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                  {product.description}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                  ${product.price.toFixed(2)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                  {product.stock}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                  {format(new Date(product.createdAt), "HH:mm - dd/MM/yyyy")}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300'>
                  {format(new Date(product.updatedAt), "HH:mm - dd/MM/yyyy")}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <button
                    onClick={() => onEdit(product)}
                    className='text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2 transition-colors duration-150 ease-in-out'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-150 ease-in-out'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-blue-200 dark:border-blue-700 sm:px-6'>
        <div className='flex-1 flex justify-between sm:hidden'>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='relative inline-flex items-center px-4 py-2 border border-blue-300 dark:border-blue-600 text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-150 ease-in-out'
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='ml-3 relative inline-flex items-center px-4 py-2 border border-blue-300 dark:border-blue-600 text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-150 ease-in-out'
          >
            Next
          </button>
        </div>
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              Showing page <span className='font-medium'>{currentPage}</span> of{" "}
              <span className='font-medium'>{totalPages}</span>
            </p>
          </div>
          <div>
            <nav
              className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
              aria-label='Pagination'
            >
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-sm font-medium text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-150 ease-in-out'
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-sm font-medium text-blue-500 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-150 ease-in-out'
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
