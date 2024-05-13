/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface TemplateStore {
    template: any | null
    setTemplate: (template: any) => void
}

const useTemplateStore = create<TemplateStore>((set) => ({
    template: null,
    setTemplate: (template) => set({ template }),
}))

export default useTemplateStore
