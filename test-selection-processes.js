// Test script for Selection Processes API
// This script demonstrates how to use the selection processes endpoints

const BASE_URL = "http://localhost:2711/api/v1";

// Example: Create a new selection process (requires committee member authentication)
const createSelectionProcess = async (token) => {
  const selectionProcessData = {
    name: "Processo Seletivo PPGTI 2024/1",
    program: "Mestrado",
    year: "2024",
    semester: "1",
    edital_link: "https://example.com/edital-2024-1.pdf",
    start_date: "2024-01-15",
    end_date: "2024-02-15",
  };

  try {
    const response = await fetch(`${BASE_URL}/selection-processes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectionProcessData),
    });

    const result = await response.json();
    console.log("Create Selection Process Response:", result);
    return result;
  } catch (error) {
    console.error("Error creating selection process:", error);
  }
};

// Example: Get all selection processes (public endpoint)
const getSelectionProcesses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/selection-processes`);
    const result = await response.json();
    console.log("Get Selection Processes Response:", result);
    return result;
  } catch (error) {
    console.error("Error getting selection processes:", error);
  }
};

// Example: Get a specific selection process by ID (public endpoint)
const getSelectionProcessById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/selection-processes/${id}`);
    const result = await response.json();
    console.log(`Get Selection Process ${id} Response:`, result);
    return result;
  } catch (error) {
    console.error(`Error getting selection process ${id}:`, error);
  }
};

// Example: Update a selection process (requires committee member authentication)
const updateSelectionProcess = async (id, token, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/selection-processes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();
    console.log(`Update Selection Process ${id} Response:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating selection process ${id}:`, error);
  }
};

// Example: Delete a selection process (requires committee member authentication)
const deleteSelectionProcess = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/selection-processes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log(`Delete Selection Process ${id} Response:`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting selection process ${id}:`, error);
  }
};

// Example usage:
// 1. First, authenticate as a committee member to get a token
// 2. Use the token to create, update, or delete selection processes
// 3. Public endpoints (get all, get by id) don't require authentication

console.log(`
Selection Processes API Test Script
==================================

Available functions:
- createSelectionProcess(token)
- getSelectionProcesses()
- getSelectionProcessById(id)
- updateSelectionProcess(id, token, updateData)
- deleteSelectionProcess(id, token)

To use this script:
1. Start your server: npm run dev
2. Authenticate as a committee member to get a token
3. Call the functions with appropriate parameters

Example:
const token = "your-committee-member-jwt-token";
await createSelectionProcess(token);
await getSelectionProcesses();
`);

// Export functions for use in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createSelectionProcess,
    getSelectionProcesses,
    getSelectionProcessById,
    updateSelectionProcess,
    deleteSelectionProcess,
  };
}
