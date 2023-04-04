import React, { useReducer } from 'react'
import Contexto from './Contexto'
import Reducer  from "./Reducer"


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase, ref, onValue, push} from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUOMBM2ZmbS67znW13QWnGcV2pSFwI63E",
  authDomain: "maca-store.firebaseapp.com",
  projectId: "maca-store",
  storageBucket: "maca-store.appspot.com",
  messagingSenderId: "849527668032",
  appId: "1:849527668032:web:d71b4eb81a49af094e4ea5",
  measurementId: "G-NL2222QJBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase()
const refProductos = ref(db,'productos/')
const refCompras = ref(db,'compras')

export default function UsarContexto(props) {

    const {children} = props
    const estadoInicial = {
        productos: [],
        carrito: []
    }

    const [state, dispatch] = useReducer(Reducer, estadoInicial)    

    const getProductos = async () => {
        onValue(refProductos, (snap)=>{
            let data = snap.val()
            console.log(data, 'desde firebase')
            dispatch({type: "GET_PRODUCTOS", payload: data})
        })
    }

    const agregarCarrito = (id) => {
        console.log('en agregarCarrito',id)
        let index = state.carrito.findIndex( item => item.id===id)
        if (index >= 0) {      
            state.carrito[index].cant++                        
            dispatch({type: "SETEAR_CARRITO", payload: state.carrito})
        }
        else {
            dispatch({type: "AGREGAR_CARRITO", payload: id})      
        }    
    }

    const sumarCarrito = (id,numero) => {
        console.log('en sumarCarrito',id, numero)
        let index = state.carrito.findIndex( item => item.id===id)
        if (index >= 0) {      
            state.carrito[index].cant+=numero
            if (state.carrito[index].cant===0)
                dispatch({type: "ELIMINAR_CARRITO", payload: id})
            else    
                dispatch({type: "SETEAR_CARRITO", payload: state.carrito})
        }
    }

    const eliminarCarrito = (id) => {
        console.log('eliminar carrito',id)
        dispatch({type: "ELIMINAR_CARRITO", payload: id})
    }
    
    const guardarCompra = (compra) => {
        // seteo la compra en la db
        push(refCompras, compra)

        // vacio el carrito
        dispatch({type: "SETEAR_CARRITO", payload: []})
    }

    return (
        <Contexto.Provider value={{
            productos: state.productos,
            carrito: state.carrito,
            getProductos,
            agregarCarrito,
            eliminarCarrito,
            sumarCarrito,
            guardarCompra,
        }}>
            {children}
        </Contexto.Provider>
    )
}
