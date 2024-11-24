import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableSortLabel,
} from "@mui/material";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    roles: [],
    status: "Active",
  });

  // For filtering, sorting, and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByRole, setFilterByRole] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
        toast.success("Users fetched successfully!");
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users. Please refresh the page.");
      }
    };
    fetchUsers();
  }, []);
  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setUserForm({ ...user });
  };

  // Close modals
  const handleCloseModal = () => {
    setEditingUser(null);
    setAddingUser(false);
    setUserForm({ name: "", email: "", roles: [], status: "Active" });
  };

  // Save user changes
  const handleUpdateUser = async () => {
    try {
      const response = await api.put(`/users/${userForm.id}`, userForm);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userForm.id ? response.data : user
        )
      );
      toast.success("User updated successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  // Add a new user
  const handleAddUser = async () => {
    // Basic validation
    if (
      !userForm.name.trim() ||
      !userForm.email.trim() ||
      userForm.roles.length === 0
    ) {
      toast.error(
        "Please fill in all the fields and select at least one role."
      );
      return;
    }

    try {
      const response = await api.post("/users", userForm);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      toast.success("User added successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  // Get filtered and sorted users
  const getSortedAndFilteredUsers = () => {
    let filteredUsers = users;

    // Filter by role
    if (filterByRole) {
      filteredUsers = filteredUsers.filter((user) =>
        user.roles.includes(filterByRole)
      );
    }

    // Search by name or email
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filteredUsers;
  };

  // Handle sorting toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="p-6 bg-[#DFF2EB] min-h-screen">
      <ToastContainer />
      <div className="">
        {/* Title */}
        <motion.h1
          className="text-2xl md:text-3xl font-extrabold text-[#4A628A] mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          User Management
        </motion.h1>

        {/* Search and Filter */}
        <motion.div
          className="mb-6 flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search by Name or Email"
            className="flex-1 p-3 rounded-lg border focus:ring-2 text-sm md:text-base"
            style={{
              backgroundColor: "#DFF2EB",
              borderColor: "#7AB2D3",
              color: "#4A628A",
              fontFamily: "Poppins, sans-serif",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="flex-1 p-3 rounded-lg border focus:ring-2 text-sm md:text-base"
            style={{
              backgroundColor: "#DFF2EB",
              borderColor: "#7AB2D3",
              color: "#4A628A",
              fontFamily: "Poppins, sans-serif",
            }}
            value={filterByRole}
            onChange={(e) => setFilterByRole(e.target.value)}
          >
            <option
              value=""
              style={{
                color: "#4A628A",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              All Roles
            </option>
            <option
              value="Admin"
              style={{
                color: "#4A628A",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Admin
            </option>
            <option
              value="Editor"
              style={{
                color: "#4A628A",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Editor
            </option>
            <option
              value="Viewer"
              style={{
                color: "#4A628A",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Viewer
            </option>
          </select>
        </motion.div>

        {/* Add User Button */}
        <motion.button
          className="bg-[#7AB2D3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4A628A] transition-colors duration-300 mb-6 w-full md:w-auto"
          onClick={() => setAddingUser(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add User
        </motion.button>

        {/* User Table */}
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <table className="w-full bg-white rounded-lg shadow-lg text-left text-sm md:text-base">
            <thead className="bg-[#4A628A] text-white">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Roles</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getSortedAndFilteredUsers().map((user, index) => (
                <motion.tr
                  key={user.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-[#B9E5E8]" : "bg-[#DFF2EB]"
                  }`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">
                    {Array.isArray(user.roles)
                      ? user.roles.join(", ")
                      : "No roles assigned"}
                  </td>
                  <td className="py-4 px-4">{user.status}</td>
                  <td className="py-4 px-4 flex flex-col md:flex-row md:space-x-2">
                    <button
                      className="bg-[#7AB2D3] text-white px-4 py-2 rounded-lg hover:bg-[#4A628A] transition mb-2 md:mb-0"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Modals for Editing and Adding Users */}

      {/* Edit User Modal */}
      <Modal open={Boolean(editingUser)} onClose={handleCloseModal}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A628A]/80">
          <motion.div
            className="bg-[#DFF2EB] w-[90%] md:w-[400px] rounded-lg p-6 shadow-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#4A628A] mb-4 text-center">
              Edit User
            </h2>
            <TextField
              label="Name"
              fullWidth
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              margin="normal"
              className="mb-4"
              InputLabelProps={{ style: { color: "#4A628A" } }}
              InputProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#B9E5E8",
                  borderColor: "#7AB2D3",
                  borderRadius: "4px",
                },
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              margin="normal"
              className="mb-4"
              InputLabelProps={{ style: { color: "#4A628A" } }}
              InputProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#B9E5E8",
                  borderColor: "#7AB2D3",
                  borderRadius: "4px",
                },
              }}
            />
            <FormControl fullWidth className="marginExtra">
              <InputLabel
                style={{ color: "#4A628A", fontFamily: "Poppins, sans-serif" }}
              >
                Roles
              </InputLabel>
              <Select
                multiple
                value={userForm.roles || []}
                onChange={(e) =>
                  setUserForm({ ...userForm, roles: e.target.value })
                }
                style={{
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#B9E5E8",
                  borderColor: "#7AB2D3",
                  borderRadius: "4px",
                }}
              >
                <MenuItem value="Admin" style={{ color: "#4A628A" }}>
                  Admin
                </MenuItem>
                <MenuItem value="Editor" style={{ color: "#4A628A" }}>
                  Editor
                </MenuItem>
                <MenuItem value="Viewer" style={{ color: "#4A628A" }}>
                  Viewer
                </MenuItem>
              </Select>
            </FormControl>
            <div className="marginExtra">
              <FormControl fullWidth className="">
                <InputLabel
                  style={{
                    color: "#4A628A",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  value={userForm.status}
                  onChange={(e) =>
                    setUserForm({ ...userForm, status: e.target.value })
                  }
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    backgroundColor: "#B9E5E8",
                    borderColor: "#7AB2D3",
                    borderRadius: "4px",
                  }}
                >
                  <MenuItem value="Active" style={{ color: "#4A628A" }}>
                    Active
                  </MenuItem>
                  <MenuItem value="Inactive" style={{ color: "#4A628A" }}>
                    Inactive
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <button
              className="w-full bg-[#7AB2D3] text-white py-3 rounded-md hover:bg-[#4A628A] transition-all duration-300 my-4"
              onClick={handleUpdateUser}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal open={addingUser} onClose={handleCloseModal}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            className="bg-white w-[90%] md:w-[400px] rounded-lg p-6 shadow-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{
                color: "#4A628A",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Add New User
            </h2>
            <TextField
              label="Name"
              fullWidth
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              margin="normal"
              className="mb-4"
              InputProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#DFF2EB",
                  borderColor: "#7AB2D3",
                },
              }}
              InputLabelProps={{
                style: { color: "#4A628A", fontFamily: "Poppins, sans-serif" },
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              margin="normal"
              error={!isValidEmail(userForm.email)}
              helperText={
                !isValidEmail(userForm.email) && userForm.email
                  ? "Please enter a valid email address"
                  : ""
              }
              className="mb-4"
              InputProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#DFF2EB",
                  borderColor: "#7AB2D3",
                },
              }}
              InputLabelProps={{
                style: { color: "#4A628A", fontFamily: "Poppins, sans-serif" },
              }}
            />
            <div className="my-4">
              <FormControl fullWidth className="mb-4">
                <InputLabel
                  style={{
                    color: "#4A628A",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Roles
                </InputLabel>
                <Select
                  multiple
                  value={userForm.roles || []}
                  onChange={(e) =>
                    setUserForm({ ...userForm, roles: e.target.value })
                  }
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    backgroundColor: "#B9E5E8",
                    borderColor: "#7AB2D3",
                    borderRadius: "4px",
                  }}
                >
                  <MenuItem value="Admin" style={{ color: "#4A628A" }}>
                    Admin
                  </MenuItem>
                  <MenuItem value="Editor" style={{ color: "#4A628A" }}>
                    Editor
                  </MenuItem>
                  <MenuItem value="Viewer" style={{ color: "#4A628A" }}>
                    Viewer
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <FormControl fullWidth className="mb-4">
              <InputLabel
                style={{
                  color: "#4A628A",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Status
              </InputLabel>
              <Select
                value={userForm.status}
                onChange={(e) =>
                  setUserForm({ ...userForm, status: e.target.value })
                }
                style={{
                  fontFamily: "Poppins, sans-serif",
                  backgroundColor: "#B9E5E8",
                  borderColor: "#7AB2D3",
                  borderRadius: "4px",
                }}
              >
                <MenuItem value="Active" style={{ color: "#4A628A" }}>
                  Active
                </MenuItem>
                <MenuItem value="Inactive" style={{ color: "#4A628A" }}>
                  Inactive
                </MenuItem>
              </Select>
            </FormControl>
            <button
              className="w-full py-3 mt-4 rounded-md transition-all duration-300"
              onClick={handleAddUser}
              style={{
                backgroundColor: "#4A628A",
                color: "#DFF2EB",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Add User
            </button>
          </motion.div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
