import React from "react";

const AdminSideBar = () => {
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
        <a
          href="/admin/products"
          className="flex items-center  text-black font-semibold hover:text-white hover:bg-[#D68157] p-2 rounded transition duration-300"
        >
          Products
        </a>
        <a
          href="/admin/orders"
          className="flex items-center text-black font-semibold hover:text-white hover:bg-[#D68157] p-2 rounded transition duration-300"
        >
          Orders
        </a>
      </nav>
    </aside>
  );
};

export default AdminSideBar;
