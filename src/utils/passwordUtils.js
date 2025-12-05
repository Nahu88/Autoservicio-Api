import { hash, compare } from 'bcrypt';

const saltRounds = 12;

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error al Hashear la Contraseña');
  }
}

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error al Comparar la Contraseña');
  }
}