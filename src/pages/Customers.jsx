import React from "react";
import CustomersTable from "../components/CustomersTable";
import { useSelector } from "react-redux";

export default function CustomersPage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div>
      <CustomersTable isAuthenticated={isAuthenticated}/>
    </div>
  );
}
