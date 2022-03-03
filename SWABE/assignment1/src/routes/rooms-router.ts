import { Router } from 'express';
import { Rooms } from '../controllers/rooms-controller';
import { ALLPERMS, PERMISSIONS, requirePermission } from '../PermissionsExtensions';

const router = Router();

router.get('/:uid', requirePermission(... ALLPERMS), Rooms.read);//ALL PERMISSIONS
router.post('/:uid', requirePermission(PERMISSIONS.MANAGER), Rooms.create);
router.patch('/:uid', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Rooms.update);
router.delete('/:uid', requirePermission(PERMISSIONS.MANAGER), Rooms.remove);
router.get('', requirePermission(... ALLPERMS), Rooms.list); //ALL PERMISSIONS

export const rooms = router;