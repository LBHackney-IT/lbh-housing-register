import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function Sidebar(): JSX.Element {
  const router = useRouter();
  const sidebarNavRoutes = [
    {
      name: 'My worktray',
      path: '/applications',
    },
    {
      name: 'Group worktray',
      path: '/applications/unassigned',
    },
    {
      name: 'All applications',
      path: '/applications/view-register',
    },
    {
      name: 'Reports',
      path: '/applications/reports',
    },
  ];

  return (
    <>
      <nav className="lbh-link-group-vertical">
        <ul>
          {sidebarNavRoutes.map(({ name, path }) => (
            <li key={path} className="lbh-link-group__item">
              <Link href={path}>
                <a
                  className={`lbh-link lbh-link--no-visited-state lbh-!-font-weight-bold lbh-body-m ${
                    router.pathname === path ? 'active' : ''
                  }`}
                >
                  {name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
