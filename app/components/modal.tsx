import { Button } from "./ui/button"

interface props {
  setShowModal: (value: boolean) => void
  textConfirm: string
  onConfirm: () => void
}
const Modal = ({ setShowModal, textConfirm, onConfirm }: props) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative p-6 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-700">
        <Button
          type="button"
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
        <div className="p-4 md:p-6 text-center">
          <svg
            className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mb-5 text-lg font-semibold text-gray-600 dark:text-gray-300">
            {textConfirm}
          </h3>
          <div className="flex justify-center space-x-4">
            <Button
              type="button"
              onClick={() => {
                onConfirm()
                setShowModal(false)
              }}
              className="px-5 py-2 text-white bg-red-600 hover:bg-red-800 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Yes, I'm sure
            </Button>
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              No, cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
