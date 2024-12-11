import React from "react";
import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiExpress, SiTailwindcss } from "react-icons/si";
import Footer from "~/components/ui/footer";
import Header from "~/components/ui/header";

export default function About() {
  return (
    <div>
      <Header />

      <div className='min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-8 pt-24'>
        <div className='max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl'>
          <header className='bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white'>
            <h1 className='text-4xl font-bold mb-2 animate-fade-in-down'>
              My Track One Journey
            </h1>
            <p className='text-xl animate-fade-in-up'>
              Reflections on Full-Stack Development
            </p>
          </header>

          <main className='p-8'>
            <section className='mb-12 animate-fade-in'>
              <h2 className='text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-4'>
                The Experience
              </h2>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                Completing Track One of the challenge was a fun and challenging
                experience for me. During the process, I learned and improved
                many important skills in React application development.
              </p>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                Completing Track One not only gave me a deeper understanding of
                React, but also laid a solid foundation for the next challenges.
                However, there are still many areas I can improve, such as
                further optimizing the application performance and creating a
                more intuitive user experience.
              </p>
            </section>

            <section className='mb-12 animate-fade-in'>
              <h2 className='text-3xl font-semibold text-purple-600 dark:text-purple-400 mb-4'>
                What I've Learned
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-blue-50 dark:bg-blue-900 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105'>
                  <h3 className='text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-3 flex items-center'>
                    <FaReact className='mr-2' /> Front-End
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    Had a lot of difficulty getting used to react-router but
                    through that also learned a lot of new and interesting
                    things. Thank you mentor Nguyen Minh Tri for being so
                    enthusiastic in supporting me to complete track-one.
                  </p>
                </div>
                <div className='bg-purple-50 dark:bg-purple-900 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105'>
                  <h3 className='text-2xl font-semibold text-purple-600 dark:text-purple-300 mb-3 flex items-center'>
                    <FaNodeJs className='mr-2' /> Back-End
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300'>
                    Use Prisma ORM to work with database, build product
                    management api and gained insights into server-side
                    architecture.
                  </p>
                </div>
              </div>
            </section>

            <section className='animate-fade-in'>
              <h2 className='text-3xl font-semibold text-green-600 dark:text-green-400 mb-4'>
                The Tech Stack
              </h2>
              <div className='flex justify-center space-x-8'>
                <TechIcon Icon={FaReact} name='React' />
                <TechIcon Icon={SiExpress} name='Express.js' />
                <TechIcon Icon={FaNodeJs} name='Node.js' />
                <TechIcon Icon={FaDatabase} name='Database' />
                <TechIcon Icon={SiTailwindcss} name='Tailwind CSS' />
              </div>
            </section>
          </main>

          <footer className='bg-gray-100 dark:bg-gray-700 p-8 text-center'>
            <p className='text-gray-600 dark:text-gray-400'>
              Excited to continue this journey and build amazing things!
            </p>
          </footer>
        </div>
      </div>

      <Footer />
    </div>
  );
}

interface TechIconProps {
  Icon: React.ElementType;
  name: string;
}

const TechIcon: React.FC<TechIconProps> = ({ Icon, name }) => (
  <div className='flex flex-col items-center transition-all duration-300 hover:scale-110'>
    <Icon className='text-4xl text-gray-700 dark:text-gray-300 mb-2' />
    <span className='text-sm text-gray-600 dark:text-gray-400'>{name}</span>
  </div>
);
