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
    <div className='bg-white shadow-md rounded-lg overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              ID
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Description
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Price
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Stock
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Created At
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Updated At
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {products.map((product) => (
            <tr key={product.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {product.id}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {product.name}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {product.description}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                ${product.price.toFixed(2)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {product.stock}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {format(new Date(product.createdAt), "HH:mm - dd/MM/yyyy")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {format(new Date(product.updatedAt), "HH:mm - dd/MM/yyyy")}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <button
                  onClick={() => onEdit(product)}
                  className='text-indigo-600 hover:text-indigo-900 mr-2'
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className='text-red-600 hover:text-red-900'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
        <div className='flex-1 flex justify-between sm:hidden'>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
          >
            Next
          </button>
        </div>
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm text-gray-700'>
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
                className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
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
