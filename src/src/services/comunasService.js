const baseUrl = process.env.REACT_APP_BASE_URL;

export const selectComunas = async (regionCodigo,ciudadCodigo) => {
    const resp = await fetch(`${baseUrl}/Comunas/${regionCodigo}/${ciudadCodigo}`);
    const data = await resp.json();
    return data;
};