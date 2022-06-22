import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createPersona, updatePersona } from "../../services/personasService";
import { validate, format } from "rut.js";
import "react-datepicker/dist/react-datepicker.css";

import ReactDatePicker from "react-datepicker";
import { selectRegiones } from "../../services/regionesService";
import { selectCiudades } from "../../services/ciudadesService";
import { selectComunas } from "../../services/comunasService";
import {
  validateFechaNacimiento,
  validateMaxLength,
} from "../../helpers/validacionesHelper";
import { selectSexos } from "../../services/sexoService";

export const PersonaForm = ({ id, formData }) => {
  const navigate = useNavigate();
  const [regiones, setRegiones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [sexos, setSexos] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    getValues,
  } = useForm();

  useEffect(() => {
    if (id !== undefined) {
      populateComboboxForUpdate();
      const newDate = formData?.fechaNacimiento
        ? new Date(formData.fechaNacimiento)
        : new Date();

      reset({
        ...formData,
        fechaNacimiento: newDate,
      });
    } else {
      populateComboboxForCreate();
    }
  }, [formData, id, reset]);

  const onSubmit = async (data) => {
    Swal.fire({
      title: `¿Desea guarar el registro?`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: `Si, guardar`,
      cancelButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (id) {
          await saveUpdatePersona(data);
        } else {
          await saveCreatePersona(data);
        }
      }
    });
  };

  const saveCreatePersona = async (data) => {
    try {
      const resp = await createPersona(data);
      Swal.fire("Registro guardado", "Operación exitosa.", "success");
      navigate("/listado");
    } catch (error) {
      Swal.fire("Operacion fallida", "Error al guardar el registro.", "error");
    }
  };

  const saveUpdatePersona = async (data) => {
    try {
      const resp = await updatePersona(data);
      Swal.fire("Registro guardado", "Operación exitosa.", "success");
      navigate("/listado");
    } catch (error) {
      Swal.fire("Operacion fallida", "Error al guardar el registro.", "error");
    }
  };

  const populateComboboxForCreate = async () => {
    const dataSexos = await selectSexos();
    setSexos(dataSexos);
    
    const dataRegiones = await selectRegiones();
    setRegiones(dataRegiones);
  };

  const populateComboboxForUpdate = async () => {
    const dataSexos = await selectSexos();
    
    setSexos(dataSexos);

    const dataRegiones = await selectRegiones();
    setRegiones(dataRegiones);

    if (formData.regionCodigo) {
      const dataCiudades = await selectCiudades(formData.regionCodigo);
      setCiudades(dataCiudades);
      setValue("regionCodigo", formData.regionCodigo);
    }

    if (formData.regionCodigo && formData.ciudadCodigo) {
      const dataComunas = await selectComunas(
        formData.regionCodigo,
        formData.ciudadCodigo
      );

      setComunas(dataComunas);

      setValue("ciudadCodigo", formData.ciudadCodigo);
      setValue("comunaCodigo", formData.comunaCodigo);
    }
  };

  const handleRunBlur = (e) => {
    if (!validate(e.target.value)) {
      setValue("run", "");
      return;
    }
    setValue("run", format(e.target.value));
  };

  const onRegionesChange = async ({ target }) => {
    const regionCodigo = target.value;

    if (regionCodigo !== "") {
      const dataCiudades = await selectCiudades(regionCodigo);
      setCiudades(dataCiudades);
      setValue("ciudadCodigo", "");
      setComunas([]);
    } else {
      setCiudades([]);
      setComunas([]);
    }
  };

  const onCiudadesChange = async ({ target }) => {
    const ciudadCodigo = target.value;
    const regionCodigo = getValues("regionCodigo");

    if (regionCodigo !== "" && ciudadCodigo !== "") {
      const dataComunas = await selectComunas(regionCodigo, ciudadCodigo);
      setComunas(dataComunas);
    } else {
      setComunas([]);
    }
  };

  return (
    <>
      <h2>{id ? "Editar persona" : "Agregar persona"}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="run" className="form-label">
            R.U.N.:
          </label>
          <input
            type="text"
            maxLength="12"
            className="form-control"
            id="run"
            placeholder="11.111.111-1"
            {...register("run", {
              required: true,
              onBlur: handleRunBlur,
            })}
          />
          {errors.run && (
            <div className="alert alert-danger p-1 mt-2" role="alert">
              Dato obligatorio
            </div>
          )}
        </div>

        <div className="row">
          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="run" className="form-label">
              Nombre:
            </label>
            <input
              type="text"
              maxLength="45"
              className="form-control"
              id="nombres"
              placeholder="nombres"
              {...register("nombres", { required: true })}
            />
            {errors.nombres && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}
          </div>

          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="apellidoPaterno" className="form-label">
              Apellido paterno:
            </label>

            <input
              type="text"
              maxLength="25"
              className="form-control"
              id="apellidoPaterno"
              placeholder="Apellido paterno"
              {...register("apellidoPaterno", { required: true })}
            />
            {errors.apellidoPaterno && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}
          </div>

          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="apellidoMaterno" className="form-label">
              Apellido materno:
            </label>

            <input
              type="text"
              maxLength="25"
              className="form-control"
              id="apellidoMaterno"
              placeholder="Apellido materno"
              {...register("apellidoMaterno", { required: true })}
            />

            {errors.apellidoMaterno && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="text"
              maxLength="100"
              className="form-control"
              id="email"
              placeholder="correo@correo.cl"
              {...register("email", {
                required: true,
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              })}
            />

            {errors.email?.type === "required" && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}

            {errors.email?.type === "pattern" && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Email no válido
              </div>
            )}
          </div>

          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="sexoCodigo" className="form-label">
              Sexo:
            </label>

            <select
              type="text"
              className="form-control form-select"
              id="sexoCodigo"
              placeholder="Seleccione"
              {...register("sexoCodigo", { required: true })}
            >
              <option value="">Seleccione</option>

              {sexos.map((sexo) => (
                <option key={sexo.codigo} value={sexo.codigo}>
                  {sexo.nombre}
                </option>
              ))}
            </select>

            {errors.sexoCodigo && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}
          </div>

          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="fechaNacimiento" className="form-label">
              Fecha de nacimiento:
            </label>

            <Controller
              control={control}
              rules={{ required: true, validate: validateFechaNacimiento }}
              name="fechaNacimiento"
              render={({ field }) => (
                <ReactDatePicker
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="01-01-1980"
                  onChange={(e) => field.onChange(e)}
                  selected={field.value}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              )}
            ></Controller>

            {errors.fechaNacimiento?.type === "required" && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}

            {errors.fechaNacimiento?.type === "validate" && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                La fecha de nacimiento debe ser anterior a la fecha de hoy
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="regionCodigo" className="form-label">
              Region:
            </label>
            <select
              type="text"
              className="form-control form-select"
              id="regionCodigo"
              placeholder="Seleccione"
              {...register("regionCodigo", {
                required: true,
                onChange: onRegionesChange,
              })}
            >
              <option value="">Seleccione</option>

              {regiones.map((region) => (
                <option key={region.codigo} value={region.codigo}>
                  {region.nombreOficial}
                </option>
              ))}
            </select>

            {errors.regionCodigo && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}
          </div>

          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="ciudadCodigo" className="form-label">
              Ciudad:
            </label>

            <select
              type="text"
              className="form-control form-select"
              id="ciudadCodigo"
              placeholder="Seleccione"
              {...register("ciudadCodigo", {
                required: true,
                onChange: onCiudadesChange,
              })}
            >
              <option value="">Seleccione</option>

              {ciudades.map((ciudad) => (
                <option key={ciudad.codigo} value={ciudad.codigo}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>
            {errors.ciudadCodigo && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}
          </div>

          <div className="col col-xxl-4 col-xl-4 col-lg-12 col-m-12 col-sm-12">
            <label htmlFor="comunaCodigo" className="form-label">
              Comuna:
            </label>

            <select
              type="text"
              className="form-control form-select"
              id="comunaCodigo"
              placeholder="Seleccione"
              {...register("comunaCodigo", { required: true })}
            >
              <option value="">Seleccione</option>

              {comunas.map((comuna) => (
                <option key={comuna.codigo} value={comuna.codigo}>
                  {comuna.nombre}
                </option>
              ))}
            </select>
            {errors.comunaCodigo && (
              <div className="alert alert-danger p-1 mt-2" role="alert">
                Dato obligatorio
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">
            Dirección:
          </label>
          <input
            type="text"
            maxLength="100"
            className="form-control"
            id="direccion"
            placeholder="Dirección"
            {...register("direccion", { required: true })}
          />
          {errors.direccion && (
            <div className="alert alert-danger p-1 mt-2" role="alert">
              Dato obligatorio
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">
            Teléfono:
          </label>
          <input
            onInput={validateMaxLength}
            type="number"
            maxLength="9"
            max="999999999"
            className="form-control"
            id="telefono"
            placeholder="+56999999999"
            {...register("telefono", { required: true, max: 999999999 })}
          />
          {errors.telefono?.type === "required" && (
            <div className="alert alert-danger p-1 mt-2" role="alert">
              Dato obligatorio
            </div>
          )}

          {errors.telefono?.type === "max" && (
            <div className="alert alert-danger p-1 mt-2" role="alert">
              Dato no debe exeder los 9 caracteres
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="observaciones" className="form-label">
            Observaciones:
          </label>
          <input
            type="text"
            maxLength="100"
            className="form-control"
            id="observaciones"
            placeholder="Observaciones"
            {...register("observaciones", { required: true })}
          />
          {errors.observaciones && (
            <div className="alert alert-danger p-1 mt-2" role="alert">
              Dato obligatorio
            </div>
          )}
        </div>

        <div className="mb-3">
          <Link to="/listado" className="btn btn-secondary mx-3">
            Volver
          </Link>

          <input
            type="submit"
            className="btn btn-primary mx-3"
            value="Guardar"
          />
        </div>
      </form>
    </>
  );
};
