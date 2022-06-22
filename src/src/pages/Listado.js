import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { PersonaFila } from "../components/personas/PersonaFila";
import { selectPersonas } from "../services/personasService";

export const Listado = () => {
  const [personas, setPersonas] = useState([]);

  const getData = async () => {
    const data = await selectPersonas();
    setPersonas(data);
  };

  const onDeletePersona = async (id) => {
    const data = personas.filter((persona) => persona.id !== id);
    
    Swal.fire(
      'Registro eliminado',
      'Operación exitosa.',
      'success'
    )

    setPersonas(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Link to="/persona" className="btn btn-primary">
        Agregar nueva persona
      </Link>

      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">RUT</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona) => (
            <PersonaFila
              key={persona.id}
              persona={persona}
              onDeletePersona={onDeletePersona}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
