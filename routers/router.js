import { Router } from 'express';
import { home, userRegister, getUsers, edituser , deleteUser, transfer, getTransfers} from '../controllers/controller.js';

let router = Router()

router.get('/',home)

router.post('/usuario',userRegister)

router.get('/usuarios',getUsers)

router.put('/usuario', edituser)

router.delete('/usuario' , deleteUser)

router.post('/transferencia',transfer)

router.get('/transferencias',getTransfers)

export {
    router
}