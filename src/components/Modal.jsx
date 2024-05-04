import React, { useState } from "react";

const Modal = ({ isOpen, onClose, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  // Ensure data.accountDetails is being accessed correctly and is an array
  if (!data.accountDetails || !Array.isArray(data.accountDetails)) {
    console.error("Invalid or missing accountDetails");
    return null; // or handle this case appropriately
  }

  const { accountDetails, customerName } = data;

  // Calculate number of pages
  const maxPages = Math.ceil(accountDetails.length / itemsPerPage);

  // Calculate the slice of data to show
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = accountDetails.slice(startIndex, endIndex);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          width: "80%",
          maxHeight: "90%",
          overflowY: "auto",
        }}
      >
        <h1>{customerName} - Account Details</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Id</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Bill Number
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Credit Card
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Card Number
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Expiration
              </th>
            </tr>
          </thead>
          <tbody>
            {itemsToShow.map((detail, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {detail.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {detail.billNumber}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {detail.date}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {detail.creditCardType}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {detail.cardNumber}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {detail.expiration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === maxPages}
          >
            Next
          </button>
        </div>
        <button onClick={onClose} style={{ marginTop: "10px" }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
