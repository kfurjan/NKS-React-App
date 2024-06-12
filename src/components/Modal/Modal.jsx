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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>{customerName} - Account Details</h1>
        <AccountDetailsTable items={itemsToShow} onRowClick={handleRowClick} />
        <Pagination
          currentPage={currentPage}
          maxPages={maxPages}
          onPageClick={handlePageClick}
        />
        <button className="round-button close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const AccountDetailsTable = ({ items, onRowClick }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Bill Number</th>
        <th>Date</th>
        <th>Credit Card</th>
        <th>Card Number</th>
        <th>Expiration</th>
      </tr>
    </thead>
    <tbody>
      {items.map((detail, index) => (
        <tr
          key={index}
          className="table-row"
          onClick={() => onRowClick(detail.id)}
        >
          <td>{detail.id}</td>
          <td>{detail.billNumber}</td>
          <td>{detail.date}</td>
          <td>{detail.creditCardType}</td>
          <td>{detail.cardNumber}</td>
          <td>{detail.expiration}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Pagination = ({ currentPage, maxPages, onPageClick }) => (
  <div className="pagination-container">
    {Array.from({ length: maxPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageClick(page)}
        className={`round-button pagination-button ${
          currentPage === page ? "active" : ""
        }`}
      >
        {page}
      </button>
    ))}
  </div>
);

export default Modal;
