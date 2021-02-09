import bcrypt from 'bcrypt';

export const hashPassword = (senha) => {
  const senhaHash = bcrypt.hashSync(senha, 10);
  return senhaHash;
};
