import React from 'react';
import { Home, Film, PlusCircle, Tv, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function MobileBottomNav() {
  const { showToast } = useApp();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Shorts', icon: Film, path: '/shorts' },
    { name: 'Create', icon: PlusCircle, isAction: true },
    { name: 'Subscriptions', icon: Tv, path: '/subscriptions' },
    { name: 'You', icon: User, path: '/library' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 safe-bottom transition-colors duration-200">
      <div className="flex items-center justify-around h-13 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.name}
                onClick={() => showToast('Creator studio & instant stream upload ready!')}
                className="flex flex-col items-center justify-center p-1 text-neutral-800 dark:text-white hover:text-red-500 transition group"
              >
                <div className="w-8 h-8 rounded-full border-2 border-neutral-400 dark:border-neutral-300 group-hover:border-red-500 flex items-center justify-center">
                  <span className="text-xl font-light -mt-0.5">+</span>
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 py-1 transition ${
                  isActive
                    ? 'text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
