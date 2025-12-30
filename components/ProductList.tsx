
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onQuickBuy: (p: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, onQuickBuy }) => {
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
            className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(product => (
          <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold">
                {product.quantity} {product.unitType} متاح
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-2xl font-bold text-blue-600">{product.price.toLocaleString()} <span className="text-sm">د.ع</span></span>
                   <span className="text-green-600 font-bold text-xs">جملة: {product.wholesalePrice.toLocaleString()} د.ع</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-1 border border-blue-100"
                  >
                    السلة
                  </button>
                  <button 
                    onClick={() => onQuickBuy(product)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-1 shadow-md shadow-orange-200"
                  >
                    شراء سريع
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
