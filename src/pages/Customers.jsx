import React from "react";
import CustomersTable from "../components/CustomersTable"; // Adjust the path as necessary
import { useSelector } from "react-redux";

export default function CustomersPage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div>
      <CustomersTable isAuthenticated={isAuthenticated}/>
      {/* This includes the CustomersTable component in your page */}
    </div>
  );
}
