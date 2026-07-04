import { create } from 'zustand'
import type { Goal, CreateGoalDTO, UpdateGoalDTO } from '@ceo-os/shared'

interface GoalState {
  goals: Goal[]
  loading: boolean
  error: string | null
  fetchGoals: () => Promise<void>
  createGoal: (data: CreateGoalDTO) => Promise<Goal>
  updateGoal: (id: string, data: UpdateGoalDTO) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null })
    try {
      const goals = await window.api.goals.getAll()
      set({ goals, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  createGoal: async (data) => {
    const goal = await window.api.goals.create(data)
    set({ goals: [goal, ...get().goals] })
    return goal
  },

  updateGoal: async (id, data) => {
    const updated = await window.api.goals.update(id, data)
    set({ goals: get().goals.map(g => g.id === id ? updated : g) })
  },

  deleteGoal: async (id) => {
    await window.api.goals.delete(id)
    set({ goals: get().goals.filter(g => g.id !== id) })
  },
}))
