export const generateSKU = (titulo, id_tipo) => {
  const tituloPart = titulo.trim().toUpperCase().replace(/\s+/g, '').substring(0, 4);
  const tipoPart = `0${id_tipo}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${tituloPart}-${tipoPart}-${randomPart}`;
}