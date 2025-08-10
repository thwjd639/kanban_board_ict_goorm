import { useLocalStorage } from './useLocalStorage';
import type { WorkMode } from '../types/types';

export function useWorkMode() {
  const [workMode, setWorkMode] = useLocalStorage<WorkMode>('work-mode', 'personal');
  
  const toggleWorkMode = () => {
    setWorkMode(prev => prev === 'personal' ? 'business' : 'personal');
  };

  return { workMode, setWorkMode, toggleWorkMode };
}