"use client";

import { FC } from "react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p>
            &copy; {currentYear} Qburst Birthday System. All rights reserved.
          </p>
          <nav className="space-x-4">
            <a href="#privacy" className="hover:text-gray-300">
              Privacy
            </a>
            <a href="#terms" className="hover:text-gray-300">
              Terms
            </a>
            <a href="#contact" className="hover:text-gray-300">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
