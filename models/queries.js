import { pool } from "../config/db.js";
import moment from "moment";

let registrarUsuario = async (nombre,balance) => {
    try {
        let sql = {
            text : "INSERT INTO usuarios (nombre,balance) VALUES ($1,$2) RETURNING *",
            values : [nombre,balance]
        }
        let result = await pool.query(sql);
        if (result.rowCount >= 1)  {
            return result.rows
        } else {
            return new Error("No se realizo el registro de usuario!")
        }
    } catch (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
    }
}

let obtenerUsuarios = async () => {
    try {
        let sql = {
            text : "SELECT * FROM usuarios"
        }
        let result = await pool.query(sql);
        if (result.rowCount >= 1)  {
            return result.rows
        } else {
            return new Error("No se pudo realizar la query")
        }        
    } catch (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);        
    }
}

let editarUsuario = async (name,balance,id) => {
    try {
        let sql = {
            text : "UPDATE usuarios SET nombre = $1 , balance = $2 WHERE id = $3 RETURNING *",
            values : [name,balance,id]
        }
        let result = await pool.query(sql);
        if (result.rowCount >= 1)  {
            return result.rows
        } else {
            return new Error("No se pudo realizar la query")
        }     
    } catch (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);     
    }
}

let eliminarUsuario = async (id) => {
    try {
        let sql = {
            text : "DELETE FROM usuarios WHERE id = $1 RETURNING *",
            values : [id]
        }
        let result = await pool.query(sql);
        if (result.rowCount >= 1)  {
            return result.rows
        } else {
            return new Error("No se pudo realizar la query")
        }    
    } catch (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);     
    }
}

let transferencia = async (monto,emisor,receptor) => {
    try {
        // Banderas
        let emisorOk = false;
        let receptorOk = false;
        // Begin
        await pool.query('BEGIN');
        // Chequeando si es posible la emision
        let sql = {
            text : "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *",
            values : [monto,emisor]
        }
        let emision = await pool.query(sql);
        if (emision.rowCount > 0) {
            emisorOk = true;
            console.log('El descuento fue exitoso',emision.rows)
            await pool.query('COMMIT');
        } else {
            console.log('El descuento no se pudo realizar!');
            await pool.query('ROLLBACK');
            return("Error! revisar consola!")
        }
        // Si el descuento se pudo hacer
        if (emisorOk) {
            // await pool.query('BEGIN');
            let sql = {
                text : "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *",
                values : [monto,receptor]
            }
            let deposito = await pool.query(sql);
            if (deposito.rowCount > 0) {
                receptorOk = true;
                console.log("El abono fue exitoso",deposito.rows);
                // await pool.query('COMMIT');
            } else {
                console.log('El abono no se pudo realizar!');
                await pool.query('ROLLBACK');
                return ("Error! revisar consola!")
            }
        }
        if (emisorOk && receptorOk) {
            console.log(`Transferencia por ${monto} realizada. Emisor ${emisor} ; Receptor ${receptor}`)
            await pool.query('COMMIT')
            // Debemos obtener la id de cemisor y receptor....
            // Obteniendo id del emisor
            let sqlEmisor = {
                text  : "SELECT id FROM usuarios WHERE nombre = $1",
                values : [emisor]
            }
            let resEmisor = await pool.query(sqlEmisor);
            let idEmisor = resEmisor.rows[0]['id'];
            console.log(idEmisor);
            // Obteniendo id receptor
            let sqlReceptor = {
                text  : "SELECT id FROM usuarios WHERE nombre = $1",
                values : [receptor]
            }
            let resReceptor = await pool.query(sqlReceptor);
            let idReceptor = resReceptor.rows[0]['id'];
            console.log(idEmisor);
            // Creando log transferencia
            let fecha_transfer = moment().format()
            let sql = {
                text : "INSERT INTO transferencias (emisor,receptor,monto,fecha) VALUES($1,$2,$3,$4) RETURNING *",
                values : [idEmisor,idReceptor,monto,fecha_transfer]
            }
            let result = await pool.query(sql);
            if (result.rowCount >= 1)  {
                return result.rows;
            } else {
                return new Error("No se pudo realizar la query");
            }
        } else {
            console.log(`Transferencia por ${monto} NO realizada. Emisor ${emisor} ; Receptor ${receptor}`)
            await pool.query('ROLLBACK')
        }
    } catch (error) {
        await pool.query('ROLLBACK');
        console.log(error);
        console.log(error.code);
        console.log(error.message);         
    }

}

let obtenerTransferencias = async () => {
    try {
        let sql = {
            text : "SELECT * FROM transferencias"
        }
        let result = await pool.query(sql);
        if (result.rowCount >= 1)  {
            return result.rows
        } else {
            return new Error("No se pudo realizar la query")
        }  
    } catch (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);    
    }
}

export {
    registrarUsuario,
    obtenerUsuarios,
    editarUsuario,
    eliminarUsuario,
    transferencia,
    obtenerTransferencias
}