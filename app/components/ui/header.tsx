import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const pages = [
  { name: "Home", path: "home" },
  { name: "Special", path: "special" },
  { name: "News", path: "news" },
  { name: "About", path: "about" },
  { name: "Contact", path: "contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
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
  }, [scrolled]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-10 w-10 mr-2 text-green-500 transition-transform duration-300 transform hover:rotate-180'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M4.782 4.782a1 1 0 0 1 1.414 0l2.804 2.804 2.804-2.804a1 1 0 0 1 1.414 1.414L10.414 9l2.804 2.804a1 1 0 0 1-1.414 1.414L9 10.414l-2.804 2.804a1 1 0 0 1-1.414-1.414L7.586 9 4.782 6.196a1 1 0 0 1 0-1.414z'
                clipRule='evenodd'
              />
            </svg>
            <Link
              to={"#"}
              onClick={() => scrollToSection("home")}
              className='text-2xl font-bold text-gray-800 hover:text-green-500 transition-colors duration-300'
            >
              PRODUCT MANAGEMENT
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-4'>
            {pages.map((page) => (
              <Link
                key={page.name}
                to={`#${page.path}`}
                onClick={() => scrollToSection(page.path)}
                className={`text-gray-600 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  activeSection === page.path
                    ? "bg-green-100 text-green-600"
                    : ""
                }`}
              >
                {page.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-gray-500 hover:text-green-500 focus:outline-none focus:text-green-500 transition-colors duration-300'
              aria-label='toggle menu'
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
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              {pages.map((page) => (
                <Link
                  key={page.name}
                  to={`#${page.path}`}
                  onClick={() => scrollToSection(page.path)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    activeSection === page.path
                      ? "bg-green-100 text-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-500"
                  }`}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
