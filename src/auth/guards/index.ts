import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';

export const GUARDS = [JwtAuthGuard, RolesGuard];
