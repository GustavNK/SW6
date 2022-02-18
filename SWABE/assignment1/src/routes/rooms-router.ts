import { Router } from 'express';
import { Rooms } from '../controllers/rooms-controller';
import { PERMISSIONS, requirePermission } from '../PermissionsExtensions';

const router = Router();

router.get('', Rooms.list);
router.get('/:uid', Rooms.read);
router.post('/:uid', Rooms.create);
router.patch('/:uid', Rooms.update);
router.delete('/:uid', Rooms.remove);

export const rooms = router;