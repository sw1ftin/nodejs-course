import { Router } from 'express';
import { Route } from '../types/route.interface.js';

export interface Controller {
  readonly router: Router;
  addRoute(route: Route): void;
}
