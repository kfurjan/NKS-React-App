import React from 'react';
import CustomersTable from '../components/CustomersTable'; // Adjust the path as necessary

export default function CustomersPage() {
  return (
    <div>
      <h1>Customers</h1>
      <p>This is the Customers page.</p>
      <CustomersTable /> {/* This includes the CustomersTable component in your page */}
    </div>
  );
};
