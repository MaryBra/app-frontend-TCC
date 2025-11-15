/**
 * Retorna o valor se for uma string válida, caso contrário retorna "Não informado"
 * @param valor - String que pode ser null, undefined ou vazia
 * @param padrao - Valor padrão a retornar (default: "Não informado")
 * @returns String válida ou valor padrão
 */
export const obterValorOuPadrao = (
  valor: string | null | undefined,
  padrao: string = "Não informado"
): string => {
  if (!valor || valor.trim() === "" || valor.trim() === "0") {
    return padrao;
  }
  return valor.trim();
};

/**
 * Retorna o ano ou "Atualmente" se for 0, null ou undefined
 * @param valor - Número representando o ano
 * @returns String com o ano ou "Atualmente"
 */
export const obterAnoOuPadrao = (
  valor: number | null | undefined
): string => {
  if (!valor || valor === 0) {
    return "Atualmente";
  }
  return String(valor);
};

/**
 * Retorna o número como string ou "Não informado" se for 0, null ou undefined
 * @param valor - Número a ser convertido
 * @returns String com o número ou "Não informado"
 */
export const obterNumeroOuPadrao = (
  valor: number | null | undefined
): string => {
  if (!valor || valor === 0) {
    return "Não informado";
  }
  return String(valor);
};

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * @param data - Data no formato ISO (YYYY-MM-DD)
 * @returns Data formatada (DD/MM/YYYY) ou "Não informado"
 */
export const formatarData = (data: string | null | undefined): string => {
  if (!data || data.trim() === "") {
    return "Não informado";
  }

  try {
    // Se vier no formato YYYY-MM-DD
    const partes = data.split('-');
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }

    // Fallback: tenta criar uma data
    const dataObj = new Date(data);
    if (!isNaN(dataObj.getTime())) {
      return dataObj.toLocaleDateString('pt-BR');
    }

    return data;
  } catch (error) {
    return "Não informado";
  }
};

/**
 * Formata uma hora no formato HH:MM:SS para HH:MM
 * @param hora - Hora no formato HH:MM:SS
 * @returns Hora formatada (HH:MM) ou "Não informado"
 */
export const formatarHora = (hora: string | null | undefined): string => {
  if (!hora || hora.trim() === "") {
    return "Não informado";
  }

  try {
    // Se vier no formato HH:MM:SS, pega apenas HH:MM
    const partes = hora.split(':');
    if (partes.length >= 2) {
      return `${partes[0]}:${partes[1]}`;
    }

    return hora;
  } catch (error) {
    return "Não informado";
  }
};

/**
 * Formata data e hora completa
 * @param data - Data no formato YYYY-MM-DD
 * @param hora - Hora no formato HH:MM:SS
 * @returns String formatada "DD/MM/YYYY às HH:MM"
 */
export const formatarDataHora = (
  data: string | null | undefined,
  hora: string | null | undefined
): string => {
  const dataFormatada = formatarData(data);
  const horaFormatada = formatarHora(hora);

  if (dataFormatada === "Não informado" && horaFormatada === "Não informado") {
    return "Não informado";
  }

  if (dataFormatada === "Não informado") {
    return horaFormatada;
  }

  if (horaFormatada === "Não informado") {
    return dataFormatada;
  }

  return `${dataFormatada} às ${horaFormatada}`;
};