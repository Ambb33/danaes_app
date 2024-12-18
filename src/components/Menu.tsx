// components/Menu.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for mobile menu
import { AiOutlineHome, AiOutlineHistory } from 'react-icons/ai'; // Icons for menu items

const Menu: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: <AiOutlineHome size={20} />,
    },
    {
      name: 'Results History',
      href: '/results',
      icon: <AiOutlineHistory size={20} />,
    },
    // Add more menu items here if needed
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for large screens */}
      <nav className="bg-primary-dark text-white w-full md:w-64 h-16 md:h-screen fixed md:relative z-20 top-0 left-0 flex items-center md:flex-col md:items-start md:pt-8">
        {/* Brand */}
        <div className="flex-shrink-0 px-4 md:mb-8 md:pl-6">
          <Link href="/" className="text-2xl font-bold">
            Danae's App
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:flex-col md:w-full">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-2 text-white hover:bg-primary ${
                pathname === item.href ? 'bg-primary' : ''
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden ml-auto px-4">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-primary-dark text-white">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-4 hover:bg-primary ${
                  pathname === item.href ? 'bg-primary' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="ml-0 md:ml-64 mt-16 md:mt-0 flex-1">
        {/* This is where the page content (children) will be rendered */}
      </div>
    </div>
  );
};

export default Menu;
