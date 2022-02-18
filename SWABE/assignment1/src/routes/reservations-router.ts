import { Router } from 'express';
import { Reservations } from '../controllers/reservations-controller';
import { PERMISSIONS, requirePermission } from '../PermissionsExtensions';

const router = Router();

router.get('', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Reservations.list);
router.get('/:uid', Reservations.read); //Only accessible by guests on their own reservations
router.post('/:uid', Reservations.create);
router.patch('/:uid', Reservations.update); //Only accessible by guests on their own reservations
router.delete('/:uid', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Reservations.remove);

export const reservations = router;