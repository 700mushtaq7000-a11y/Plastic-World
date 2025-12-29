
import React, { useState } from 'react';
import { Product, Order, UnitType } from '../../types';
import LoginForm from './LoginForm';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (p: Product[]) => void;
  onLoginSuccess: () => void;
  isLoggedIn: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, onUpdateProducts, onLoginSuccess, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  if (!isLoggedIn) {
    return <LoginForm onSuccess={onLoginSuccess} />;
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (editingProduct.id) {
      onUpdateProducts(products.map(p => p.id === editingProduct.id ? editingProduct as Product : p));
    } else {
      const newProduct = { ...editingProduct, id: Math.random().toString(36).substr(2, 9) } as Product;
      onUpdateProducts([...products, newProduct]);
    }
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-fit sticky top-24">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full text-right px-4 py-3 rounded-xl font-bold transition ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              إدارة المنتجات
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-right px-4 py-3 rounded-xl font-bold transition ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              سجل الطلبات
            </button>
          </nav>
        </aside>

        <main className="flex-grow">
          {activeTab === 'products' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-900">المنتجات الحالية ({products.length})</h2>
                <button 
                  onClick={() => setEditingProduct({ name: '', price: 0, wholesalePrice: 0, quantity: 10, unitType: 'قطعة', image: 'https://picsum.photos/400/300' })}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  إضافة منتج
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 items-center">
                    <img src={p.image} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900">{p.name}</h4>
                      <p className="text-xs text-gray-500">{p.price.toLocaleString()} د.ع | الكمية: {p.quantity} {p.unitType}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900">الطلبات الأخيرة</h2>
              {orders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-400 font-bold">لا يوجد طلبات مسجلة حالياً</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <span className="text-xs font-bold text-gray-400 block">رقم الطلب: #{o.id}</span>
                          <h3 className="text-xl font-bold text-blue-900">{o.customerName}</h3>
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-bold text-blue-600 block">{o.total.toLocaleString()} د.ع</span>
                          <span className="text-xs text-gray-500">{o.date}</span>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><strong>الهاتف:</strong> {o.customerPhone}</p>
                        <p><strong>العنوان:</strong> {o.customerAddress}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="text-xs font-bold text-gray-400 mb-2">قائمة المنتجات:</h4>
                        <ul className="text-sm space-y-1">
                          {o.items.map(i => <li key={i.id}>- {i.name} ({i.cartQuantity} {i.unitType})</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="bg-blue-600 p-6 text-white">
                <h3 className="text-xl font-bold">{editingProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
             </div>
             <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh] no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">اسم المنتج</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-xl" 
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">السعر</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border rounded-xl"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: +e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">سعر الجملة</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border rounded-xl"
                      value={editingProduct.wholesalePrice}
                      onChange={(e) => setEditingProduct({...editingProduct, wholesalePrice: +e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">الكمية المتاحة</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border rounded-xl"
                      value={editingProduct.quantity}
                      onChange={(e) => setEditingProduct({...editingProduct, quantity: +e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">نوع الوحدة</label>
                    <select 
                      className="w-full px-4 py-2 border rounded-xl"
                      value={editingProduct.unitType}
                      onChange={(e) => setEditingProduct({...editingProduct, unitType: e.target.value as UnitType})}
                      required
                    >
                      <option value="باله">باله</option>
                      <option value="كونية">كونية</option>
                      <option value="كارتونة">كارتونة</option>
                      <option value="سيت">سيت</option>
                      <option value="درزن">درزن</option>
                      <option value="ربطة">ربطة</option>
                      <option value="قطعة">قطعة</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">رابط الصورة</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-xl"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      required
                    />
                  </div>
                </div>
             </div>
             <div className="p-6 border-t flex gap-4">
                <button type="submit" className="flex-grow bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg">حفظ المنتج</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50">إلغاء</button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
