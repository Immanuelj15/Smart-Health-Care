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
    <div className="gradient-bg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-block px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6 animate-bounce">
                ✨ The future of digital health is here
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                Your Health, <br />
                <span className="text-gradient">Redefined.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience world-class healthcare from the comfort of your home. Find doctors, consult online, and get medications delivered.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={openLoginModal} className="btn-premium text-lg px-10">
                  Get Started Now
                </button>
                <div className="flex items-center space-x-4 px-6 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur shadow-sm">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Joined by 10k+ patients</span>
                </div>
              </div>

              {/* Quick Search */}
              <div className="mt-12 bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto lg:mx-0">
                <div className="flex-1 flex items-center px-4 space-x-3 border-r border-slate-100">
                  <span className="text-slate-400">📍</span>
                  <input defaultValue="Madurai, India" className="w-full py-3 text-slate-700 font-semibold focus:outline-none" />
                </div>
                <div className="flex-[2] flex items-center px-4 space-x-3">
                  <span className="text-slate-400">🔍</span>
                  <input placeholder="Search specialists, clinics..." className="w-full py-3 text-slate-700 focus:outline-none" />
                </div>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                  Search
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <img src="/images/home/hero-banner.jpg" alt="Healthcare" className="w-full h-full object-cover aspect-[4/3]" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 z-20 glass p-6 rounded-2xl shadow-2xl animate-float">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">✅</div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Trusted Doctors</p>
                    <p className="text-2xl font-black text-slate-900">500+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Expert care for any concern</h2>
            <p className="text-slate-600 text-lg">Choose from our wide range of specialists available for instant video consultation and in-person visits.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialties.map(spec => (
              <div key={spec.name} className="card-premium group">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <img src={spec.icon} alt={spec.name} className="h-12 w-12 object-contain filter drop-shadow-md" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{spec.name}</h3>
                <p className="text-sm text-slate-500 mb-6">Verified specialists available 24/7 for you.</p>
                <button onClick={openLoginModal} className="w-full py-3 text-indigo-600 font-bold border-2 border-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                  Consult Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest from Health Insights</h2>
              <p className="text-slate-600">Stay informed with expert medical advice and wellness tips.</p>
            </div>
            <button className="hidden md:block text-indigo-600 font-bold hover:underline">View All Articles →</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { title: "Building a Modern Immunity System", author: "Dr. Diana Borgio", img: "/images/home/article-2.jpg", tag: "Wellness" },
              { title: "Managing Anxiety in the Digital Age", author: "Dr. Alex Rivers", img: "/images/home/article-1.jpg", tag: "Mental Health" }
            ].map((article, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-80 rounded-3xl overflow-hidden shadow-lg mb-6">
                  <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-indigo-600 shadow-sm">{article.tag}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors uppercase">{article.title}</h3>
                <div className="flex items-center space-x-3 text-slate-500 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                  <span>By {article.author}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHomePage;