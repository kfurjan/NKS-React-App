import React from "react";
import CustomersDataTable from "../../components/CustomersDataTable/CustomersDataTable";
import { useSelector } from "react-redux";

export default function CustomersPage() {
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  return (
    <div>
      <CustomersDataTable isUserLoggedIn={isUserLoggedIn} />
    </div>
  );
}
