
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} TranspoBolivia. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-secondary transition-colors">Facebook</a>
          <a href="#" className="hover:text-secondary transition-colors">Twitter</a>
          <a href="#" className="hover:text-secondary transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
