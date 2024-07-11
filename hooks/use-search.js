import {create} from "zustand"

export const useSearch = create((set , get) => ({
  isOpen : false,
  onOpen : () => set({isOpen : true}),
  onClose : () => set({isOpen : false}),
  onToggle : () => set({isOpen : !get().isOpen})
})) 