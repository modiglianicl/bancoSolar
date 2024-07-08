import path from 'path';
import { registrarUsuario , obtenerUsuarios, editarUsuario, eliminarUsuario, transferencia, obtenerTransferencias } from '../models/queries.js';

let __dirname = path.resolve()

let home = (req,res) => {
    res.sendFile(`${__dirname}/views/index.html`)
}

let userRegister = async (req,res) => {
    let { nombre , balance } = req.body;
    let response = await registrarUsuario(nombre,balance);
    res.send(response)
}

let getUsers = async (req,res) => {
    let response = await obtenerUsuarios();
    res.send(response)
}

let edituser = async (req,res) => {
    let { id } = req.query;
    let { name , balance } = req.body;
    let response = await editarUsuario(name,balance,id);
    res.send(response);

}

let deleteUser = async (req,res) => {
    let { id } = req.query;
    let response = await eliminarUsuario(id);
    res.send(response);
}

let transfer = async (req,res) => {
    let {emisor, receptor, monto} = req.body;
    let response = await transferencia(monto,emisor,receptor);
    res.send(response);
}

let getTransfers = async (req,res) => {
    let response = await obtenerTransferencias();
    res.send(response)
}

    
export {
    home,
    userRegister,
    getUsers,
    edituser,
    deleteUser,
    transfer,
    getTransfers
}