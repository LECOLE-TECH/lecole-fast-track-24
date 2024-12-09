export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[800px] w-full space-y-6 px-4">
          <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4">
              Track One: Frontend Integration Challenge
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-200">
              <p className="leading-6">
                Welcome to the first track of our challenge! In this round, you'll be working with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A pre-built backend API for products</li>
                <li>Integration of frontend components with the API</li>
                <li>Implementation of CRUD operations</li>
              </ul>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Requirements:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clean, readable, and maintainable code</li>
                  <li>Proper use of React hooks</li>
                  <li>Well-structured components</li>
                  <li>User-friendly UI/UX design</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Bonus Points:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Code splitting and lazy loading</li>
                  <li>Memoization for performance</li>
                  <li>Efficient handling of large lists</li>
                  <li>Global state management</li>
                  <li>Testing and TypeScript usage</li>
                </ul>
              </div>
            </div>
          </div>

          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">Ready to begin?</p>
            <ul>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: "/track-one",
    text: "Track One",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
];
