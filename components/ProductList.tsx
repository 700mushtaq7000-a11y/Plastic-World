
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-blue-900">منتجاتنا المميزة</h2>
          <p className="text-gray-500 mt-2">تصفح أفضل ما لدينا بأسعار تنافسية</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="ابحث عن منتج..."
            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold">
                  {product.quantity} {product.unitType} متاح
                </div>
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                  {product.unitType}
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="mt-auto space-y-4">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 line-through">{(product.price + 2000).toLocaleString()} د.ع</span>
                      <span className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} <span className="text-sm">د.ع</span></span>
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">سعر الجملة</span>
                      <span className="text-green-600 font-bold">{product.wholesalePrice.toLocaleString()} د.ع</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    أضف إلى السلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-gray-300 mb-4 flex justify-center">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">عذراً، لم نجد ما تبحث عنه</h3>
          <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 hover:underline">عرض جميع المنتجات</button>
        </div>
      )}
    </section>
  );
};

export default ProductList;
