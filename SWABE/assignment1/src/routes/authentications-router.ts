import { Router } from 'express'
import { Authentications } from '../controllers/authentications-controller'

const router = Router()

router.get('/users', Authentications.list)
router.get('/users/:uid', Authentications.read)
router.post('/user', Authentications.create)
router.post('/login', Authentications.getJWTToken)


export const authentications = router