
import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 bottom-0 left-0 w-full max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">سلة المشتريات</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-gray-50 p-6 rounded-full">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">سلتك فارغة</h3>
                <p className="text-gray-500">ابدأ بإضافة المنتجات التي تحبها!</p>
              </div>
              <button onClick={onClose} className="text-blue-600 font-bold hover:underline">متابعة التسوق</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <img src={item.image} className="w-20 h-20 rounded-xl object-cover border" alt={item.name} />
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1.5 hover:text-blue-600 transition"
                      >-</button>
                      <span className="px-3 text-sm font-bold">{item.cartQuantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1.5 hover:text-blue-600 transition"
                      >+</button>
                    </div>
                    <span className="font-bold text-blue-600">{(item.price * item.cartQuantity).toLocaleString()} د.ع</span>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-xs text-red-500 mt-2 hover:underline opacity-0 group-hover:opacity-100 transition"
                  >حذف المنتج</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-500">المجموع الكلي:</span>
              <span className="font-bold text-blue-900 text-2xl">{total.toLocaleString()} د.ع</span>
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              توصيل مجاني للزبائن في مدينة الكوت
            </p>
            <button 
              onClick={onCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
            >
              إكمال الطلب وتثبيت البيانات
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
