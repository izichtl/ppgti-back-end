export const sanitizeCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};
