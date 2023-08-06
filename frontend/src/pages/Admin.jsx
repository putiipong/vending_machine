import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default function AdminPage() {
  const [productList, setProductList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState();
  const [newProductQuantity, setNewProductQuantity] = useState();
  const [editProduct, setEditProduct] = useState({});
  const openModal = (product) => {
    setEditProduct(product);
    setIsOpenModal(true);
  };
  const closeModal = (product) => {
    setIsOpenModal(false);
  };
  const handleAddProduct = async () => {
    if (newProductName && newProductPrice && newProductQuantity) {
      const newProduct = {
        name: newProductName,
        price: parseInt(newProductPrice),
        quantity: parseInt(newProductQuantity),
      };
      try {
        await axios.post("http://localhost:8080/product", newProduct, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        getProductList();
      } catch (error) {
        console.error(error);
      }
      setNewProductName("");
      setNewProductPrice("");
      setNewProductQuantity("");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/product/${id}`);
      getProductList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProduct = async () => {
    const body = {
      name: editProduct.name,
      price: parseInt(editProduct.price),
      quantity: parseInt(editProduct.quantity),
    };
    try {
      await axios.put(`http://localhost:8080/product/${editProduct.id}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      getProductList();
      closeModal()
    } catch (error) {
      console.error(error);
    }
  };

  const getProductList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products");
      setProductList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded shadow p-8 space-y-4">
        <h1 className="text-3xl font-bold">Admin Page</h1>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Product Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Product Quantity"
              value={newProductQuantity}
              onChange={(e) => setNewProductQuantity(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </div>
        </div>
        <div>
          <table className="w-full">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th></th>
            </tr>
            {productList?.map((product) => (
              <tr>
                <td> {product.name}</td>
                <td> {product.price}</td>
                <td> {product.quantity}</td>
                <td>
                  <button
                    onClick={() => openModal(product)}
                    className="bg-blue-500 text-white px-4 py-2 mr-2 mb-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
      <ReactModal
        isOpen={isOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Product Name"
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Product Price"
            value={editProduct.price}
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Product Quantity"
            value={editProduct.quantity}
            onChange={(e) =>
              setEditProduct({ ...editProduct, quantity: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleEditProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </ReactModal>
    </div>
  );
}
