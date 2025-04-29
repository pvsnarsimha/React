import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight">JEE Mains Quiz Portal</h1>
        <div className="text-sm font-medium">
          <span className="bg-blue-800 px-3 py-1 rounded-full">Live Exam Mode</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;