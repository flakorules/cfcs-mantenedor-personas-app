export const validateFechaNacimiento = (value) => value < new Date();

export const validateMaxLength = ({ target }) => {  

  if (target.value.length > target.maxLength)
    target.value = target.value.slice(0, target.maxLength);
};