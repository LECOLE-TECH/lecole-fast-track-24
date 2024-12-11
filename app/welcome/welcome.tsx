const TrackCard = ({
  title,
  description,
  requirements,
  features
}: {
  title: string;
  description: string;
  requirements?: string[];
  features?: string[];
}) => (
  <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4">{title}</h2>
    <div className="space-y-4 text-gray-700 dark:text-gray-200">
      <p className="leading-6">{description}</p>
      {requirements && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Requirements:</h3>
          <ul className="list-disc pl-6 space-y-2">
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}
      {features && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Focus Areas:</h3>
          <ul className="list-disc pl-6 space-y-2">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const Navigation = ({ resources }: { resources: Array<{ href: string; text: string; icon: React.ReactNode }> }) => (
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
);

const ReactIcon = () => (
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
);

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[800px] w-full space-y-6 px-4">
          <TrackCard
            title="Welcome to LECOLE Fast Track Challenge"
            description="Welcome to the LECOLE Fast Track Challenge! This challenge consists of three tracks designed to assess your web development skills using React. Each track will focus on a different aspect of development—from basic frontend integration to performance optimization. You’ll have 10 days to complete all the tracks. Best of luck!"
          />

          <TrackCard
            title="Track One: Frontend Integration Challenge"
            description="In this track, you will integrate the frontend with a pre-built backend API. The API is already set up with product data, and your task is to implement the frontend that interacts with it. You'll need to create a user-friendly interface that allows full CRUD (Create, Read, Update, Delete) functionality for the products."
            requirements={[
              "Write clean, readable, and maintainable code",
              "Use React hooks correctly (e.g., useState, useEffect)",
              "Structure components in a reusable way",
              "Ensure a user-friendly UI/UX design"
            ]}
            features={[
              "Integrate with a pre-built backend API for products",
              "Implement CRUD operations (Create, Read, Update, Delete)",
              "Develop reusable frontend components",
              "Implement state management for handling product data",
              "Follow best API integration patterns"
            ]}
          />

          <TrackCard
            title="Track Two: React RBAC"
            description="In this track, you’ll focus on implementing a React application with RBAC (Role-Based Access Control). The app will include a list of users with roles and secret phrases. Your task is to implement real-time updates using sockets, ensure data is loaded efficiently, and securely."
            requirements={[
              "Write clean, readable, and maintainable code",
              "Properly use React hooks for performance optimization",
              "Structure components in a way that is easy to maintain",
              "Ensure the UI/UX is intuitive and user-friendly"
            ]}
            features={[
              "Implement an input field for usernames",
              "Create provider-based access for different user roles (non-authenticated, authenticated, and admin users)",
              "Non-authenticated users can only see the list of username",
              "Authenticated users can see the list of username and their roles. They can also update their secret phrase",
              "Admin users can see all of the information of all users, and can update the secret phrase of any user",
              "Display all of the data in a table format",
              "Use sockets to keep user data updated in real-time",
              "Ensure data is efficiently loaded and rendered"
            ]}
          />

          <TrackCard
            title="Bonus Points"
            description="These additional features will enhance your submission and improve performance and user experience."
            features={[
              "Implement code splitting and lazy loading for faster page loads",
              "Use memoization to prevent unnecessary re-renders",
              "Optimize handling of large lists (e.g., virtualize or paginate lists)",
              "Implement pagination or infinite scrolling for long lists",
              "Use a global state management solution (e.g., Redux, Zustand, or Context API)",
              "Write comprehensive tests for your application",
              "Ensure TypeScript is used throughout the project",
              "Document performance optimizations and improvements"
            ]}
          />

          <TrackCard
            title="Deliverables"
            description="Ensure you submit the following items when you complete your project:"
            features={[
              "Fork the GitHub repository and follow the instructions to run the project locally",
              "Deploy the app using a free service like Vercel, GitHub Pages, or Netlify (if possible)",
              "Document the challenges you faced and the solutions you implemented for each track",
              "Submit a Pull Request with your changes to the original repository"
            ]}
          />

          <Navigation
            resources={[
              {
                href: "/track-one",
                text: "Start Track One",
                icon: <ReactIcon />
              },
              {
                href: "/track-two",
                text: "Start Track Two",
                icon: <ReactIcon />
              }
            ]}
          />
        </div>
      </div>
    </main>
  );
}
