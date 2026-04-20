'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Home", href: "/" },
  { name: "Front End", href: "/FE" },
  { name: "Back End", href: "/BE" },
  { name: "DevOps", href: "/DO" },
  { type: "divider" },
  { 
    name: "Projects", 
    href: "#",
    subLinks: [
      { name: "Coalesce Engine", href: "/projects/coalesce-engine" }
    ]
  },
  { type: "divider" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    if (links.find(l => l.name === name)?.href === "#") {
      e.preventDefault();
      setOpenDropdowns(prev => ({
        ...prev,
        [name]: !prev[name]
      }));
    }
  };

  return (
    <ul>
      {links.map((link, index) => {
        if (link.type === "divider") {
          return <li key={`divider-${index}`} className="nav-divider" />;
        }

        const isActive = pathname === link.href;
        const hasSubLinks = link.subLinks && link.subLinks.length > 0;
        const isStickyOpen = openDropdowns[link.name!];
        
        return (
          <li 
            key={link.href} 
            className={`dropdown ${hasSubLinks ? "has-sublinks" : ""} ${isStickyOpen ? "sticky-open" : ""}`}
          >
            <Link 
              href={link.href!} 
              className={`NavItem ${isActive ? 'active-link' : ''}`}
              onClick={(e) => hasSubLinks && toggleDropdown(link.name!, e)}
            >
              {link.name}
              {hasSubLinks && <span className="dropdown-arrow">▼</span>}
            </Link>
            {hasSubLinks && (
              <ul className="dropdown-content">
                {link.subLinks.map((subLink) => (
                  <li key={subLink.href}>
                    <Link href={subLink.href} className="NavItem sub-item">
                      • {subLink.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}