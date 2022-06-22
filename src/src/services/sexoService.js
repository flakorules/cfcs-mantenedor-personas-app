const baseUrl = process.env.REACT_APP_BASE_URL;

export const selectSexos = async () => {
    const resp = await fetch(`${baseUrl}/Sexo`);
    const data = await resp.json();
    return data;
};