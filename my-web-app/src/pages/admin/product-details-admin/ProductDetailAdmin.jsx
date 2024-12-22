// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import AdminSideBar from "../../../components/AdminSideBar";

// const ProductDetailAdmin = () => {
//   const { id } = useParams(); // Retrieve the 'id' from the URL
//   const navigate = useNavigate(); // For navigation
//   const [product, setProduct] = useState(null);

//   // Mock fetchProductDetails function to simulate API call
//   const fetchProductDetails = async (productId) => {
//     // Simulate fetching product data based on `id`
//     return {
//       skuId: productId,
//       name: "Samsung Galaxy S23 Ultra 8GB 256GB",
//       category: "Mobile",
//       type: "Device",
//       price: 100,
//       description:
//         "Samsung Galaxy S20 Ultra is a flagship phone introduced by Samsung in early 2020. It offers great features, including a 108MP camera, a large battery, and a 120Hz display refresh rate.",
//       imageUrls: {
//         L: [
//           "https://pictures.com/product1-01.png",
//           "https://pictures.com/product1-02.png",
//         ],
//       },
//       specs: {
//         M: {
//           Layer1Name: { S: "Color" },
//           Layer1Value: { S: "Cosmic Black" },
//           Layer2Name: { S: "Storage" },
//           Layer2Value: { S: "8GB-256GB" },
//         },
//       },
//       stockCode: "P00001002",
//       parentSkuId: "SAMSUNG_GALACY_S20_ULTRA",
//       isActive: true,
//     };
//   };

//   useEffect(() => {
//     // Fetch product details when component mounts
//     fetchProductDetails(id).then((data) => setProduct(data));
//   }, [id]);

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   // Handle navigation to update page
//   const handleUpdate = () => {
//     navigate(`/admin/products/update/${id}`);
//   };

//   return (
//     <div className="flex h-screen">
//       {<AdminSideBar />}
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold">{product.name}</h1>
//         <p className="mt-2">Category: {product.category}</p>
//         <p>Type: {product.type}</p>
//         <p>Price: ${product.price.toFixed(2)}</p>
//         <p className="mt-4">{product.description}</p>

//         {/* Update Product Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleUpdate}
//             className="bg-[#D07373] text-white px-4 py-2 rounded hover:bg-[#E89F71]"
//           >
//             Update Product
//           </button>
//         </div>

//         {/* Images Section */}
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold">Images</h2>
//           <div className="flex gap-4 mt-2">
//             {product.imageUrls.L.map((url, index) => (
//               <img
//                 key={index}
//                 src={url}
//                 alt={`${product.name} - Image ${index + 1}`}
//                 className="w-48 h-48 object-cover border rounded"
//               />
//             ))}
//           </div>
//         </div>

//         {/* Specifications Section */}
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold">Specifications</h2>
//           <table className="mt-2 table-auto border-collapse border border-gray-300">
//             <tbody>
//               <tr>
//                 <td className="border px-4 py-2 font-medium">
//                   {product.specs.M.Layer1Name.S}
//                 </td>
//                 <td className="border px-4 py-2">
//                   {product.specs.M.Layer1Value.S}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="border px-4 py-2 font-medium">
//                   {product.specs.M.Layer2Name.S}
//                 </td>
//                 <td className="border px-4 py-2">
//                   {product.specs.M.Layer2Value.S}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailAdmin;


// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import AdminSideBar from "../../../components/AdminSideBar";

// const ProductDetailAdmin = () => {
//   const { skuId } = useParams(); // Retrieve the 'skuId' from the URL
//   const navigate = useNavigate(); // For navigation
//   const [product, setProduct] = useState(null);
//   const [mainImage, setMainImage] = useState("");

//   useEffect(() => {
//     // Fetch product details when component mounts
//     const fetchProductDetails = async () => {
//       try {
//         const response = await axios.get(
//           `https://service.dev.grp6asm3.com/products/${skuId}`
//         );
//         const item = response.data;

//         setProduct({
//           name: item.name,
//           category: item.category,
//           type: item.type,
//           price: item.price,
//           description: item.description,
//           imageUrls: item.imageUrls || [],
//           specs: item.specs || { colors: [], storages: [] },
//           stockCode: item.stockCode,
//           parentSkuId: item.parentSkuId,
//           isActive: item.isActive,
//           skuId: item.skuId,
//         });

