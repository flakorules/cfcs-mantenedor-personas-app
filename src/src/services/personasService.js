const baseUrl = process.env.REACT_APP_BASE_URL;

export const selectPersonas = async () => {
  const resp = await fetch(`${baseUrl}/Personas`);
  const data = await resp.json();
  return data;
};

export const selectPersonaById = async (id) => {
  const resp = await fetch(`${baseUrl}/Personas/${id}`);
  const data = await resp.json();
  return data;
};

export const createPersona = async (persona) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(persona);
  
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const resp = await fetch(`${baseUrl}/Personas`, requestOptions);
  const data = await resp.json();
  return data;
};

export const updatePersona = async (persona) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(persona);
  
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };

  const resp = await fetch(`${baseUrl}/Personas`, requestOptions);
  const data = await resp.json();
  return data;
};

export const deletePersona = async (id) => {
  const requestOptions = {
    method: "DELETE",
  };

  await fetch(`${baseUrl}/Personas/${id}`, requestOptions);
  
};
