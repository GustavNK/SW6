import { Router } from 'express';
import { Rooms } from '../controllers/rooms-controller';
import { PERMISSIONS, requirePermission } from '../PermissionsExtensions';

const router = Router();

router.get('', Rooms.list); //ALL PERMISSIONS
router.get('/:uid', Rooms.read);//ALL PERMISSIONS
router.post('/:uid', requirePermission(PERMISSIONS.MANAGER), Rooms.create);
router.patch('/:uid', requirePermission(PERMISSIONS.MANAGER, PERMISSIONS.CLERK), Rooms.update);
router.delete('/:uid', requirePermission(PERMISSIONS.MANAGER), Rooms.remove);

export const rooms = router;