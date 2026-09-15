import { create } from 'zustand';

const TOAST_TTL_MS = 5000;

export interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string) => void;
  dismiss: (id: number) => void;
}

let lastToastId = 0;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message) => {
    const id = ++lastToastId;
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));
    setTimeout(() => get().dismiss(id), TOAST_TTL_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
