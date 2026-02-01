import React from 'react';
import { X, FileText, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onPdfClick: (product: Product) => void;
}

const ProgramModal: React.FC<ProgramModalProps> = ({ isOpen, onClose, products, onPdfClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in p-4">
      <div className="bg-white text-zinc-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Comienza por Aquí</h2>
            <p className="text-brand-100">Tu programa completo de transformación</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                onPdfClick(product);
                onClose();
              }}
              className="w-full bg-white border-2 border-brand-100 hover:border-brand-500 hover:bg-brand-50 rounded-xl p-6 transition-all group flex items-center gap-4"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-brand-100 group-hover:bg-brand-200 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                <FileText className="w-8 h-8 text-brand-600" />
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-brand-900 mb-1 group-hover:text-brand-700 transition-colors">
                  {product.title}
                </h3>
                {product.subtitle && (
                  <p className="text-sm text-brand-600">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className="w-6 h-6 text-brand-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-brand-50 rounded-b-2xl text-center">
          <p className="text-sm text-brand-700">
            💡 <strong>Consejo:</strong> Empieza por el Programa Antiinflamatorio para mejores resultados
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgramModal;
