
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-24 pb-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6 text-center md:text-right">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              عالم البلاستيك <span className="text-orange-400">بين يديك</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-xl">
              نوفر لك تشكيلة واسعة من المنتجات البلاستيكية عالية الجودة للمنزل والمطاعم. نتميز بأسعار الجملة والتوصيل المجاني داخل مدينة الكوت.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <a href="#products-section" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition transform">
                ابدأ التسوق الآن
              </a>
              <a href="https://wa.me/9647747782808" target="_blank" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 hover:scale-105 transition transform">
                واتساب
              </a>
              <a href="https://www.facebook.com/share/p/1C5ZtohE5q/" target="_blank" className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 hover:scale-105 transition transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                فيسبوك
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-6 pt-8">
               <div className="text-center">
                 <div className="text-3xl font-bold text-orange-400">500+</div>
                 <div className="text-sm text-blue-200">منتج مختلف</div>
               </div>
               <div className="w-px h-10 bg-blue-700"></div>
               <div className="text-center">
                 <div className="text-3xl font-bold text-orange-400">24h</div>
                 <div className="text-sm text-blue-200">توصيل سريع</div>
               </div>
               <div className="w-px h-10 bg-blue-700"></div>
               <div className="text-center">
                 <div className="text-3xl font-bold text-orange-400">100%</div>
                 <div className="text-sm text-blue-200">ثقة وأمان</div>
               </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            <img 
              src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800" 
              alt="منتجات بلاستيكية" 
              className="relative rounded-2xl shadow-2xl border-4 border-white/10 hover:rotate-1 transition duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
