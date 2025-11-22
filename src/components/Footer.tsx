import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">TranspoBolivia</h3>
                        <p className="text-sm">Tu plataforma confiable para viajar por Bolivia.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
                            <li><Link to="/search" className="hover:text-white transition-colors">Buscar Pasajes</Link></li>
                            <li><Link to="/operador/login" className="hover:text-white transition-colors">Portal Empresas</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Información</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <p className="text-sm">Email: info@transpobolivia.com</p>
                        <p className="text-sm">Teléfono: +591 2 123 4567</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; 2025 TranspoBolivia. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
