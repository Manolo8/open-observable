import { createContext } from 'react';
import { ContextType } from '../types/context-type';

export const GlobalObservableContext = createContext<ContextType>({ observable: null as unknown as any });