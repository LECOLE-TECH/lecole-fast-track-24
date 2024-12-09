import { Link } from "react-router";
import { Button } from "./button";

export default function Header() {
  return (
    <header className='bg-background sticky top-0 z-40 w-full border-b'>
      <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <div className='flex gap-6 md:gap-10'>
          <Link to='/' className='flex items-center space-x-2'>
            <span className='inline-block font-bold'>Product Management</span>
          </Link>
          <nav className='hidden md:flex gap-6'>
            <Link
              to='#'
              className='flex items-center text-lg font-semibold text-muted-foreground sm:text-sm'
            >
              Features
            </Link>
            <Link
              to='#'
              className='flex items-center text-lg font-semibold text-muted-foreground sm:text-sm'
            >
              Pricing
            </Link>
            <Link
              to='#'
              className='flex items-center text-lg font-semibold text-muted-foreground sm:text-sm'
            >
              About
            </Link>
          </nav>
        </div>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-1'>
            <Button variant='ghost' className='text-base font-semibold'>
              Sign In
            </Button>
            <Button className='text-base font-semibold'>Get Started</Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
