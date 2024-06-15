import React from "react";
import CustomersTable from "../../components/CustomersTable/CustomersTable.jsx";
import { useSelector } from "react-redux";

export default function CustomersPage() {
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  return (
    <div>
      <CustomersTable isUserLoggedIn={isUserLoggedIn}/>
    </div>
  );
}
