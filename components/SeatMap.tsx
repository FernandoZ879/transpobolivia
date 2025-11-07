
import React from 'react';
import { Asiento, EstadoAsiento } from '../types';

interface SeatMapProps {
  asientos: Asiento[];
  selectedSeats: Asiento[];
  onSeatSelect: (asiento: Asiento) => void;
}

const Seat: React.FC<{ asiento: Asiento; onSelect: () => void; isSelected: boolean }> = ({ asiento, onSelect, isSelected }) => {
  const getSeatColor = () => {
    if (asiento.estado === EstadoAsiento.Ocupado) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-secondary hover:bg-secondary-dark text-white';
    }
    return 'bg-primary-light hover:bg-primary text-white';
  };

  return (
    <button
      onClick={onSelect}
      disabled={asiento.estado === EstadoAsiento.Ocupado}
      className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm transition-colors ${getSeatColor()}`}
      aria-label={`Asiento ${asiento.numero}, ${asiento.estado}`}
    >
      {asiento.numero}
    </button>
  );
};

const SeatMap: React.FC<SeatMapProps> = ({ asientos, selectedSeats, onSeatSelect }) => {
  const handleSelect = (asiento: Asiento) => {
    if (asiento.estado !== EstadoAsiento.Ocupado) {
      onSeatSelect(asiento);
    }
  };

  const renderSeats = (piso: number) => {
    const seatsInFloor = asientos.filter(a => a.piso === piso);
    return (
      <div className="grid grid-cols-5 gap-2 justify-center">
        {seatsInFloor.map((asiento, index) => (
          <React.Fragment key={asiento.id}>
            {/* Añadir pasillo */}
            {index > 0 && index % 4 === 2 && <div className="col-span-1"></div>}
            <div className="flex justify-center">
              <Seat
                asiento={asiento}
                onSelect={() => handleSelect(asiento)}
                isSelected={selectedSeats.some(s => s.id === asiento.id)}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  const hasTwoFloors = asientos.some(a => a.piso === 2);

  return (
    <div className="bg-surface p-6 rounded-lg shadow-md flex flex-col items-center gap-6">
      <div className="flex justify-center items-center gap-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary-light"></div>Disponible</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-secondary"></div>Seleccionado</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-400"></div>Ocupado</div>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full max-w-sm">
        <h4 className="text-center font-bold mb-4 text-text-muted">Piso 1</h4>
        {renderSeats(1)}
      </div>
      {hasTwoFloors && (
         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full max-w-sm">
            <h4 className="text-center font-bold mb-4 text-text-muted">Piso 2</h4>
            {renderSeats(2)}
        </div>
      )}
    </div>
  );
};

export default SeatMap;
