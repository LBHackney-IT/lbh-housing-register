import Link from 'next/link';
import React from 'react';

export default function Sidebar(): JSX.Element {
  return (
    <ul className="lbh-list">
      <li>
        <Link href={`/applications?page=1&pageSize=10`}>
          <a className="lbh-link lbh-link--no-visited-state">My worktray</a>
        </Link>
      </li>
      <li>
        <Link href={`/applications/unassigned?page=1&pageSize=10`}>
          <a className="lbh-link lbh-link--no-visited-state">Group worktray</a>
        </Link>
      </li>
      <li>
        <Link href={`/applications/view-register?page=1&pageSize=10`}>
          <a className="lbh-link lbh-link--no-visited-state">
            All applications
          </a>
        </Link>
      </li>
      <li>
        <Link href="/applications/reports">
          <a className="lbh-link lbh-link--no-visited-state">Reports</a>
        </Link>
      </li>
    </ul>
  );
}
