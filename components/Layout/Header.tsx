import React from 'react';
import Link from 'next/link';
import SvgIcon from '../icons/SvgIcon';

const menuItems = [
  {
    href: '/',
    title: 'Home',
    icon: <SvgIcon className="w-10 h-10" iconType="home" />,
  },
  {
    href: '/roles',
    title: 'Roles',
    icon: <SvgIcon className="w-10 h-10" iconType="newspaper" />,
  },
  {
    href: '/teams',
    title: 'Teams',
    icon: <SvgIcon className="w-10 h-10" iconType="user-group" />,
  },
];

const Header = () => {
  return (
    <header className="text-gray-600 body-font">
      <nav className="md:ml-auto flex flex-wrap items-startcenter text-base justify-center">
        <div className="flex items-center space-x-5">
          {menuItems.map(({ href, title, icon }) => (
            <div key={title}>
              <Link href={href}>
                <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                  {icon} {title}
                </a>
              </Link>
            </div>
          ))}
        </div>
        {/* {user ? (
            <div className="flex items-center space-x-5">
              <Link href="/favorites">
                <a className="inline-flex items-center border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                  My Favorites
                </a>
              </Link>
              <Link href="/api/auth/logout">
                <a className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                  Logout
                </a>
              </Link>
              <img
                alt="profile"
                className="rounded-full w-12 h-12"
                src={user.picture}
              />
            </div>
          ) : (
            <Link href="/api/auth/login">
              <a className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                Login
              </a>
            </Link>
          )} */}
      </nav>
    </header>
  );
};

export default Header;
