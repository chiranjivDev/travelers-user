'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiPackage,
  FiMapPin,
  FiSettings,
  FiUser,
  FiMessageSquare,
  FiBell,
  FiLogOut,
  FiUserPlus,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [locale, setLocale] = useState('');

  const pathname = usePathname();
  const { user, logout, switchRole } = useAuth();

  // language settings
  const t = useTranslations('Navbar');
  // initialize router
  const router = useRouter();
  // locale
  useEffect(() => {
    const localeCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1];

    if (localeCookie) {
      setLocale(localeCookie);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `NEXT_LOCALE=${browserLocale};`;
      router.refresh();
    }
  }, [router]);

  // handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { name: t('sendPackage'), path: '/form' },
    { name: t('browsePackages'), path: '/browse-packages' },
    { name: t('browseTrips'), path: '/browse-trips' },
    { name: t('becomeTraveler'), path: '/traveler-form' },
    { name: t('howItWorks'), path: '/how-it-works' },
    { name: t('blog'), path: '/blog' },
    { name: t('chat'), path: '/chat' },

    // { name: t('safety'), path: '/safety' },
    // { name: t('support'), path: '/support' }
    // { name: 'Chat', path: '/simple-chat' },
  ];

  const userNavItems = [
    {
      name: 'Sender Dashboard',
      path: '/sender/dashboard',
      icon: FiPackage,
      role: 'sender',
    },
    {
      name: 'Traveler Dashboard',
      path: '/traveler/dashboard',
      icon: FiMapPin,
      role: 'traveler',
    },
    {
      name: 'Admin Panel',
      path: '/admin',
      icon: FiSettings,
      role: 'admin',
    },

    // No screens for the below links
    // {
    //   name: 'Profile Settings',
    //   path: '/settings',
    //   icon: FiUser,
    //   role: 'all',
    // },
    // {
    //   name: 'Messages',
    //   path: '/messages',
    //   icon: FiMessageSquare,
    //   role: 'all',
    // },
    // {
    //   name: 'Notifications',
    //   path: '/notifications',
    //   icon: FiBell,
    //   role: 'all',
    // },
  ];

  // change locale
  const changeLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/;`;
      setLocale(newLocale);
      router.refresh();
    }
  };

  return (
    <>
      <motion.header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-900/80 backdrop-blur-lg py-4'
            : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 mr-8 flex items-center space-x-2"
            >
              <motion.div
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                DeliveryConnect
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {/* filter based on the user permissions */}
              {mainNavItems
                .filter((item) => {
                  if (item.name === t('sendPackage')) {
                    return user?.permissions === 'sender';
                  }
                  if (item.name === t('becomeTraveler')) {
                    return user?.permissions === 'traveler';
                  }
                  if (item.name === t('chat')) {
                    return user; // Only show "Chat" if the user is logged in
                  }
                  return true;
                })
                .map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{user?.email}</span>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isUserMenuOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </motion.button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-700"
                    >
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm text-white font-medium">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="text-xs text-blue-400 mt-1">
                          {t('user.activeAs')} : {user.permissions}
                        </p>
                      </div>

                      {/* Stripe Account Section */}
                      {user.permissions === 'traveler' && (
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-medium text-white">
                            {/* Payment Setup */}
                            {t('user.paymentSetup')}
                          </p>
                          <button
                            className="mt-2 text-sm text-blue-500 hover:underline"
                            onClick={() => router.push('/connect-stripe')}
                          >
                            {/* Connect Stripe Account */}
                            {t('user.connectStripe')}
                          </button>
                        </div>
                      )}

                      {/* Role Switching Section */}
                      {/* {user?.roles?.length > 1 && (
                        <div className="px-4 py-2 border-b border-gray-700">
                          <p className="text-xs text-gray-400 mb-2">
                            Switch Role
                          </p>
                          {user?.roles?.map((role) => (
                            <button
                              key={role}
                              onClick={() => {
                                switchRole(role);
                                setIsUserMenuOpen(false);
                              }}
                              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md w-full text-sm ${
                                user.activeRole === role
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-700'
                              }`}
                            >
                              {role === 'sender' && (
                                <FiPackage className="w-4 h-4" />
                              )}
                              {role === 'traveler' && (
                                <FiMapPin className="w-4 h-4" />
                              )}
                              {role === 'admin' && (
                                <FiSettings className="w-4 h-4" />
                              )}
                              <span className="capitalize">{role}</span>
                            </button>
                          ))}
                        </div>
                      )} */}

                      {/* Navigation Items */}
                      {userNavItems
                        .filter(
                          (item) =>
                            item.role === 'all' || item.role === user.activeRole
                        )
                        .map((item) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </Link>
                        ))}

                      <div className="border-t border-gray-700 mt-2 pt-2">
                        <button
                          onClick={() => {
                            const dashboardPath =
                              user.permissions === 'sender'
                                ? '/sender/dashboard'
                                : '/traveler/dashboard';
                            router.push(dashboardPath);
                          }}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 w-full"
                        >
                          <FiUser className="w-5 h-5" />
                          <span>
                            {/* Dashboard */}
                            {t('user.dashboard')}
                          </span>
                        </button>
                      </div>

                      <div className="border-t border-gray-700 mt-2 pt-2">
                        <button
                          onClick={async () => {
                            await logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 w-full"
                        >
                          <FiLogOut className="w-5 h-5" />
                          <span>
                            {/* Log Out */}
                            {t('user.logout')}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {t('logIn')}
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium text-white transition-colors"
                  >
                    {t('signUp')}
                  </Link>
                </>
              )}

              {/* Change language */}
              <div className="relative inline-block">
                <select
                  className="appearance-none bg-black text-white py-2 px-4 pr-8 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer hover:bg-gray-900"
                  value={locale}
                  onChange={(e) => changeLocale(e.target.value)}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="fa">🇮🇷 فارسی</option>
                  {/* Add more languages here: German */}
                </select>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <div className="px-3 py-3 border-b border-gray-800 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {user?.email?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Navigation Items */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* User Navigation Items */}
              {user && (
                <div className="border-t border-gray-800 pt-2 mt-2">
                  {userNavItems
                    .filter(
                      (item) =>
                        item.role === 'all' || item.role === user.activeRole
                    )
                    .map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="flex items-center space-x-3 px-3 py-2 text-base text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}

                  <button
                    // onClick={() => {
                    //   // Handle logout
                    //   setIsMobileMenuOpen(false);
                    // }}
                    onClick={async () => {
                      await logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2 text-base text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md w-full mt-2"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}

              {/* Auth Buttons for Non-authenticated Users */}
              {!user && (
                <div className="border-t border-gray-800 pt-2 mt-2 space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>
      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-24" />
    </>
  );
}
