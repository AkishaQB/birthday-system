"use client";

import { FC } from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: FC<HeaderProps> = ({
  title = "Birthday System",
  subtitle = "Manage and celebrate birthdays",
}) => {
  return (
    <header className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-300">{subtitle}</p>}
      </div>
    </header>
  );
};

export default Header;
