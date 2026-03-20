import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function CreateCommunityModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "" });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Replace Dialog.Overlay with a simple div for the backdrop */}
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <Dialog.Panel className="relative bg-white dark:bg-black rounded-3xl p-6 w-full max-w-md shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-6 text-black dark:text-white">
            Create New Community
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Community Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 text-black dark:text-white bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 focus:outline-none transition-colors"
                placeholder="Enter community name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 text-black dark:text-white bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 focus:outline-none transition-colors"
                placeholder="What's this community about?"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
                Create
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
