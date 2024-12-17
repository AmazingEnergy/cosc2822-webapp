import React from 'react'

const AdminSideBar = () => {
  return (
    <aside className="w-1/6 bg-[#E89F71] p-4">
      <nav className="mt-6 space-y-16">
        <a href="/admin/products" className="flex items-center text-black hover:text-white">
          <span className="ml-2">Products</span>
        </a>
        <a href="/admin/orders" className="flex items-center text-black hover:text-white">
          <span className="ml-2">Orders</span>
        </a>
        <a href="/admin/customers" className="flex items-center text-black hover:text-white">
          <span className="ml-2">Customers</span>
        </a>
        <a href="#" className="flex items-center text-black hover:text-white">
          <span className="ml-2">Edit Profile</span>
        </a>
      </nav>
    </aside>
  );
}

export default AdminSideBar