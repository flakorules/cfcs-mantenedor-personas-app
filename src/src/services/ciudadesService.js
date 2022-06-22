const baseUrl = process.env.REACT_APP_BASE_URL;

export const selectCiudades = async (regionCodigo) => {
    const resp = await fetch(`${baseUrl}/Ciudades/${regionCodigo}`);
    const data = await resp.json();
    return data;
};