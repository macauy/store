import React, { useContext, useEffect } from 'react'
import "../assets/css/Home.css"
import ItemHome from '../components/ItemHome'
import Contexto from '../context/Contexto'

export default function Home() {
  const {getProductos, productos} = useContext(Contexto)

  useEffect(()=> {
    getProductos()
  },[])
  
  
  return (
    <>
    <div className="container">
      <div className="wraper">
        <div className="home">
            {productos.map((item)=>(
              <ItemHome {...item} key={item.id}></ItemHome>
              ))}
        </div>
      </div>
    </div>
    </>
  )
}
