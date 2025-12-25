import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

const STORAGE_KEY = 'selected_images'

type ImageStore = {
  images: string[]
  isLoaded: boolean
  addImage: (image: string) => void
  removeImage: (image: string) => void
  loadImages: () => Promise<void>
  clearImages: () => void
}

export const useImageStore = create<ImageStore>()((set, get) => ({
  images: [],
  isLoaded: false,

  addImage: (image: string) => set((state) => {
    const newImages = [...state.images, image]
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newImages)).catch(console.error)
    return { images: newImages }
  }),

  removeImage: (image: string) => set((state) => {
    const newImages = state.images.filter((i) => i !== image)
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newImages)).catch(console.error)
    return { images: newImages }
  }),

  loadImages: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored) {
        const images = JSON.parse(stored)
        set({ images, isLoaded: true })
      } else {
        set({ images: [], isLoaded: true })
      }
    } catch (error) {
      console.error('Error loading images from storage:', error)
      set({ images: [], isLoaded: true })
    }
  },

  clearImages: () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(console.error)
    set({ images: [] })
  }
}))
