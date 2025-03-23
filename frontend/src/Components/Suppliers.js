import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";

const URL = "http://localhost:8090/suppliers";

// Fetch suppliers with error handling
const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    console.log("Fetched suppliers:", res.data); // Logging the fetched data for debugging
    return res.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

// Delete a supplier with error handling
const deleteHandler = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    console.log("Deleted supplier:", res.data); // Logging the delete response
    return res.data;
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchHandler()
      .then((data) => {
        // Check if suppliers data is present
        if (data && data.suppliers) {
          setSuppliers(data.suppliers);
        } else {
          console.error("No suppliers found in the response");
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  }, []);

  // Handle delete operation
  const handleDelete = (id) => {
    deleteHandler(id)
      .then((data) => {
        // Update state by filtering out the deleted supplier
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((supplier) => supplier._id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting supplier:", error);
      });
  };

  return (
    <div>
      <Nav />
      <h1 className="title">Suppliers Page</h1>
      <div className="table-container">
        <table className="supplier-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Items</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <tr key={index}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contactNumber}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.items}</td>
                  <td>
                    <button onClick={() => handleDelete(supplier._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suppliers;
