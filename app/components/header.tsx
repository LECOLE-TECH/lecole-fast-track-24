import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoginModal from "./modal/loginModal";
import { login, logout } from "~/apis/authApi";
import { useUser } from "~/contexts/userContext";

const pages = [
  { name: "Home", path: "/track-two" },
  { name: "About Me", path: "/track-two/about" },
];

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  secret_phrase: Yup.string().required("Secret phrase is required"),
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("/track-two");
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { user, setUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveSection(currentPath);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Determine active section
      const sections = pages.map((page) => page.path);
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      secret_phrase: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await login(values);
        setUser({
          user_id: response?.user_id as string,
          username: response?.username as string,
          roles: response?.roles as string,
          ord: "",
          secret_phrase: "",
        });
        setIsModalOpen(false);
        resetForm();
      } catch (error) {
        setLoginError(
          error instanceof Error
            ? error.message
            : "An error occurred during login"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Log out failed: ", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
    setLoginError(null);
  };

  return (
    <div>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-blue-50 shadow-md" : "bg-transparent"
        }`}
      >
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center py-4'>
            <Link
              to={"/track-two"}
              className='text-2xl font-bold text-blue-600 hover:text-yellow-400 transition-colors duration-300 flex items-center'
            >
              <motion.svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 mr-2 text-yellow-400'
                viewBox='0 0 20 20'
                fill='currentColor'
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  fillRule='evenodd'
                  d='M4.782 4.782a1 1 0 0 1 1.414 0l2.804 2.804 2.804-2.804a1 1 0 0 1 1.414 1.414L10.414 9l2.804 2.804a1 1 0 0 1-1.414 1.414L9 10.414l-2.804 2.804a1 1 0 0 1-1.414-1.414L7.586 9 4.782 6.196a1 1 0 0 1 0-1.414z'
                  clipRule='evenodd'
                />
              </motion.svg>
              LIST OF EMPLOYEES
            </Link>

            {/* Desktop Navigation */}
            <nav className='hidden md:flex space-x-4 flex-grow justify-center'>
              {pages.map((page) => (
                <motion.div
                  key={page.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={page.path}
                    className={`text-blue-600 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      activeSection === page.path
                        ? "bg-blue-100 text-yellow-500"
                        : ""
                    }`}
                  >
                    {page.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Login Button or User dropdown */}
            {user ? (
              <div className='relative'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='hidden md:flex items-center bg-yellow-400 text-blue-800 px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 shadow-md'
                  onClick={toggleDropdown}
                >
                  {user.username}
                  <svg
                    className='w-4 h-4 ml-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 9l-7 7-7-7'
                    ></path>
                  </svg>
                </motion.button>
                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1'>
                    <button
                      onClick={handleLogout}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='hidden md:block bg-yellow-400 text-blue-800 px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 shadow-md'
                onClick={() => setIsModalOpen(true)}
              >
                Login
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <motion.button
                onClick={toggleMenu}
                className='text-blue-600 hover:text-yellow-400 focus:outline-none focus:text-yellow-400 transition-colors duration-300'
                aria-label='toggle menu'
                whileTap={{ scale: 0.95 }}
              >
                {!isMenuOpen ? (
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                ) : (
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='md:hidden'
            >
              <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                {pages.map((page) => (
                  <Link
                    key={page.name}
                    to={page.path}
                    onClick={toggleMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                      activeSection === page.path
                        ? "bg-blue-100 text-yellow-500"
                        : "text-blue-600 hover:bg-blue-50 hover:text-yellow-400"
                    }`}
                  >
                    {page.name}
                  </Link>
                ))}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className='w-full mt-2 bg-yellow-400 text-blue-800 px-3 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 shadow-md text-left'
                  >
                    Logout ({user.username})
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='w-full mt-2 bg-yellow-400 text-blue-800 px-3 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 shadow-md'
                    onClick={() => setIsModalOpen(true)}
                  >
                    Login
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formik={formik}
      />
      {loginError && <div className='text-red-500 mt-2'>{loginError}</div>}
    </div>
  );
}
