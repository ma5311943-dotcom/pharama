"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Pill,
  PhoneCall,
  Heart,
  LayoutDashboard
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Store', href: '/store' },
  { name: 'Search Drugs', href: '/search' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = isAdminPath || user?.role === 'admin';
  const { totalQuantity } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    setMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "glass-nav py-1 shadow-soft"
          : "bg-bg-card py-2.5 border-b border-border-nav"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          <div className="flex-shrink-0 flex items-center gap-2 relative z-[60]">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 cursor-pointer">
                <Pill className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-text-heading cursor-pointer">
                Pharma<span className="text-primary">Ease</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-primary cursor-pointer",
                  pathname === link.href
                    ? "text-primary font-bold"
                    : "text-text-body"
                )}
              >
                {link.name}
              </Link>
            ))}
            {mounted && user && (
              <Link
                href={user.role === 'admin' ? '/admin/orders' : '/profile/orders'}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-primary cursor-pointer",
                  pathname === (user.role === 'admin' ? '/admin/orders' : '/profile/orders')
                    ? "text-primary font-bold"
                    : "text-text-body"
                )}
              >
                {user.role === 'admin' ? 'Placed Orders' : 'My Orders'}
              </Link>
            )}
          </div>

          {}
          <div className="hidden md:flex items-center space-x-5">
            {mounted && !isAdmin && (
              <Link href="/cart" className="p-2 text-text-muted hover:text-primary transition-colors hover:bg-primary/5 rounded-full relative cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
                {totalQuantity > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}

            {mounted && (
              user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-border-nav">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="hidden lg:flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-primary-hover transition-all shadow-sm active:scale-95"
                    >
                      Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                  </Link>

                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-text-muted truncate max-w-[80px]">
                      {user.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleLogout}
                        className="text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer text-left uppercase tracking-normal"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-2">
                  <Link
                    href="/login"
                    className="text-sm font-bold text-text-body hover:text-primary transition-colors cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-5 py-2.5 rounded-button font-bold text-sm hover:bg-primary-hover transition-all shadow-soft hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>

          <div className="md:hidden flex items-center gap-1 sm:gap-2 relative z-[100]">
            {mounted && user?.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-primary text-white p-2 rounded-lg shadow-sm active:scale-95 transition-all"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            {mounted && !isAdmin && (
              <Link href="/cart" className="p-2 text-text-muted hover:text-primary transition-colors rounded-full relative cursor-pointer">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalQuantity > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}
            <div className="w-10 h-10 flex items-center justify-center relative z-[110]">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full text-text-heading hover:bg-primary/5 rounded-lg transition-colors cursor-pointer relative"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden cursor-pointer"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-bg-card shadow-2xl z-50 md:hidden p-6 flex flex-col pt-20"
              data-lenis-prevent
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-base font-bold p-3 rounded-xl transition-all cursor-pointer",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-text-body hover:bg-bg-page"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                {mounted && user && (
                  <Link
                    href={user.role === 'admin' ? '/admin/orders' : '/profile/orders'}
                    className={cn(
                      "text-base font-bold p-3 rounded-xl transition-all cursor-pointer",
                      pathname === (user.role === 'admin' ? '/admin/orders' : '/profile/orders')
                        ? "bg-primary/10 text-primary"
                        : "text-text-body hover:bg-bg-page"
                    )}
                  >
                    {user.role === 'admin' ? 'Placed Orders' : 'My Orders'}
                  </Link>
                )}

              </div>

              <div className="mt-auto pt-6 border-t border-border-nav flex flex-col gap-3">
                {mounted && (
                  user ? (
                    <div className="flex items-center gap-3 pl-2 border-l-2 border-primary/20">
                      <Link
                        href="/profile"
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <User className="w-5 h-5" />
                      </Link>

                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-text-heading truncate max-w-[120px]">
                          {user.name}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleLogout}
                            className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer text-left uppercase tracking-wider"
                          >
                            Logout
                          </button>

                          {user.role === 'admin' && (
                            <>
                              <span className="text-gray-300">|</span>
                              <Link href="/admin" className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                Dashboard
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 bg-bg-card border border-border-nav text-text-heading py-3.5 rounded-xl font-bold text-sm cursor-pointer"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-soft cursor-pointer"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )
                )}
                <div className="flex items-center justify-center gap-2 text-text-muted py-2">
                  <PhoneCall className="w-4 h-4 text-secondary" />
                  <span className="text-sm">+1 (234) 567-890</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
