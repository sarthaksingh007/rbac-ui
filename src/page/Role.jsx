import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // State to track whether we're adding or editing a role
  const [currentRole, setCurrentRole] = useState({
    name: "",
    permissions: [],
  });

  // Fetch roles data from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles. Please try again later.");
      }
    };
    fetchRoles();
  }, []);

  // Open dialog for adding or editing
  const handleOpenDialog = (role = null) => {
    if (role) {
      setCurrentRole(role);
      setIsAdding(false); // Editing a role
    } else {
      setCurrentRole({ name: "", permissions: [] });
      setIsAdding(true); // Adding a new role
    }
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setCurrentRole({ name: "", permissions: [] });
  };

  // Add a new role
  const handleAddRole = async () => {
    if (!currentRole.name || !currentRole.permissions.length) {
      toast.error("Role name and permissions are required.");
      return;
    }

    try {
      const response = await api.post("/roles", currentRole);
      setRoles((prevRoles) => [...prevRoles, response.data]);
      toast.success("Role added successfully.");
      handleClose();
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Failed to add role. Please try again.");
    }
  };

  // Update an existing role
  const handleUpdateRole = async () => {
    if (!currentRole.name || !currentRole.permissions.length) {
      toast.error("Role name and permissions are required.");
      return;
    }

    try {
      await api.put(`/roles/${currentRole.id}`, currentRole);
      setRoles(
        roles.map((role) =>
          role.id === currentRole.id ? { ...role, ...currentRole } : role
        )
      );
      toast.success("Role updated successfully.");
      handleClose();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role. Please try again.");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRole({
      ...currentRole,
      [name]: value,
    });
  };

  const deleteRole = async (id) => {
    try {
      await api.delete(`/roles/${id}`);
      setRoles(roles.filter((role) => role.id !== id));
      toast.success("Role deleted successfully.");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-[#DFF2EB] h-[100vh]">
      <ToastContainer />
      <motion.h1
        className="text-2xl font-bold mb-6"
        style={{ color: "#4A628A", fontFamily: "Poppins, sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Role Management
      </motion.h1>
      <motion.button
        className="bg-[#7AB2D3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4A628A] transition-colors duration-300 mb-6 w-full md:w-auto"
        onClick={() => handleOpenDialog()} // Open the dialog for adding a new role
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Role
      </motion.button>

      {/* Role Table */}
      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <table className="w-full bg-white rounded-lg shadow-lg text-left text-sm md:text-base">
          <thead className="bg-[#4A628A] text-white">
            <tr>
              <th className="py-3 px-4">Role Name</th>
              <th className="py-3 px-4">Permissions</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <motion.tr
                key={role.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-[#B9E5E8]" : "bg-[#DFF2EB]"
                }`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="py-4 px-4">{role.name}</td>
                <td className="py-4 px-4">{role.permissions.join(", ")}</td>
                <td className="py-4 px-4 flex flex-col md:flex-row md:space-x-2">
                  <motion.button
                    className="bg-[#7AB2D3] text-white px-4 py-2 rounded-lg hover:bg-[#4A628A] transition mb-2 md:mb-0"
                    onClick={() => handleOpenDialog(role)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => deleteRole(role.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Add/Edit Role Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          style={{ color: "#4A628A", fontFamily: "Poppins, sans-serif" }}
        >
          {isAdding ? "Add Role" : "Edit Role"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            name="name"
            value={currentRole.name}
            onChange={handleInputChange}
            margin="normal"
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
            label="Permissions"
            fullWidth
            name="permissions"
            value={currentRole.permissions.join(", ")}
            onChange={(e) =>
              setCurrentRole({
                ...currentRole,
                permissions: e.target.value
                  .split(",")
                  .map((perm) => perm.trim()),
              })
            }
            margin="normal"
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
        </DialogContent>
        <DialogActions>
          <motion.button
            onClick={handleClose}
            className="px-4 py-2 rounded-md transition-all duration-300"
            style={{
              backgroundColor: "#B9E5E8",
              color: "#4A628A",
              fontFamily: "Poppins, sans-serif",
            }}
            whileHover={{ scale: 1.05 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={isAdding ? handleAddRole : handleUpdateRole}
            className="px-4 py-2 rounded-md transition-all duration-300"
            style={{
              backgroundColor: "#4A628A",
              color: "#DFF2EB",
              fontFamily: "Poppins, sans-serif",
            }}
            whileHover={{ scale: 1.05 }}
          >
            {isAdding ? "Add" : "Save"}
          </motion.button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Roles;
