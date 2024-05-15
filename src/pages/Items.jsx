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
import "./Items.css";

const ItemsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const fetchData = async () => {
      try {
        const billResponse = await axios.get(
          `http://localhost:3000/Bill/${id}`,
          config
        );
        const customerResponse = await axios.get(
          `http://localhost:3000/Customer/${billResponse.data.customerId}`,
          config
        );
        const itemsResponse = await axios.get(
          `http://localhost:3000/Item?billId=${id}`,
          config
        );
        const categoriesResponse = await axios.get(
          "http://localhost:3000/Category",
          config
        );
        const subCategoriesResponse = await axios.get(
          "http://localhost:3000/SubCategory",
          config
        );
        const productsResponse = await axios.get(
          "http://localhost:3000/Product",
          config
        );

        // Reduce the products into an object keyed by their ID
        const productsById = productsResponse.data.reduce(
          (acc, product) => ({
            ...acc,
            [product.id]: product,
          }),
          {}
        );

        setCustomer(customerResponse.data);
        setItems(itemsResponse.data);
        setProducts(productsById);
        setCategories(categoriesResponse.data);
        setSubCategories(subCategoriesResponse.data);

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
    const relatedSubCategories = subCategories.filter(
      (sub) => sub.categoryId.toString() === selectedCategoryId
    );
    setFilteredSubCategories(relatedSubCategories);
    if (relatedSubCategories.length > 0) {
      setSelectedSubCategoryId(relatedSubCategories[0].id.toString());
    }
  }, [selectedCategoryId, subCategories]);

  useEffect(() => {
    if (selectedSubCategoryId) {
      const filteredProducts = Object.values(products).filter(
        (product) =>
          product.subCategoryId.toString() === selectedSubCategoryId.toString()
      );
      if (filteredProducts.length > 0) {
        setSelectedProductId(filteredProducts[0].id.toString());
      } else {
        setSelectedProductId(""); // Reset if no products match
      }
    }
  }, [selectedSubCategoryId, products]);

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategoryId(e.target.value);
  };

  const handleProductChange = (e) => {
    setSelectedProductId(e.target.value);
    console.log(e.target.value);
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
        products[selectedProductId].price * parseInt(selectedQuantity, 10),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/Item",
        newItem,
        config
      );
      setItems((prevItems) => [...prevItems, response.data]);
      setNotificationMessage(
        `Item '${products[selectedProductId]?.name}' added successfully`
      );
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to add item:", error);
      setNotificationMessage(`Failed to add item`);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleDeleteItem = async (itemId) => {
    const item = items.find((item) => item.id === itemId);
    if (!item) {
      console.error("Item not found");
      return;
    }
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`http://localhost:3000/Item/${itemId}`, config);
      const updatedItems = items.filter((item) => item.id !== itemId);
      setItems(updatedItems);
      setNotificationMessage(
        `Item '${products[item.productId]?.name}' deleted successfully`
      );
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to delete item:", error);
      setNotificationMessage(`Failed to delete '${item.name}'`);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const selectedProductDetails = products[selectedProductId] || {};

  return (
    <Container>
      <Row
        style={{ marginTop: "15px" }}
        className="justify-content-between align-items-center mb-3"
      >
        <Col md={8}>
          <h2 className="account-title">Account Items</h2>
          <h3 className="customer-name">
            {customer.name} {customer.surname}
          </h3>
        </Col>
        <Col md={4}>
          <div className="text-right">
            <p>
              <strong>Customer ID:</strong> {customer.id}
            </p>
            <p>
              <strong>Bill ID:</strong> {id}
            </p>
            <p>
              <strong>Telephone:</strong> {customer.telephone}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <Button
              onClick={() => setShowAddItem(!showAddItem)}
              variant="primary"
            >
              {showAddItem ? "Hide" : "Add"} Items to Account
            </Button>
          </div>
        </Col>
      </Row>
      {showAddItem && (
        <Row>
          <Col md={12}>
            <Form
              className={`p-3 form-animation ${
                showAddItem ? "form-visible" : "form-hidden"
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
                      {categories.map((category) => (
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
                      {filteredSubCategories.map((subcategory) => (
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
                      {Object.values(products)
                        .filter(
                          (prod) =>
                            prod.subCategoryId.toString() ===
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
      {showNotification && (
        <Alert
          variant="success"
          className={`notification-alert ${showNotification ? "show" : ""}`}
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
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{products[item.productId]?.name}</td>
                  <td>{products[item.productId]?.productNumber}</td>
                  <td>{products[item.productId]?.color}</td>
                  <td>{item.quantity}</td>
                  <td>${products[item.productId]?.price?.toFixed(2)}</td>
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
              Total of {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
              items: $
              {items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
            </strong>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemsPage;