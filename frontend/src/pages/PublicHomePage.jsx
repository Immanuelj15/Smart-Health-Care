import React from 'react';
import { useModal } from '../context/ModalContext';

const PublicHomePage = () => {
  const { openLoginModal } = useModal();

  const specialties = [
    { name: "Acne, pimple or skin issues", icon: "/images/home/consult-skin.png" },
    { name: "Cold, cough or fever", icon: "/images/home/consult-fever.png" },
    { name: "Child not feeling well", icon: "/images/home/consult-child.png" },
    { name: "Depression or anxiety", icon: "/images/home/consult-mentalhealth.png" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="h-[60vh] bg-cover bg-center flex flex-col justify-center items-center text-white"
        style={{ backgroundImage: `url('/images/home/hero-banner.jpg')` }}
      >
        <div className="bg-black bg-opacity-40 w-full h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-5xl font-bold">Your Health, Our Priority</h1>
            <p className="text-xl mt-4 max-w-2xl">Find trusted doctors, book appointments, and manage your health all in one place.</p>
            <div className="mt-8 w-full max-w-2xl flex bg-white rounded-lg shadow-lg">
                <input defaultValue="Madurai" className="p-4 text-gray-700 w-1/3 rounded-l-lg" />
                <input placeholder="Search doctors, clinics, hospitals, etc." className="p-4 text-gray-700 w-2/3 rounded-r-lg" />
            </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4">
        {/* Consult Top Doctors Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Consult top doctors online for any health concern</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            {specialties.map(spec => (
              <div key={spec.name} className="flex flex-col items-center p-4 rounded-lg hover:shadow-xl cursor-pointer transition-shadow">
                <img src={spec.icon} alt={spec.name} className="h-24 w-24 object-contain"/>
                <p className="font-semibold mt-2">{spec.name}</p>
                <button onClick={openLoginModal} className="font-bold text-blue-500 mt-1 hover:underline">CONSULT NOW</button>
              </div>
            ))}
          </div>
        </div>

        {/* Health Articles Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Read top articles from health experts</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/images/home/article-1.jpg" alt="Article 1" className="w-full h-48 object-cover"/>
              <div className="p-6 text-left">
                <h3 className="font-semibold text-lg">12 Coronavirus Myths and Facts</h3>
                <p className="text-sm text-gray-500">Dr. Diana Borgio</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/images/home/article-2.jpg" alt="Article 2" className="w-full h-48 object-cover"/>
              <div className="p-6 text-left">
                <h3 className="font-semibold text-lg">Eating Right to Build Immunity</h3>
                <p className="text-sm text-gray-500">Dr. Diana Borgio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePage;