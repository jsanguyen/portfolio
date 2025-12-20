"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const ProjectDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const projects = [
    { name: "Mystical Tome", path: "/projects/bestiary" },
  ];

  return (
    <div className="project-dropdown-container">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-toggle"
        aria-expanded={isOpen}
      >
        <span style={{ fontSize: '0.8rem' }}>{isOpen ? "▼" : "▶"}</span>
        SIDE PROJECTS
      </button>

      {isOpen && (
        <ul className="dropdown-list">
          {projects.map((project) => (
            <li key={project.path} className="dropdown-item">
              <Link href={project.path}>
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectDropdown;