import Link from 'next/link';
import React from 'react';

export default function Sidebar(): JSX.Element {
  return (
    <ul className="lbh-list">
      <li>
        <Link href={`/applications/`}>My worktray</Link>
      </li>
      <li>
        <Link href={`/applications/unassigned`}>Group worktray</Link>
      </li>
      <li>
        <Link href={`/applications/view-register`}>All applications</Link>
      </li>
      <li>
        <Link href="/applications/reports">Reports</Link>
      </li>
    </ul>
  );
}
