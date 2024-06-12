import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Container } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "./CustomersTable.css";
import Modal from "../Modal/Modal";
import { BASE_URL } from "../../utils/constants";

const CustomersTable = ({ isAuthenticated }) => {
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    const fetchData = async () => {
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
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize, sortField, sortOrder]);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        (customer.name &&
          customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (customer.surname &&
          customer.surname.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
    if (!isAuthenticated) return;

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

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) return <p>Loading customers...</p>;

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
          <Button
            className={pageSize === 10 ? "selected-page-size" : ""}
            onClick={() => handlePageSizeChange(10)}
            variant="outline-primary"
          >
            10
          </Button>
          <Button
            className={pageSize === 20 ? "selected-page-size" : ""}
            onClick={() => handlePageSizeChange(20)}
            variant="outline-primary"
          >
            20
          </Button>
          <Button
            className={pageSize === 50 ? "selected-page-size" : ""}
            onClick={() => handlePageSizeChange(50)}
            variant="outline-primary"
          >
            50
          </Button>
        </div>
      </div>
      <Table striped bordered hover className="customers-table">
        <thead>
          <tr>
            <th
              onClick={() => {
                setSortField("id");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              ID {renderSortIcon("id")}
            </th>
            <th
              onClick={() => {
                setSortField("name");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Name {renderSortIcon("name")}
            </th>
            <th
              onClick={() => {
                setSortField("surname");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Surname {renderSortIcon("surname")}
            </th>
            <th
              onClick={() => {
                setSortField("email");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Email {renderSortIcon("email")}
            </th>
            <th
              onClick={() => {
                setSortField("telephone");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Telephone {renderSortIcon("telephone")}
            </th>
            <th
              onClick={() => {
                setSortField("city");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              City {renderSortIcon("city")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr
              key={customer.id}
              onClick={(e) => handleItemClick(e, customer)}
              className={isAuthenticated ? "clickable" : ""}
            >
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.surname}</td>
              <td style={{ color: isAuthenticated ? "blue" : "inherit" }}>
                {customer.email}
              </td>
              <td>{customer.telephone}</td>
              <td>{cities[customer.cityId]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="pagination">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline-primary"
        >
          Prev
        </Button>
        {[...Array(Math.min(totalPages, 10)).keys()].map((index) => {
          const startPage = Math.max(1, currentPage - 5);
          const pageNumber = startPage + index;
          return (
            <Button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={currentPage === pageNumber ? "current-page" : ""}
              variant={
                currentPage === pageNumber ? "primary" : "outline-primary"
              }
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline-primary"
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default CustomersTable;
