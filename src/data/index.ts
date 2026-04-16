import { forbiddenCity } from './museums/forbidden-city';
import { uffizi } from './museums/uffizi';
import { britishMuseum } from './museums/british-museum';
import type { Museum } from './types';

export const museums: Museum[] = [forbiddenCity, uffizi, britishMuseum];

export function getMuseumById(id: string): Museum | undefined {
  return museums.find((m) => m.id === id);
}

export type { Museum, Exhibit, Route, RouteStop, Floor } from './types';
