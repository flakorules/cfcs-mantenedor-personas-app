import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { PersonaForm } from "../components/personas/PersonaForm";
import { selectPersonaById } from "../services/personasService";

export const Formulario = () => {
  const [formData, setFormData] = useState({});
  let { id } = useParams();

  const getData = async () => {
    if (id) {
      const data = await selectPersonaById(id);
      setFormData(data);
    } else {
      setFormData({});
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return <PersonaForm id={id} formData={formData} />;
};
