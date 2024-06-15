import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Container } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "./CustomersTable.css";
import Modal from "../Modal/Modal";
import { BASE_URL } from "../../utils/constants";
import Spinner from "../Spinner/Spinner";

const CustomersTable = ({ isUserLoggedIn }) => {
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [dialogData, setDialogData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchCustomersData = async () => {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        _page: currentPage,
        _limit: pageSize,
        _sort: sortField,
        _order: sortOrder,
      }).toString();

      try {
        const [customersResponse, citiesResponse] = await Promise.all([
          axios.get(`${BASE_URL}/Customer?${queryParams}`),
          axios.get(`${BASE_URL}/City`),
        ]);

        setCustomers(customersResponse.data);
        setCities(
          citiesResponse.data.reduce((acc, city) => {
            acc[city.id] = city.name;
            return acc;
          }, {})
        );
        setTotalPages(
          Math.ceil(customersResponse.headers["x-total-count"] / pageSize)
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false); // Make sure to stop loading in case of error
      }
    };

    fetchCustomersData();
  }, [currentPage, pageSize, sortField, sortOrder]);

  useEffect(() => {
    const filterCustomers = () => {
      const filtered = customers.filter(
        (customer) =>
          (customer.name &&
            customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (customer.surname &&
            customer.surname
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (customer.email &&
            customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (customer.telephone &&
            customer.telephone
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (cities[customer.cityId] &&
            cities[customer.cityId]
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    };

    filterCustomers();
  }, [customers, searchQuery, cities]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleItemClick = async (event, customer) => {
    event.stopPropagation();
    if (!isUserLoggedIn) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const billsResponse = await axios.get(
        `${BASE_URL}/Bill?customerId=${customer.id}`,
        config
      );
      const bills = billsResponse.data;

      const billsWithCardDetails = await Promise.all(
        bills.map(async (bill) => {
          if (!bill.creditCardId) {
            return {
              ...bill,
              creditCardType: "No credit card",
              cardNumber: "N/A",
              expiration: "N/A",
            };
          }
          const creditCardResponse = await axios.get(
            `${BASE_URL}/CreditCard/${bill.creditCardId}`,
            config
          );
          const creditCard = creditCardResponse.data;

          return {
            ...bill,
            creditCardType: creditCard.type,
            cardNumber: creditCard.cardNumber,
            expiration: `${creditCard.expirationMonth}/${creditCard.expirationYear}`,
          };
        })
      );

      openAccountDetailsDialog(
        billsWithCardDetails,
        `${customer.name} ${customer.surname}`
      );
    } catch (error) {
      console.error("Failed to fetch account details:", error);
    }
  };

  const openAccountDetailsDialog = (accountDetails, customerName) => {
    setDialogData({ accountDetails, customerName });
    setShowDialog(true);
  };

  if (isLoading) return <Spinner />; // Show spinner while loading

  return (
    <Container className="table-container">
      <Modal
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        data={dialogData}
      />
      <h1 className="table-title">Customers</h1>
      <Form.Control
        type="text"
        className="search-bar"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="table-controls">
        <div className="page-size">
          <PageSizeButton
            size={10}
            currentPageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
          <PageSizeButton
            size={20}
            currentPageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
          <PageSizeButton
            size={50}
            currentPageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
      <Table striped bordered hover className="customers-table">
        <thead>
          <tr>
            <TableHeader
              field="id"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
              onSortChange={() => {
                setSortField("id");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            />
            <TableHeader
              field="name"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
              onSortChange={() => {
                setSortField("name");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            />
            <TableHeader
              field="surname"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
              onSortChange={() => {
                setSortField("surname");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            />
            <TableHeader
              field="email"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
              onSortChange={() => {
                setSortField("email");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            />
            <TableHeader
              field="telephone"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
              onSortChange={() => {
                setSortField("telephone");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            />
            <TableHeader
              field="city"
              currentSortField={sortField}
              currentSortOrder={sortOrder}
              onSortChange={() => {
                setSortField("city");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            />
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr
              key={customer.id}
              onClick={(e) => handleItemClick(e, customer)}
              className={isUserLoggedIn ? "clickable" : ""}
            >
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.surname}</td>
              <td style={{ color: isUserLoggedIn ? "blue" : "inherit" }}>
                {customer.email}
              </td>
              <td>{customer.telephone}</td>
              <td>{cities[customer.cityId]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

const PageSizeButton = ({ size, currentPageSize, onPageSizeChange }) => (
  <Button
    className={currentPageSize === size ? "selected-page-size" : ""}
    onClick={() => onPageSizeChange(size)}
    variant="outline-primary"
  >
    {size}
  </Button>
);

const TableHeader = ({
  field,
  currentSortField,
  currentSortOrder,
  onSortChange,
}) => (
  <th onClick={onSortChange}>
    {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
    {currentSortField === field ? (
      currentSortOrder === "asc" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      )
    ) : (
      <FaSort />
    )}
  </th>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageButtons = [];
  for (let i = 1; i <= Math.min(totalPages, 10); i++) {
    const pageNumber = i;
    pageButtons.push(
      <Button
        key={pageNumber}
        onClick={() => onPageChange(pageNumber)}
        className={currentPage === pageNumber ? "current-page" : ""}
        variant={currentPage === pageNumber ? "primary" : "outline-primary"}
      >
        {pageNumber}
      </Button>
    );
  }
  return (
    <div className="pagination">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline-primary"
      >
        Prev
      </Button>
      {pageButtons}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline-primary"
      >
        Next
      </Button>
    </div>
  );
};

export default CustomersTable;
