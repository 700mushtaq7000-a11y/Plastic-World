
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Product, CartItem, Order } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import AdminPanel from './components/Admin/AdminPanel';
import AIAssistant from './components/AIAssistant';
import CheckoutModal from './components/CheckoutModal';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "أكياس بلاستيكية صغيرة",
    price: 15000,
    wholesalePrice: 12000,
    quantity: 50,
    unitType: "ربطة",
    image: "https://picsum.photos/seed/plastic1/400/300"
  },
  {
    id: '2',
    name: "أطباق بلاستيكية كبيرة",
    price: 25000,
    wholesalePrice: 20000,
    quantity: 30,
    unitType: "كونية",
    image: "https://picsum.photos/seed/plastic2/400/300"
  },
  {
    id: '3',
    name: "أكواب بلاستيكية شفافة",
    price: 18000,
    wholesalePrice: 15000,
    quantity: 100,
    unitType: "درزن",
    image: "https://picsum.photos/seed/plastic3/400/300"
  },
  {
    id: '4',
    name: "صناديق تخزين بلاستيك",
    price: 35000,
    wholesalePrice: 28000,
    quantity: 25,
    unitType: "قطعة",
    image: "https://picsum.photos/seed/plastic4/400/300"
  },
  {
    id: '5',
    name: "علب حفظ طعام متوسطة",
    price: 12000,
    wholesalePrice: 9000,
    quantity: 80,
    unitType: "سيت",
    image: "https://picsum.photos/seed/plastic5/400/300"
  },
  {
    id: '6',
    name: "شنط تسوق بلاستيك",
    price: 8000,
    wholesalePrice: 6000,
    quantity: 200,
    unitType: "كارتونة",
    image: "https://picsum.photos/seed/plastic6/400/300"
  }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity < product.quantity) {
          return prev.map(item => item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 } 
            : item
          );
        }
        return prev;
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, Math.min(item.quantity, item.cartQuantity + delta));
        return { ...item, cartQuantity: newQty };
      }
      return item;
    }));
  };

  const completeOrder = (customerDetails: { name: string, phone: string, address: string }) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...customerDetails,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerAddress: customerDetails.address,
      items: [...cart],
      total,
      date: new Date().toLocaleString('ar-IQ'),
      status: 'جديد'
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Generate WhatsApp Message
    const message = encodeURIComponent(`✅ طلب جديد من عالم بلاستك - الكوت\n\nالاسم: ${newOrder.customerName}\nالعنوان: ${newOrder.customerAddress}\n\nالمنتجات:\n${newOrder.items.map(i => `- ${i.name} (${i.cartQuantity} ${i.unitType})`).join('\n')}\n\nالمجموع: ${newOrder.total.toLocaleString()} د.ع`);
    window.open(`https://wa.me/9647747782808?text=${message}`, '_blank');
    
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar 
          cartCount={cart.reduce((a, b) => a + b.cartQuantity, 0)} 
          onCartClick={() => setIsCartOpen(true)}
          isAdmin={isAdmin}
          onLogout={() => setIsAdmin(false)}
        />
        
        <main className="flex-grow pt-16 pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <div id="products-section">
                  <ProductList products={products} onAddToCart={addToCart} />
                </div>
                <AIAssistant products={products} onAddToCart={addToCart} />
              </>
            } />
            <Route path="/admin" element={
              <AdminPanel 
                products={products} 
                orders={orders} 
                onUpdateProducts={setProducts} 
                onLoginSuccess={() => setIsAdmin(true)}
                isLoggedIn={isAdmin}
              />
            } />
          </Routes>
        </main>

        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
          onCheckout={() => setIsCheckoutOpen(true)}
        />

        {isCheckoutOpen && (
          <CheckoutModal 
            onClose={() => setIsCheckoutOpen(false)} 
            onConfirm={completeOrder}
            total={cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0)}
          />
        )}

        <footer className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">عالم بلاستك - الكوت</h3>
              <p className="text-gray-400">وجهتك الأولى لكل ما يخص المنتجات البلاستيكية في مدينة الكوت. جودة، سعر، وتوصيل مجاني.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">الرئيسية</a></li>
                <li><a href="#products-section" className="hover:text-blue-400 transition">المنتجات</a></li>
                <li><a href="#/admin" className="hover:text-blue-400 transition">لوحة المدير</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
              <p className="text-gray-400">واتساب: 07747782808</p>
              <p className="text-gray-400">العنوان: الكوت - السوق الكبير</p>
              <div className="mt-4 flex space-x-4 space-x-reverse">
                 <a href="https://www.facebook.com/share/p/1E1jPE2wks/" target="_blank" className="bg-blue-600 p-2 rounded-full hover:scale-110 transition">
                   <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-12 text-gray-500 border-t border-slate-800 pt-8">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} عالم بلاستك
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
