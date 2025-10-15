import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageViewer = ({ isOpen, images, index = 0, onClose, onPrev, onNext }) => {
  if (!isOpen || !images || images.length === 0) return null;

  const current = images[index] || images[0];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center" onClick={onClose}>
      <button
        aria-label="Close"
        className="absolute top-4 right-4 btn btn-ghost btn-sm text-white"
        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
      >
        <X className="w-5 h-5" />
      </button>

      <button
        aria-label="Prev"
        className="absolute left-4 btn btn-ghost btn-circle text-white"
        onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="max-h-[90vh] max-w-[90vw] p-2" onClick={(e) => e.stopPropagation()}>
        <img src={current} alt="viewer" className="max-h-[85vh] max-w-[85vw] object-contain rounded" />
      </div>

      <button
        aria-label="Next"
        className="absolute right-4 btn btn-ghost btn-circle text-white"
        onClick={(e) => { e.stopPropagation(); onNext?.(); }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ImageViewer;



