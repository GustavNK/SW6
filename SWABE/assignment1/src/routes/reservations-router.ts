import { Router } from 'express';
import { Reservation } from '../controllers/reservations-controller';
import { ALLPERMS, PERMISSIONS, requirePermission } from '../PermissionsExtensions';

const router = Router();

router.get('', requirePermission(... ALLPERMS), Reservation.list);
router.get('/:uid', requirePermission(... ALLPERMS), Reservation.read); //Only accessible by guests on their own reservations
router.post('/:uid', requirePermission(... ALLPERMS), Reservation.create);
router.patch('/:uid', requirePermission(... ALLPERMS), Reservation.update); //Only accessible by guests on their own reservations
router.delete('/:uid', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Reservation.remove);

export const reservations = router;