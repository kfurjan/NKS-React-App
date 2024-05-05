import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";

const Modal = ({ isOpen, onClose, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate(); 

  if (!isOpen) return null;

  if (!data.accountDetails || !Array.isArray(data.accountDetails)) {
    console.error("Invalid or missing accountDetails");
    return null;
  }

  const { accountDetails, customerName } = data;
  const maxPages = Math.ceil(accountDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = accountDetails.slice(startIndex, endIndex);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (id) => {
    navigate(`/items/${id}`);
  };

  const pagination = Array.from({ length: maxPages }, (_, i) => i + 1).map(page => (
    <button
      key={page}
      onClick={() => handlePageClick(page)}
      className="round-button"
      style={{
        padding: '5px 10px',
        margin: '0 5px',
        background: currentPage === page ? '#007bff' : '#fff',
        color: currentPage === page ? '#fff' : '#007bff',
        border: '1px solid #007bff',
        cursor: 'pointer'
      }}
    >
      {page}
    </button>
  ));

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
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '5px'
        }}
      >
        <h1>{customerName} - Account Details</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Id</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Bill Number</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Credit Card</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Card Number</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Expiration</th>
            </tr>
          </thead>
          <tbody>
            {itemsToShow.map((detail, index) => (
              <tr key={index} className="table-row" onClick={() => handleRowClick(detail.id)}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{detail.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{detail.billNumber}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{detail.date}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{detail.creditCardType}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{detail.cardNumber}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{detail.expiration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          {pagination}
        </div>
        <button className="round-button" onClick={onClose} style={{ marginTop: "10px", padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
