import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "../component/Modal";

export default function Products() {
  const [balance, setBalance] = useState(0);
  const [productList, setProductList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState('ok');
  const openModal = (product) => {
    setIsOpenModal(true);
  };
  const closeModal = (product) => {
    setIsOpenModal(false);
  };
  const handleInsertCoin = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  const getProductList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products");
      setProductList(response.data.sort((a, b) => {
        return a.name - b.name;
    }));
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyProduct = async (product) => {
    const{id,name,price,quantity}=product
    const body = {
      name,
       price,
    quantity: quantity - 1,
  };
    if(product.price<=balance){
      try {
        await axios.put(`http://localhost:8080/product/${id}`, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        getProductList()
        setBalance(balance-price)
        setTypeModal('ok')
        openModal()
      } catch (error) {
        console.error(error);
        setTypeModal(error)
        openModal()
      }
    }else{
      setTypeModal('Balance is not enough')
      openModal()
    }
   
   
  };
  useEffect(() => {
    getProductList();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded shadow p-8 ">
        <h1 className="text-3xl font-bold">Vending Machine</h1>
        <div className="flex items-center justify-center">
          <div className="border-solid border-2 border-indigo-600 rounded-lg p-4 m-4 w-2/3 max-h-2/3">
            <h2 className="text-xl font-semibold">Products:</h2>
            <div className="flex w-100 flex-wrap ">
              {productList?.map((product, index) => (
                <div className="m-2">
                  <div className="flex flex-col items-center border-solid border-2 drop-shadow-sm rounded-lg p-4 m-6 w-full">
                    <div className="m-4">
                      <img
                      alt="logo"
                        src={process.env.PUBLIC_URL + "/item-logo.png"}
                        width={50}
                      />
                    </div>
                    <div>
                      <div className="flex flex-col  items-center justify-between space-x-2">
                        <div className="flex   items-center justify-between space-x-2">
                          <span className="font-bold">Name</span>
                          <span>{product.name}</span>
                        </div>
                        <div className="flex   items-center justify-between space-x-2">
                          <span className="font-bold">Price</span>
                          <span className="text-rose-700">{product.price} bath</span>
                        </div>
                        <div className="flex   items-center justify-between space-x-2">
                          <span className="font-bold">Quantity</span>
                          <span>{product.quantity}</span>
                        </div>
                        <button
                          className={` text-white px-4 py-2 rounded ${
                            product.quantity <= 0 ? "bg-slate-600" : "bg-blue-500"
                          }`}
                          onClick={()=>{handleBuyProduct(product)}}
                          disabled={product.quantity <= 0}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 w-1/3">
            <div>
              <h2 className="text-xl font-semibold">Insert Coins:</h2>
              <div className="space-x-2 mb-2">
                <button
                  onClick={() => handleInsertCoin(1)}
                  className="bg-green-500 text-white px-4 py-2 rounded-full"
                >
                  1
                </button>
                <button
                  onClick={() => handleInsertCoin(5)}
                  className="bg-green-500 text-white px-4 py-2 rounded-full"
                >
                  5
                </button>
                <button
                  onClick={() => handleInsertCoin(10)}
                  className="bg-green-500 text-white px-4 py-2 rounded-full"
                >
                  10
                </button>
              </div>
              <div className="space-x-2 mb-2">
                <button
                  onClick={() => handleInsertCoin(20)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  20
                </button>
                <button
                  onClick={() => handleInsertCoin(50)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  50
                </button>
                <button
                  onClick={() => handleInsertCoin(100)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  100
                </button>
              </div>
              <div className="space-x-2 mb-2">
                <button
                  onClick={() => handleInsertCoin(500)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  500
                </button>
                <button
                  onClick={() => handleInsertCoin(1000)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  1000
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Balance: {balance.toLocaleString()} bath
              </h2>
            </div>
          </div>
        </div>
      </div>
      <Modal type={typeModal} closeModal={closeModal} isOpenModal={isOpenModal}/>
    </div>
  );
}
