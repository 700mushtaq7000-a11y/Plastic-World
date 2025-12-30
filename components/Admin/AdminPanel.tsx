
import React, { useState, useRef, useEffect } from 'react';
import { Product, Order, UnitType } from '../../types';
import LoginForm from './LoginForm';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (p: Product[]) => void;
  onLoginSuccess: () => void;
  isLoggedIn: boolean;
}

interface FBConfig {
  pageId: string;
  accessToken: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, orders, onUpdateProducts, onLoginSuccess, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> & { autoPost?: boolean } | null>(null);
  const [fbConfig, setFbConfig] = useState<FBConfig>({ pageId: '', accessToken: '' });
  const [isPosting, setIsPosting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('fb_config');
    if (saved) setFbConfig(JSON.parse(saved));
  }, []);

  if (!isLoggedIn) {
    return <LoginForm onSuccess={onLoginSuccess} />;
  }

  const handleSaveFBConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('fb_config', JSON.stringify(fbConfig));
    alert('✅ تم حفظ إعدادات الربط بنجاح! يمكنك الآن النشر تلقائياً.');
  };

  const testFBConnection = async () => {
    if (!fbConfig.pageId || !fbConfig.accessToken) {
      alert('⚠️ يرجى إدخال البيانات أولاً');
      return;
    }
    setIsTesting(true);
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${fbConfig.pageId}?fields=name,fan_count&access_token=${fbConfig.accessToken}`);
      const data = await res.json();
      if (data.name) {
        alert(`✅ الاتصال ناجح!\nاسم الصفحة: ${data.name}\nعدد المتابعين: ${data.fan_count}`);
      } else {
        alert(`❌ فشل الاتصال: ${data.error?.message || 'تأكد من الرمز ومعرف الصفحة'}`);
      }
    } catch (err) {
      alert('❌ حدث خطأ في الشبكة أثناء اختبار الاتصال');
    } finally {
      setIsTesting(false);
    }
  };

  const postToFacebook = async (product: Product): Promise<boolean> => {
    if (!fbConfig.pageId || !fbConfig.accessToken) {
      alert('⚠️ نظام الفيسبوك غير مفعل. اذهب للإعدادات أولاً.');
      return false;
    }

    try {
      const message = `🛍️ منتج جديد متوفر الآن في عالم بلاستك!\n\n🔹 ${product.name}\n💰 السعر: ${product.price.toLocaleString()} د.ع\n📦 الكمية: ${product.quantity} ${product.unitType}\n\n📍 الكوت - السوق الكبير\n📞 للطلب واتساب: 07747782808\n\n#عالم_بلاستك #الكوت #تسوق #بلاستيك #العراق`;
      
      const formData = new FormData();
      formData.append('caption', message);
      formData.append('access_token', fbConfig.accessToken);

      if (product.image.startsWith('data:')) {
        const parts = product.image.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        const blob = new Blob([u8arr], { type: mime });
        formData.append('source', blob);
      } else {
        formData.append('url', product.image);
      }

      const response = await fetch(`https://graph.facebook.com/v21.0/${fbConfig.pageId}/photos`, { 
        method: 'POST', 
        body: formData 
      });
      
      const result = await response.json();
      if (result.id) return true;
      
      alert(`❌ خطأ من فيسبوك: ${result.error?.message}`);
      return false;
    } catch (error) {
      alert('❌ حدث خطأ غير متوقع أثناء النشر.');
      return false;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => prev ? { ...prev, image: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setIsPosting(true);

    const productToSave: Product = {
      id: editingProduct.id || Math.random().toString(36).substr(2, 9),
      name: editingProduct.name || 'منتج جديد',
      price: Number(editingProduct.price) || 0,
      wholesalePrice: Number(editingProduct.wholesalePrice) || 0,
      quantity: Number(editingProduct.quantity) || 0,
      unitType: (editingProduct.unitType as UnitType) || 'قطعة',
      image: editingProduct.image || 'https://via.placeholder.com/400x300?text=عالم+بلاستك'
    };

    if (editingProduct.autoPost && !editingProduct.id) {
      const fbSuccess = await postToFacebook(productToSave);
      if (!fbSuccess) {
        if (!confirm('فشل النشر على فيسبوك. هل تريد الحفظ في المتجر فقط؟')) {
          setIsPosting(false);
          return;
        }
      }
    }

    if (editingProduct.id) {
      onUpdateProducts(products.map(p => p.id === editingProduct.id ? productToSave : p));
    } else {
      onUpdateProducts([productToSave, ...products]);
    }
    
    setEditingProduct(null);
    setIsPosting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 h-fit sticky top-24">
          <h2 className="text-2xl font-black text-blue-900 mb-8 pb-4 border-b">الإدارة</h2>
          <nav className="space-y-4">
            <button onClick={() => setActiveTab('products')} className={`w-full text-right px-6 py-4 rounded-2xl font-bold transition flex items-center justify-between ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-600 hover:bg-blue-50'}`}>
              <span>المنتجات</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full text-right px-6 py-4 rounded-2xl font-bold transition flex items-center justify-between ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-600 hover:bg-blue-50'}`}>
              <span>الطلبات</span>
              <span className={`px-2 py-0.5 rounded-lg text-xs ${activeTab === 'orders' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>{orders.length}</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full text-right px-6 py-4 rounded-2xl font-bold transition flex items-center justify-between ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-600 hover:bg-blue-50'}`}>
              <span>الربط بفيسبوك</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
          </nav>
        </aside>

        <main className="flex-grow">
          {activeTab === 'products' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm gap-6">
                <div>
                  <h2 className="text-3xl font-black text-blue-900">المخزون</h2>
                  <p className="text-gray-500">إدارة المنتجات والنشر التلقائي</p>
                </div>
                <button 
                  onClick={() => setEditingProduct({ name: '', price: 0, wholesalePrice: 0, quantity: 1, unitType: 'قطعة', image: '', autoPost: true })}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-bold transition shadow-xl shadow-green-100"
                >+ إضافة منتج جديد</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex gap-6 items-center hover:shadow-xl transition">
                    <img src={p.image} className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-50" alt={p.name} />
                    <div className="flex-grow">
                      <h4 className="font-black text-blue-900 text-lg">{p.name}</h4>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-xs font-bold">{p.price.toLocaleString()} د.ع</span>
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-xl text-xs font-bold">{p.quantity} {p.unitType}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition underline text-xs">تعديل</button>
                      <button onClick={() => { if(confirm('حذف المنتج؟')) onUpdateProducts(products.filter(pr => pr.id !== p.id)) }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition underline text-xs">حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'orders' ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-blue-900">الطلبات الواردة</h2>
              {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center text-gray-400 border-2 border-dashed border-gray-100 font-bold">لا توجد طلبات حالياً</div>
              ) : (
                orders.map(o => (
                  <div key={o.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b pb-6">
                      <div>
                        <h3 className="text-xl font-black text-blue-900">{o.customerName}</h3>
                        <p className="text-sm text-gray-400">{o.date}</p>
                      </div>
                      <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-xs font-black">قيد المعالجة</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-sm">
                      <div className="bg-gray-50 p-4 rounded-2xl"><span className="text-gray-400 block mb-1">الهاتف:</span> <span className="font-bold">{o.customerPhone}</span></div>
                      <div className="bg-gray-50 p-4 rounded-2xl"><span className="text-gray-400 block mb-1">العنوان:</span> <span className="font-bold">{o.customerAddress}</span></div>
                    </div>
                    <div className="flex justify-between items-center pt-4 font-black text-blue-600 border-t">
                      <span>الإجمالي:</span>
                      <span className="text-3xl">{o.total.toLocaleString()} د.ع</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
               <div className="flex items-center gap-6 mb-10">
                 <div className="bg-[#1877F2] p-4 rounded-[1.5rem] text-white shadow-lg shadow-blue-200">
                   <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </div>
                 <div>
                   <h2 className="text-3xl font-black text-blue-900">تفعيل نظام فيسبوك</h2>
                   <p className="text-gray-500">اربط متجرك بصفحتك الرسمية للنشر التلقائي</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                   <h4 className="font-black text-blue-900 mb-2">كيف تعمل؟</h4>
                   <ul className="text-sm text-blue-700 space-y-2 list-disc pr-4">
                     <li>أدخل معرف الصفحة (Page ID)</li>
                     <li>أدخل رمز الوصول (Permanent Token)</li>
                     <li>احفظ الإعدادات واختبر الاتصال</li>
                     <li>سيتم نشر أي منتج جديد تضفه تلقائياً</li>
                   </ul>
                 </div>
                 <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                   <h4 className="font-black text-orange-900 mb-2">ملاحظة تقنية</h4>
                   <p className="text-sm text-orange-800 leading-relaxed">
                     يجب الحصول على الرمز من <b>Facebook Graph API Explorer</b> بمدة صلاحية دائمة وصلاحية <code>pages_manage_posts</code> ليعمل النظام للأبد.
                   </p>
                 </div>
               </div>

               <form onSubmit={handleSaveFBConfig} className="space-y-8">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3">معرف الصفحة (Page ID)</label>
                    <input type="text" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition font-bold" value={fbConfig.pageId} onChange={(e) => setFbConfig({...fbConfig, pageId: e.target.value})} required placeholder="مثال: 1029384756..." />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3">رمز الوصول الدائم (Access Token)</label>
                    <textarea className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl h-40 text-xs font-mono outline-none focus:border-blue-500 transition no-scrollbar" value={fbConfig.accessToken} onChange={(e) => setFbConfig({...fbConfig, accessToken: e.target.value})} required placeholder="ألصق الرمز السري هنا..." />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button type="submit" className="flex-grow bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-200">حفظ وتفعيل</button>
                    <button type="button" onClick={testFBConnection} disabled={isTesting} className="bg-white border-2 border-blue-600 text-blue-600 px-10 py-5 rounded-2xl font-black hover:bg-blue-50 transition flex items-center gap-3">
                       {isTesting && <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                       اختبار الربط
                    </button>
                  </div>
               </form>
            </div>
          )}
        </main>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[110] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSaveProduct} className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl my-8 animate-in zoom-in-95 duration-300">
             <div className="bg-blue-600 p-10 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black">{editingProduct.id ? 'تعديل المنتج' : 'إضافة منتج للنظام'}</h3>
                  <p className="text-blue-100 mt-2">أدخل التفاصيل بدقة لضمان ظهورها بشكل احترافي</p>
                </div>
                <button type="button" onClick={() => setEditingProduct(null)} className="p-4 bg-white/10 rounded-3xl hover:bg-white/20 transition">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
             </div>
             
             <div className="p-12">
               <div className="flex flex-col lg:flex-row gap-12">
                 {/* حقول الإدخال */}
                 <div className="flex-grow space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-black text-gray-600 mb-2">اسم المنتج</label>
                        <input type="text" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 font-black text-lg" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-600 mb-2">سعر المفرد (د.ع)</label>
                        <input type="number" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: +e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-600 mb-2">سعر الجملة (د.ع)</label>
                        <input type="number" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={editingProduct.wholesalePrice} onChange={(e) => setEditingProduct({...editingProduct, wholesalePrice: +e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-600 mb-2">الكمية</label>
                        <input type="number" className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={editingProduct.quantity} onChange={(e) => setEditingProduct({...editingProduct, quantity: +e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-gray-600 mb-2">النوع</label>
                        <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={editingProduct.unitType} onChange={(e) => setEditingProduct({...editingProduct, unitType: e.target.value as UnitType})} required>
                          <option value="قطعة">قطعة</option>
                          <option value="ربطة">ربطة</option>
                          <option value="درزن">درزن</option>
                          <option value="سيت">سيت</option>
                          <option value="كارتونة">كارتونة</option>
                          <option value="كونية">كونية</option>
                          <option value="باله">باله</option>
                        </select>
                      </div>
                    </div>
                    
                    {!editingProduct.id && (
                      <label className="flex items-center gap-4 bg-blue-50 p-8 rounded-[2rem] cursor-pointer border-2 border-blue-100 hover:bg-blue-100 transition">
                        <input type="checkbox" className="w-8 h-8 accent-blue-600 rounded-xl" checked={editingProduct.autoPost} onChange={(e) => setEditingProduct({...editingProduct, autoPost: e.target.checked})} />
                        <div>
                          <span className="text-xl font-black text-blue-900 block">نشر فوري على فيسبوك</span>
                          <span className="text-sm text-blue-600">سيتم رفع المنشور فور ضغط زر الحفظ</span>
                        </div>
                      </label>
                    )}
                 </div>

                 {/* المعاينة */}
                 <div className="lg:w-96 space-y-6">
                    <label className="block text-sm font-black text-gray-400 text-center">معاينة المنشور</label>
                    <div className="bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden shadow-2xl">
                       <div className="flex items-center gap-3 p-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">ع</div>
                          <div>
                            <div className="text-sm font-bold">عالم بلاستك - الكوت</div>
                            <div className="text-[10px] text-gray-400">الآن • 🌐</div>
                          </div>
                       </div>
                       <div className="px-4 py-2 text-xs leading-relaxed whitespace-pre-wrap">
                          {`🛍️ منتج جديد متوفر الآن في عالم بلاستك!\n\n🔹 ${editingProduct.name || 'اسم المنتج'}\n💰 السعر: ${(editingProduct.price || 0).toLocaleString()} د.ع\n📦 الكمية: ${editingProduct.quantity || 0} ${editingProduct.unitType}\n\n📍 الكوت - السوق الكبير\n📞 للطلب واتساب: 07747782808`}
                       </div>
                       <div className="relative aspect-square cursor-pointer bg-gray-100" onClick={() => fileInputRef.current?.click()}>
                          <img src={editingProduct.image || 'https://via.placeholder.com/400?text=اختر+صورة+المنتج'} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition text-white font-bold">تغيير الصورة</div>
                       </div>
                       <div className="p-3 flex justify-between border-t text-[10px] text-gray-400 font-bold">
                          <span>👍 إعجاب</span>
                          <span>💬 تعليق</span>
                          <span>↪️ مشاركة</span>
                       </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                 </div>
               </div>
             </div>

             <div className="p-10 border-t bg-gray-50 flex gap-6">
                <button type="submit" disabled={isPosting} className="flex-grow bg-blue-600 text-white font-black py-6 rounded-[2rem] hover:bg-blue-700 transition flex items-center justify-center gap-4 shadow-2xl shadow-blue-200 text-xl">
                   {isPosting ? (
                     <>
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري الحفظ والنشر...</span>
                     </>
                   ) : 'حفظ المنتج وتفعيل النظام'}
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} className="px-12 py-6 border-2 border-gray-200 rounded-[2rem] font-black text-gray-500 hover:bg-white transition text-lg">إلغاء</button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
