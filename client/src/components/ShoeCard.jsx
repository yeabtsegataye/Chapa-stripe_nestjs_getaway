import axios from 'axios';

const ShoeCard = ({ shoe }) => {
  const ChapaPay = async () => {
    const response = await axios.post('http://localhost:3000/payment/create_chapa', {
      email: 'customer@example.com',
      user_id : 2,
      shoe_id : shoe.id || 1
    });
    console.log(response.data, 'res')
    window.location.href = response.data.data.checkout_url;
  };
  const CardPay =async ()=>{
    const response = await axios.post('http://localhost:3000/payment/create_card', {
      email: 'customer@example.com',
      user_id : 2,
      shoe_id : [shoe.id]
    });
    console.log(response.data.url, 'res')
    window.location.href = response.data.url;
  }

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img className="w-full" src={shoe.imageUrl} alt={shoe.name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{shoe.name}</div>
        <p className="text-gray-700 text-base">{shoe.description}</p>
        <p className="text-gray-900 font-bold">${shoe.price}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button onClick={() => ChapaPay()} className="mr-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Chapa pay
        </button>
        <button onClick={() => CardPay()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded">
          Card pay
        </button>
      </div>
    </div>
  );
};

export default ShoeCard;
