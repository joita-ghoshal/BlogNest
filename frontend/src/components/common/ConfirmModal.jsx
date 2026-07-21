import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-xl mx-4"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
                <HiExclamationCircle size={20} style={{ color: '#EF4444' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#EF4444' }}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
