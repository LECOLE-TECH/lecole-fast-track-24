import React, { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  visiblePages?: number
}

const calculateVisiblePages = (
  visiblePages: number,
  totalPages: number,
  currentPage: number
) => {
  const pages: number[] = []
  const half = Math.floor(visiblePages / 2)

  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, currentPage + half)
  if (end - start + 1 < visiblePages) {
    const diff = visiblePages - (end - start + 1)
    start = Math.max(1, start - diff)
    end = Math.min(totalPages, end + diff)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 3
}) => {
  const [visiblePagesArray, setVisiblePageArray] = useState<number[]>([])

  useEffect(() => {
    setVisiblePageArray(
      calculateVisiblePages(visiblePages, totalPages, currentPage)
    )
  }, [currentPage, totalPages, visiblePages])

  return (
    <ul className="flex items-center h-10 gap-1">
      <li>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`interceptor-loading flex items-center justify-center px-2 h-10 ms-0 leading-tight ${
            currentPage === 1
              ? "text-gray-300 bg-gray-100 hover:bg-gray-100"
              : "text-gray-500 bg-white hover:bg-gray-100"
          } border border-e-0 border-gray-300 rounded-s-lg`}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft />
        </Button>
      </li>

      {visiblePagesArray[0] > 1 && (
        <li>
          <Button
            onClick={() => onPageChange(1)}
            className="interceptor-loading px-4 h-10 text-gray-500 bg-white hover:bg-gray-100 border border-gray-300"
          >
            1
          </Button>
          {visiblePagesArray[0] > 2 && <span className="px-2">...</span>}
        </li>
      )}

      {visiblePagesArray.map((page) => (
        <li key={page}>
          <Button
            onClick={() => onPageChange(page)}
            className={`interceptor-loading flex items-center justify-center px-4 h-10 leading-tight ${
              page === currentPage
                ? "text-white bg-blue-500 hover:bg-blue-600"
                : "text-gray-500 bg-white hover:bg-gray-100"
            } border border-gray-300`}
          >
            {page}
          </Button>
        </li>
      ))}

      {visiblePagesArray[visiblePagesArray.length - 1] < totalPages && (
        <li>
          {visiblePagesArray[visiblePagesArray.length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
          )}
          <Button
            onClick={() => onPageChange(totalPages)}
            className="interceptor-loading px-4 h-10 text-gray-500 bg-white hover:bg-gray-100 border border-gray-300"
          >
            {totalPages}
          </Button>
        </li>
      )}

      <li>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`interceptor-loading flex items-center justify-center px-2 h-10 leading-tight ${
            currentPage === totalPages
              ? "text-gray-300 bg-gray-100 hover:bg-gray-100"
              : "text-gray-500 bg-white hover:bg-gray-100"
          } border border-gray-300 rounded-e-lg`}
        >
          <span className="sr-only">Next</span>
          <ChevronRight />
        </Button>
      </li>
    </ul>
  )
}

export default Pagination
