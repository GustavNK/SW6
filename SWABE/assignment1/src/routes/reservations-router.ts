import { Router } from 'express';
import { Reservation } from '../controllers/reservations-controller';
import { PERMISSIONS, requirePermission } from '../PermissionsExtensions';

const router = Router();

router.get('', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Reservation.list);
router.get('/:uid', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Reservation.read); //Only accessible by guests on their own reservations
router.post('/:uid', Reservation.create);
router.patch('/:uid', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Reservation.update); //Only accessible by guests on their own reservations
router.delete('/:uid', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Reservation.remove);

export const reservations = router;