
import React, { useState } from 'react';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'mushtaq' && pass === '1972') {
      onSuccess();
    } else {
      setError('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mt-20">
      <div className="text-center mb-8">
        <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">دخول الإدارة</h2>
        <p className="text-gray-500 text-sm mt-1">يرجى إدخال بيانات الدخول السرية</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">اسم المستخدم</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
