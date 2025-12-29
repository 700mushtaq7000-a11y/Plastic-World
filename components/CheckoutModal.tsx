
import React, { useState } from 'react';

interface CheckoutModalProps {
  onClose: () => void;
  onConfirm: (details: { name: string, phone: string, address: string }) => void;
  total: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onConfirm, total }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('07');
  const [address, setAddress] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transform animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">تأكيد الطلب</h2>
          <p className="text-blue-100 text-sm mt-1">يرجى ملء البيانات للتواصل معك وتوصيل الطلب</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="مثال: محمد علي"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">رقم الهاتف (واتساب)</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="07XXXXXXXX"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">العنوان في الكوت</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="مثال: حي الكفاءات - قرب مدرسة النهضة"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
            <span className="text-orange-800 font-bold">إجمالي المبلغ:</span>
            <span className="text-xl font-extrabold text-orange-600">{total.toLocaleString()} د.ع</span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onConfirm({ name, phone, address })}
              disabled={!name || !phone || !address}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition disabled:opacity-50"
            >
              تأكيد وإرسال واتساب
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-4 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