//         // Set default main image and spec selections
//         setMainImage(item.imageUrls?.[0] || "");
//         setSelectedStorage(item.specs?.storages?.[0] || "");
//         setSelectedColor(item.specs?.colors?.[0] || "");
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//         setProduct(null);
//       }
//     };

//     fetchProductDetails();
//   }, [skuId]);

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   const handleUpdate = () => {
//     navigate(`/admin/products/update/${skuId}`);
//   };

//   return (
//     <div className="flex h-screen">
//       <AdminSideBar />
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold">{product.name}</h1>
//         <p className="mt-2">Category: {product.category}</p>
//         <p>Type: {product.type}</p>
//         <p>Price: ${product.price.toFixed(2)}</p>

//         {/* Product Images Section */}
//         <div className="flex flex-col items-start mt-6">
//           <img
//             src={mainImage}
//             alt="Main Product"
//             className="w-64 h-64 rounded-lg shadow-md object-cover"
//           />
//           <div className="flex mt-4 gap-2">
//             {product.imageUrls.map((url, index) => (
//               <img
//                 key={index}
//                 src={url}
//                 alt={`Product Thumbnail ${index + 1}`}
//                 onClick={() => setMainImage(url)}
//                 className={`w-16 h-16 rounded-lg shadow-md cursor-pointer ${
//                   mainImage === url ? "border-2 border-blue-500" : ""
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

        
    

//         {/* Description */}
//         <p className="mt-4">{product.description}</p>

//         {/* Update Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleUpdate}
//             className="bg-[#D07373] text-white px-4 py-2 rounded hover:bg-[#E89F71]"
//           >
//             Update Product
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailAdmin;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSideBar from "../../../components/AdminSideBar";

const ProductDetailAdmin = () => {
  const { skuId } = useParams(); // Retrieve the 'skuId' from the URL
  const navigate = useNavigate(); // For navigation
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    // Fetch product details when component mounts
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://service.dev.grp6asm3.com/products/${skuId}`
        );
        const item = response.data;

        setProduct({
          name: item.name,
          category: item.category,
          type: item.type,
          price: item.price,
          description: item.description,
          imageUrls: item.imageUrls || [],
          stockCode: item.stockCode,
          parentSkuId: item.parentSkuId,
          isActive: item.isActive,
          skuId: item.skuId,
          specs: item.specs || {}, // Include specs in the product object
        });

        // Set default main image
        setMainImage(item.imageUrls?.[0] || "");
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      }
    };

    fetchProductDetails();
  }, [skuId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleUpdate = () => {
    navigate(`/admin/products/update/${skuId}`);
  };

  return (
    <div className="flex h-screen">
      <AdminSideBar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2">Category: {product.category}</p>
        <p>Type: {product.type}</p>
        <p>Price: ${product.price.toFixed(2)}</p>

        {/* Product Images Section */}
        <div className="flex flex-col items-start mt-6">
          <img
            src={mainImage}
            alt="Main Product"
            className="w-64 h-64 rounded-lg shadow-md object-cover"
          />
          <div className="flex mt-4 gap-2">
            {product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Product Thumbnail ${index + 1}`}
                onClick={() => setMainImage(url)}
                className={`w-16 h-16 rounded-lg shadow-md cursor-pointer ${
                  mainImage === url ? "border-2 border-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Specifications Section */}
        {product.specs && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Specifications</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Color */}
              {product.specs.layer1Name && (
                <div>
                  <h4 className="text-sm font-medium">
                    {product.specs.layer1Name}:
                  </h4>
                  <p className="text-gray-700">{product.specs.layer1Value}</p>
                </div>
              )}
              {/* Storage */}
              {product.specs.layer2Name && (
                <div>
                  <h4 className="text-sm font-medium">
                    {product.specs.layer2Name}:
                  </h4>
                  <p className="text-gray-700">{product.specs.layer2Value}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="mt-4">{product.description}</p>

        {/* Update Button */}
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            className="bg-[#D07373] text-white px-4 py-2 rounded hover:bg-[#E89F71]"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;
