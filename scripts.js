const { useState, useEffect } = React;

// Firebase konfiguratsiyasi
const firebaseConfig = {
  apiKey: "AIzaSyAU13diPTWnh0tqONP9jMi5Z1Wb6d0hbR8",
  authDomain: "marketplace-app-7c1bc.firebaseapp.com",
  projectId: "marketplace-app-7c1bc",
  storageBucket: "marketplace-app-7c1bc.firebasestorage.app",
  messagingSenderId: "597174503691",
  appId: "1:597174503691:web:92e2c03c35c5e9fad7ba0e",
  measurementId: "G-14HR7LFVK1"
};

// Firebase’ni ishga tushirish
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Python backend URL (mahalliy server)
const backendUrl = 'http://localhost:5000';

// Asosiy komponent
function App() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
  const [language, setLanguage] = useState('uz');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: null });
  const [order, setOrder] = useState({ productId: '', address: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Admin tekshiruvi
        const adminPhone = '+998333348060'; // @xanbs telefon raqamini qo‘ying
        setIsAdmin(user.phoneNumber === adminPhone);
        // Mahsulotlarni Python backend’dan olish
        try {
          const response = await fetch(`${backendUrl}/products`);
          const data = await response.json();
          setProducts(data.products);
          localStorage.setItem('products', JSON.stringify(data.products));
        } catch (error) {
          console.error('Mahsulotlarni yuklashda xato:', error);
        }
        // Kanal obunasini tekshirish
        checkSubscription(user);
      }
    });
  }, []);

  const checkSubscription = async (user) => {
    try {
      const response = await fetch(`${backendUrl}/check_subscription?user_id=${user.uid}`);
      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error('Obuna tekshirishda xato:', error);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    try {
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible'
      });
      const result = await auth.signInWithPhoneNumber(phone, recaptchaVerifier);
      setConfirmationResult(result);
      alert('SMS kod yuborildi!');
    } catch (error) {
      alert('Xato: ' + error.message);
    }
  };

  const handleCodeVerification = async (e) => {
    e.preventDefault();
    try {
      await confirmationResult.confirm(code);
      setPhone('');
      setCode('');
      setConfirmationResult(null);
    } catch (error) {
      alert('Xato: ' + error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (newProduct.image) {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('image', newProduct.image);

      try {
        await fetch(`${backendUrl}/add_product`, {
          method: 'POST',
          body: formData
        });
        const response = await fetch(`${backendUrl}/products`);
        const data = await response.json();
        setProducts(data.products);
        localStorage.setItem('products', JSON.stringify(data.products));
        alert('Mahsulot qo‘shildi! Rasm D:\\Marketplace\\Images ga saqlandi.');
        setNewProduct({ name: '', price: '', image: null });
      } catch (error) {
        alert('Xato: ' + error.message);
      }
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!isSubscribed) {
      alert(`Iltimos, avval @rakhimjanov_pips kanaliga obuna bo‘ling!`);
      return;
    }
    const product = products.find(p => p.id === order.productId);
    const orderData = {
      productId: order.productId,
      productName: product.name,
      price: product.price,
      address: order.address,
      userPhone: user.phoneNumber
    };

    try {
      await fetch(`${backendUrl}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      const updatedOrders = [...orders, { id: Date.now().toString(), ...orderData }];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      alert('Buyurtma yuborildi! Ma’lumotlar D:\\Marketplace\\data.json ga saqlandi.');
      setOrder({ productId: '', address: '' });
    } catch (error) {
      alert('Xato: ' + error.message);
    }
  };

  const translations = {
    uz: { welcome: 'Xush kelibsiz', addProduct: 'Mahsulot qo‘shish', catalog: 'Katalog', order: 'Buyurtma berish' },
    ru: { welcome: 'Добро пожаловать', addProduct: 'Добавить продукт', catalog: 'Каталог', order: 'Сделать заказ' },
    en: { welcome: 'Welcome', addProduct: 'Add Product', catalog: 'Catalog', order: 'Place Order' }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="gradient-bg text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Lagmani Marketplace</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white text-black p-2 rounded-lg shadow hover-scale"
          >
            <option value="uz">O‘zbek</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
          {user ? (
            <button
              onClick={() => auth.signOut()}
              className="bg-red-500 px-4 py-2 rounded-lg shadow hover-scale"
            >
              Chiqish
            </button>
          ) : (
            <div id="recaptcha-container"></div>
          )}
        </div>
      </header>
      <main className="container mx-auto p-6">
        <h2 className="text-4xl font-bold mb-6 text-gray-800 fade-in">{translations[language].welcome}</h2>
        {!user ? (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto fade-in">
            <form onSubmit={handlePhoneLogin} className="mb-4">
              <input
                type="tel"
                placeholder="+998901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-3 rounded-lg w-full hover-scale"
              >
                SMS yuborish
              </button>
            </form>
            {confirmationResult && (
              <form onSubmit={handleCodeVerification}>
                <input
                  type="text"
                  placeholder="SMS kod"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg w-full hover-scale"
                >
                  Tasdiqlash
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {isAdmin && (
              <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow-lg mb-8 fade-in">
                <input
                  type="text"
                  placeholder="Mahsulot nomi"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Narxi"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                  className="border p-3 mb-3 w-full rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg w-full hover-scale"
                >
                  {translations[language].addProduct}
                </button>
              </form>
            )}
            <h3 className="text-2xl font-bold mb-6 text-gray-800 fade-in">{translations[language].catalog}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg hover-scale fade-in">
                  <img src={`http://localhost:5000/images/${product.image}`} alt={product.name} className="w-full h-48 object-cover mb-3 rounded-lg" />
                  <h4 className="text-xl font-bold text-gray-800">{product.name}</h4>
                  <p className="text-gray-600">{product.price} UZS</p>
                  <button
                    onClick={() => setOrder({ ...order, productId: product.id })}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg mt-3 w-full hover-scale"
                  >
                    {translations[language].order}
                  </button>
                </div>
              ))}
            </div>
            {order.productId && (
              <form onSubmit={handleOrder} className="bg-white p-6 rounded-lg shadow-lg mt-8 fade-in">
                <input
                  type="text"
                  placeholder="Manzil"
                  value={order.address}
                  onChange={(e) => setOrder({ ...order, address: e.target.value })}
                  className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg w-full hover-scale"
                >
                  Buyurtma yuborish
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
