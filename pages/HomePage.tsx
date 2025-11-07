
import React from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import AIAssistant from '../components/AIAssistant';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center py-16 rounded-2xl bg-cover bg-center" style={{backgroundImage: "linear-gradient(rgba(0, 82, 155, 0.7), rgba(0, 61, 115, 0.8)), url('https://picsum.photos/seed/bolivia-landscape/1200/400')"}}>
        <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Tu Viaje por Bolivia Comienza Aquí</h1>
            <p className="text-lg text-white/90 mt-4 max-w-2xl mx-auto">Encuentra, compara y compra tus pasajes de bus a los mejores precios. ¡Fácil, rápido y seguro!</p>
        </div>
      </div>
      
      <div className="-mt-16 relative z-10">
        <SearchForm />
      </div>

      <section>
        <h2 className="text-3xl font-bold text-center text-primary mb-8">¿Por qué elegir TranspoBolivia?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-surface p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-secondary mb-2">Mejores Precios</h3>
                <p className="text-text-muted">Compara entre decenas de empresas y encuentra siempre la mejor oferta para tu bolsillo.</p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-secondary mb-2">Compra Fácil</h3>
                <p className="text-text-muted">Elige tu asiento y paga en línea en minutos. Recibe tu e-ticket al instante.</p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-secondary mb-2">Seguridad y Confianza</h3>
                <p className="text-text-muted">Trabajamos solo con empresas verificadas para garantizar un viaje seguro y confortable.</p>
            </div>
        </div>
      </section>

      <section className="bg-surface p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-primary">¿Eres una empresa de transporte?</h2>
          <p className="text-text-muted mt-2 max-w-xl">Publica tus rutas, gestiona tu flota y vende pasajes en línea. Potencia tu negocio con nuestra plataforma.</p>
        </div>
        <Link 
          to="/operador/login" 
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 whitespace-nowrap"
        >
          Portal para Empresas
        </Link>
      </section>

      <section>
        <AIAssistant />
      </section>

    </div>
  );
};

export default HomePage;