"use client";

import Link from "next/link";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/tasks">Tasks</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/events">Events</Link>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;
