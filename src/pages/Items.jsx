import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Items.css';

const ItemsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const fetchData = async () => {
      try {
        const billResponse = await axios.get(`http://localhost:3000/Bill/${id}`, config);
        const customerResponse = await axios.get(`http://localhost:3000/Customer/${billResponse.data.customerId}`, config);
        const itemsResponse = await axios.get(`http://localhost:3000/Item?billId=${id}`, config);

        const productIds = itemsResponse.data.map(item => item.productId);
        const productResponses = await Promise.all(productIds.map(pid =>
          axios.get(`http://localhost:3000/Product/${pid}`, config)
        ));
        const productsById = productResponses.reduce((acc, resp) => ({
          ...acc,
          [resp.data.id]: resp.data
        }), {});

        setCustomer(customerResponse.data);
        setItems(itemsResponse.data);
        setProducts(productsById);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteItem = async (itemId) => {
    const item = items.find(item => item.id === itemId);
    if (!item) {
        console.error('Item not found');
        return;
    }

    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    try {
        await axios.delete(`http://localhost:3000/Item/${itemId}`, config);

        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);

        setNotificationMessage(`Item '${products[item.productId]?.name}' deleted successfully`);
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


  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <Container>
      <Row style={{ marginTop: '15px' }} className="justify-content-between align-items-center mb-3">
        <Col md={8}>
          <h2 className='account-title'>Account Items</h2>
          <h3 className='customer-name'>{customer.name} {customer.surname}</h3>
        </Col>
        <Col md={4}>
          <div className="text-right">
            <p><strong>Customer ID:</strong> {customer.id}</p>
            <p><strong>Bill ID:</strong> {id}</p>
            <p><strong>Telephone:</strong> {customer.telephone}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <Button onClick={() => setShowAddItem(!showAddItem)} variant="primary">
              {showAddItem ? 'Hide' : 'Add'} Items to Account
            </Button>
          </div>
        </Col>
      </Row>
      {showNotification && <Alert className={`notification-alert ${showNotification ? 'show' : ''}`}>
        {notificationMessage}
      </Alert>}
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
              {currentItems.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{products[item.productId]?.name}</td>
                  <td>{products[item.productId]?.productNumber}</td>
                  <td>{products[item.productId]?.color}</td>
                  <td>{item.quantity}</td>
                  <td>${products[item.productId]?.price?.toFixed(2)}</td>
                  <td>${item.totalPrice.toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>
              {[...Array(totalPages).keys()].map(page => (
                <Button key={page} variant={currentPage === page + 1 ? 'primary' : 'outline-primary'}
                        onClick={() => setCurrentPage(page + 1)}>
                  {page + 1}
                </Button>
              ))}
            </div>
            <strong>Total of {items.reduce((sum, item) => sum + item.quantity, 0)} items: ${items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</strong>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemsPage;

