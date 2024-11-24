import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import api from "../services/api"; // Assuming api.js is configured to interact with your backend
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    // Fetch all permissions and roles from the API
    const fetchData = async () => {
      try {
        const permissionsResponse = await api.get("/permissions");
        const rolesResponse = await api.get("/roles");
        setPermissions(permissionsResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching permissions or roles:", error);
        toast.error(
          "Failed to fetch roles or permissions. Please try again later."
        );
      }
    };
    fetchData();
  }, []);

  // Open the permissions dialog to assign/modify permissions for a role
  const handleAssignPermissions = (role) => {
    setCurrentRole(role);
    setSelectedPermissions(role.permissions || []);
    setOpen(true);
  };

  // Handle permission selection
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle saving the selected permissions to a role
  const handleSavePermissions = async () => {
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }

    try {
      await api.put(`/roles/${currentRole.id}`, {
        ...currentRole,
        permissions: selectedPermissions,
      });
      setRoles(
        roles.map((role) =>
          role.id === currentRole.id
            ? { ...role, permissions: selectedPermissions }
            : role
        )
      );
      toast.success("Permissions updated successfully.");
      setOpen(false);
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions. Please try again.");
    }
  };

  // Close the permissions dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentRole(null);
    setSelectedPermissions([]);
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
        Permissions Management
      </motion.h1>

      {/* Roles and Permissions Table */}
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
              <th className="py-3 px-4">Assigned Permissions</th>
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
                <td className="py-4 px-4">
                  {role.permissions.length > 0
                    ? role.permissions.join(", ")
                    : "No permissions assigned"}
                </td>
                <td className="py-4 px-4">
                  <motion.button
                    className="bg-[#7AB2D3] text-white px-4 py-2 rounded-lg hover:bg-[#4A628A] transition"
                    onClick={() => handleAssignPermissions(role)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Modify Permissions
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Permissions Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle
          style={{
            color: "#4A628A",
            fontFamily: "Poppins, sans-serif",
            textAlign: "center",
          }}
        >
          Assign Permissions to {currentRole?.name}
        </DialogTitle>
        <DialogContent>
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {permissions.map((permission) => (
              <FormControlLabel
                key={permission.id}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(permission.name)}
                    onChange={() => handlePermissionChange(permission.name)}
                    name={permission.name}
                    style={{
                      color: "#4A628A",
                    }}
                  />
                }
                label={
                  <span style={{ fontFamily: "Poppins, sans-serif" }}>
                    {permission.name}
                  </span>
                }
              />
            ))}
          </motion.div>
        </DialogContent>
        <DialogActions>
          <motion.button
            onClick={handleCloseDialog}
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
            onClick={handleSavePermissions}
            className="px-4 py-2 rounded-md transition-all duration-300"
            style={{
              backgroundColor: "#4A628A",
              color: "#DFF2EB",
              fontFamily: "Poppins, sans-serif",
            }}
            whileHover={{ scale: 1.05 }}
          >
            Save
          </motion.button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Permissions;
