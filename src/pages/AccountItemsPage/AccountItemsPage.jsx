import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Alert,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AccountItemsPage.css";
import { BASE_URL } from "../../utils/constants";

const AccountItemsPage = () => {
  const { id } = useParams();
  const [customerDetails, setCustomerDetails] = useState({});
  const [accountItems, setAccountItems] = useState([]);
  const [productList, setProductList] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [filteredSubCategoryList, setFilteredSubCategoryList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isAddItemFormVisible, setIsAddItemFormVisible] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const fetchData = async () => {
      try {
        const billResponse = await axios.get(
          `${BASE_URL}/Bill/${id}`,
          config
        );
        const customerResponse = await axios.get(
          `${BASE_URL}/Customer/${billResponse.data.customerId}`,
          config
        );
        const itemsResponse = await axios.get(
          `${BASE_URL}/Item?billId=${id}`,
          config
        );
        const categoriesResponse = await axios.get(
          `${BASE_URL}/Category`,
          config
        );
        const subCategoriesResponse = await axios.get(
          `${BASE_URL}/SubCategory`,
          config
        );
        const productsResponse = await axios.get(`${BASE_URL}/Product`, config);

        const productsById = productsResponse.data.reduce(
          (acc, product) => ({
            ...acc,
            [product.id]: product,
          }),
          {}
        );

        setCustomerDetails(customerResponse.data);
        setAccountItems(itemsResponse.data);
        setProductList(productsById);
        setCategoryList(categoriesResponse.data);
        setSubCategoryList(subCategoriesResponse.data);

        if (categoriesResponse.data.length > 0) {
          const defaultCategoryId = categoriesResponse.data[0].id.toString();
          setSelectedCategoryId(defaultCategoryId);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const relatedSubCategories = subCategoryList.filter(
      (subCategory) => subCategory.categoryId.toString() === selectedCategoryId
    );
    setFilteredSubCategoryList(relatedSubCategories);
    if (relatedSubCategories.length > 0) {
      setSelectedSubCategoryId(relatedSubCategories[0].id.toString());
    }
  }, [selectedCategoryId, subCategoryList]);

  useEffect(() => {
    if (selectedSubCategoryId) {
      const filteredProducts = Object.values(productList).filter(
        (product) =>
          product.subCategoryId.toString() === selectedSubCategoryId.toString()
      );
      if (filteredProducts.length > 0) {
        setSelectedProductId(filteredProducts[0].id.toString());
      } else {
        setSelectedProductId("");
      }
    }
  }, [selectedSubCategoryId, productList]);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategoryId(e.target.value);
  };

  const handleProductChange = (e) => {
    setSelectedProductId(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setSelectedQuantity(parseInt(e.target.value));
  };

  const handleAddItem = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const newItem = {
      billId: id,
      productId: selectedProductId,
      quantity: selectedQuantity,
      totalPrice:
        productList[selectedProductId].price * parseInt(selectedQuantity, 10),
    };

    try {
      const response = await axios.post(`${BASE_URL}/Item`, newItem, config);
      setAccountItems((prevItems) => [...prevItems, response.data]);
      setNotificationMessage(
        `Item '${productList[selectedProductId]?.name}' added successfully`
      );
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to add item:", error);
      setNotificationMessage(`Failed to add item`);
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 3000);
    }
  };

  const currentBillItems = accountItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(accountItems.length / itemsPerPage);

  const handleDeleteItem = async (itemId) => {
    const itemToDelete = accountItems.find((item) => item.id === itemId);
    if (!itemToDelete) {
      console.error("Item not found");
      return;
    }
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`${BASE_URL}/Item/${itemId}`, config);
      const updatedBillItems = accountItems.filter((item) => item.id !== itemId);
      setAccountItems(updatedBillItems);
      setNotificationMessage(
        `Item '${
          productList[itemToDelete.productId]?.name
        }' deleted successfully`
      );
      setIsNotificationVisible(true);

      if (
        updatedBillItems.length <= (currentPage - 1) * itemsPerPage &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }

      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to delete item:", error);
      setNotificationMessage(`Failed to delete '${itemToDelete.name}'`);
      setIsNotificationVisible(true);
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 3000);
    }
  };

  const selectedProductDetails = productList[selectedProductId] || {};

  return (
    <Container>
      <Row
        style={{ marginTop: "15px" }}
        className="justify-content-between align-items-center mb-3"
      >
        <Col md={8}>
          <h2 className="account-title">Account Items</h2>
          <h3 className="customer-name">
            {customerDetails.name} {customerDetails.surname}
          </h3>
        </Col>
        <Col md={4}>
          <div className="text-right">
            <p>
              <strong>Customer ID:</strong> {customerDetails.id}
            </p>
            <p>
              <strong>Bill ID:</strong> {id}
            </p>
            <p>
              <strong>Telephone:</strong> {customerDetails.telephone}
            </p>
            <p>
              <strong>Email:</strong> {customerDetails.email}
            </p>
            <Button
              onClick={() => setIsAddItemFormVisible(!isAddItemFormVisible)}
              variant="primary"
            >
              {isAddItemFormVisible ? "Hide" : "Add"} Items to Account
            </Button>
          </div>
        </Col>
      </Row>
      {isAddItemFormVisible && (
        <Row>
          <Col md={12}>
            <Form
              className={`p-3 form-animation ${
                isAddItemFormVisible ? "form-visible" : "form-hidden"
              }`}
              style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
            >
              <Row>
                <Col md={6}>
                  <Form.Group controlId="categorySelect">
                    <Form.Label>
                      <strong>Category</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedCategoryId}
                      onChange={handleCategoryChange}
                    >
                      {categoryList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="subcategorySelect">
                    <Form.Label>
                      <strong>Subcategory</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedSubCategoryId}
                      onChange={handleSubCategoryChange}
                    >
                      {filteredSubCategoryList.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="productSelect">
                    <Form.Label>
                      <strong>Product</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedProductId}
                      onChange={handleProductChange}
                    >
                      {Object.values(productList)
                        .filter(
                          (product) =>
                            product.subCategoryId.toString() ===
                            selectedSubCategoryId.toString()
                        )
                        .map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="quantitySelect">
                    <Form.Label>
                      <strong>Quantity</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedQuantity}
                      onChange={handleQuantityChange}
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="d-flex justify-content-between text-center">
                <Col xs={12} sm={6} md={3} className="text-start mb-2 mb-md-0">
                  <p>
                    <strong>Id:</strong> {selectedProductDetails.id}
                  </p>
                </Col>
                <Col xs={12} sm={6} md={3} className="text-center mb-2 mb-md-0">
                  <p>
                    <strong>Name:</strong> {selectedProductDetails.name}
                  </p>
                </Col>
                <Col xs={12} sm={6} md={3} className="text-center mb-2 mb-md-0">
                  <p>
                    <strong>Color:</strong> {selectedProductDetails.color}
                  </p>
                </Col>
                <Col xs={12} sm={6} md={3} className="text-end">
                  <p>
                    <strong>ProductNumber:</strong>{" "}
                    {selectedProductDetails.productNumber}
                  </p>
                </Col>
              </Row>
              <Button variant="success" onClick={handleAddItem}>
                Add Item
              </Button>
            </Form>
          </Col>
        </Row>
      )}
      {isNotificationVisible && (
        <Alert
          variant="success"
          className={`notification-alert ${
            isNotificationVisible ? "show" : ""
          }`}
        >
          {notificationMessage}
        </Alert>
      )}
      <Row>
        <Col md={12}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Number</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Price per piece</th>
                <th>Total price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBillItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{productList[item.productId]?.name}</td>
                  <td>{productList[item.productId]?.productNumber}</td>
                  <td>{productList[item.productId]?.color}</td>
                  <td>{item.quantity}</td>
                  <td>${productList[item.productId]?.price?.toFixed(2)}</td>
                  <td>${item.totalPrice.toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>
              {[...Array(totalPages).keys()].map((page) => (
                <Button
                  key={page}
                  variant={
                    currentPage === page + 1 ? "primary" : "outline-primary"
                  }
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </Button>
              ))}
            </div>
            <strong>
              Total of {accountItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
              items: $
              {accountItems
                .reduce((sum, item) => sum + item.totalPrice, 0)
                .toFixed(2)}
            </strong>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountItemsPage;
