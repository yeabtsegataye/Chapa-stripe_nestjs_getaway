import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShoeCard from './components/ShoeCard';
import OrderedTab from './components/OrderedTab';

const App = () => {
  const [shoes, setShoes] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchShoes = async () => {
      const response = await axios.get('http://localhost:3000/shoes');
      setShoes(response.data);
    };

    fetchShoes();
  }, []);
//////////////////////////////
  const handleBuy = (shoe) => {
    setOrders([...orders, shoe]);
  };
/////////////////////////////
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Shoe Store</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shoes.map((shoe) => (
            <ShoeCard key={shoe.id} shoe={shoe} onBuy={handleBuy} />
          ))}
        </div>
        <div className="mt-12">
          <OrderedTab orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default App;
