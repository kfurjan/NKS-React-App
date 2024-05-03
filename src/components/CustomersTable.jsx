import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomersTable.css";

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [filteredCustomers, setFilteredCustomers] = useState([]); // New state for filtered customers

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const queryParams = new URLSearchParams({
        _page: currentPage,
        _limit: pageSize,
        _sort: sortField,
        _order: sortOrder
      }).toString();

      try {
        const [customersResponse, citiesResponse] = await Promise.all([
          axios.get(`http://localhost:3000/Customer?${queryParams}`),
          axios.get(`http://localhost:3000/City`)
        ]);

        setCustomers(customersResponse.data);
        setCities(citiesResponse.data.reduce((acc, city) => {
          acc[city.id] = city.name;
          return acc;
        }, {}));
        setTotalPages(Math.ceil(customersResponse.headers["x-total-count"] / pageSize));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize, sortField, sortOrder]);

  // Update filteredCustomers when customers or searchQuery changes
  useEffect(() => {
    const filtered = customers.filter(customer =>
      (customer.name && customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.surname && customer.surname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.telephone && customer.telephone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cities[customer.cityId] && cities[customer.cityId].toLowerCase().includes(searchQuery.toLowerCase()))
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

  if (loading) return <p>Loading customers...</p>;

  return (
    <div>
      <h1>Customers</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch} // Update searchQuery on input change
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => { setSortField("id"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>ID</th>
            <th onClick={() => { setSortField("name"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>Name</th>
            <th onClick={() => { setSortField("surname"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>Surname</th>
            <th onClick={() => { setSortField("email"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>Email</th>
            <th onClick={() => { setSortField("telephone"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>Telephone</th>
            <th onClick={() => { setSortField("city"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>City</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.surname}</td>
              <td>{customer.email}</td>
              <td>{customer.telephone}</td>
              <td>{cities[customer.cityId]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        {[...Array(Math.min(totalPages, 10)).keys()].map((index) => {
          const startPage = Math.max(1, currentPage - 5);
          const pageNumber = startPage + index;
          return (
            <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={currentPage === pageNumber ? "current-page" : ""}>
              {pageNumber}
            </button>
          );
        })}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        <div>
          <button className={pageSize === 10 ? "selected-page-size" : ""} onClick={() => handlePageSizeChange(10)}>10</button>
          <button className={pageSize === 20 ? "selected-page-size" : ""} onClick={() => handlePageSizeChange(20)}>20</button>
          <button className={pageSize === 50 ? "selected-page-size" : ""} onClick={() => handlePageSizeChange(50)}>50</button>
        </div>
      </div>
    </div>
  );
};

export default CustomersTable;
