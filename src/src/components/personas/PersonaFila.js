import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { deletePersona } from "../../services/personasService";

export const PersonaFila = ({ persona, onDeletePersona }) => {
  const eliminarPersona = () => {
    Swal.fire({
      title: `¿Desea eliminar el registro?`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: `Si, eliminar`,
      cancelButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
          await deletePersona(persona.id);
          onDeletePersona(persona.id);
          
        } catch (error) {
          Swal.fire(
            'Operacion fallida',
            'Error al eliminar el registro.',
            'error'
          )
        }
      }
    });
  };

  return (
    <tr>
      <td>{persona.nombre}</td>
      <td>{persona.run}</td>
      <td>
        <Link to={`/persona/${persona.id}`} className="btn btn-primary">
          Editar
        </Link>
        <button
          type="button"
          className="btn btn-danger mx-1"
          onClick={eliminarPersona}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};
