import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col bg-[#7AB2D3] bg-opacity-55">
      {/* Header Section */}
      <header className="flex justify-between items-center p-6 bg-[#4A628A] text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8,delay: 0.5  }}
          className="text-2xl font-bold"
        >
          RBAC System
        </motion.div>
        {/* <nav
          
        >
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-[#7AB2D3]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/roles" className="hover:text-[#7AB2D3]">
                Roles
              </Link>
            </li>
            <li>
              <Link to="/users" className="hover:text-[#7AB2D3]">
                Users
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-[#7AB2D3]">
                Settings
              </Link>
            </li>
          </ul>
        </nav> */}
      </header>

      {/* Main Content Section */}
      <main className="flex-grow flex justify-center items-center flex-col text-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[#dff0f2] p-8 rounded-lg max-w-4xl w-full shadow-lg"
        >
          <h2 className="text-4xl text-[#4A628A] font-bold mb-4">
            Welcome to the RBAC Management System
          </h2>
          <p className="text-lg text-[#4A628A] mb-8">
            Control access and manage user roles with ease.
          </p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link to="/users">
              <button className="px-6 py-3 bg-[#4A628A] text-white font-semibold rounded-lg hover:bg-[#7AB2D3] transition duration-300">
                Check User
              </button>
            </Link>
            <Link to="/roles">
              <button className="px-6 py-3 bg-[#4A628A] text-[white] font-semibold rounded-lg hover:bg-[#7AB2D3] transition duration-300">
                Check Roles
              </button>
            </Link>
            <Link to="/permissions">
              <button className="px-6 py-3 bg-[#4A628A] text-white font-semibold rounded-lg hover:bg-[#7AB2D3] transition duration-300">
                Check Permissions
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#4A628A] p-4 text-center text-white mt-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5,delay: 1 }}
        >
          © 2024 RBAC System | All rights reserved
        </motion.p>
      </footer>
    </div>
  );
};

export default HomePage;
