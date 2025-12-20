'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Front End", href: "/FE" },
  { name: "Back End", href: "/BE" },
  { name: "DevOps", href: "/DO" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul>
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <li key={link.href}>
            <Link 
              href={link.href} 
              className={`NavItem ${isActive ? 'active-link' : ''}`}
            >
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}