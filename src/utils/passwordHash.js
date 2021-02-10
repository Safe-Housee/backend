import bcrypt from 'bcrypt';
import auth from '../config/auth';

export const hashPassword = (senha) => {
  const senhaHash = bcrypt.hashSync(senha, auth.salt);
  return senhaHash;
};

export const checkPassword = async (senha, senhaHash) => {
  const result = await bcrypt.compare(senha, senhaHash);
  return result;
};
