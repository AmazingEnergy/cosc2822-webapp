import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSideBar = () => {
  const navigate = useNavigate();
  return (
    <aside
      className="w-1/6 bg-[#E89F71] p-4 text-center select-none h-auto"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <nav className="mt-6 space-y-16">
        <h2
          className="flex items-center  text-black font-semibold hover:text-white hover:bg-[#D68157] p-2 rounded transition duration-300"
          onClick={() => navigate("/admin/products")}
        >
          Products
        </h2>
        <h2
          className="flex items-center text-black font-semibold hover:text-white hover:bg-[#D68157] p-2 rounded transition duration-300"
          onClick={() => navigate("/admin/orders")}
        >
          Orders
        </h2>
      </nav>
    </aside>
  );
};

export default AdminSideBar;
