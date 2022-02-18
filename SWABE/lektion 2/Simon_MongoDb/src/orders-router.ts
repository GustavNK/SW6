import { Router } from 'express'
import { Orders } from './order-controller'

const router = Router()
router.post('/seed',Orders.seed)
router.get('', Orders.list)
router.post('', Orders.create)
router.get('/:uid', Orders.read)
router.put('/:uid', Orders.overwrite)
router.patch('/:uid', Orders.update)
router.delete('/:uid', Orders.remove)

export const orders = router