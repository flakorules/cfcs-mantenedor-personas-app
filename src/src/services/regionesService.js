const baseUrl = process.env.REACT_APP_BASE_URL;

export const selectRegiones = async () => {
    const resp = await fetch(`${baseUrl}/Regiones`);
    const data = await resp.json();
    return data;
};
