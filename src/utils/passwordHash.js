import bcrypt from 'bcrypt';
const salt = 8;
export const hashPassword = (senha) => {
  const senhaHash = bcrypt.hashSync(senha, salt);
  return senhaHash;
};

export const checkPassword = async (senha, senhaHash) => {
  const result = await bcrypt.compare(senha, senhaHash);
  console.log(result)
  return result;
};