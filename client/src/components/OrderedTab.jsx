import React from 'react';

const OrderedTab = ({ orders }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <ul className="list-disc pl-6">
          {orders.map((order, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{order.name}</span> - ${order.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderedTab;
