
type ItemChangeStatus = "original" | "adicionado" | "editado" | "deletado";

export interface ItemChange {
  id?: number | string; 
  data: any;            
  status: ItemChangeStatus;
}

export interface ChangesMap {
  [tabName: string]: ItemChange[];
}

export const initialChanges: ChangesMap = {
  "Formações Acadêmicas": [],
  "Atuações Profissionais": [],
  "Artigos": [],
  "Livros": [],
  "Capítulos": [],
  "Trabalho em Eventos": [],
  "Projetos de Pesquisa": [],
  "Premiações": [],
  "Orientações": [],
};


export function mapFormacoesToChanges(formacoes: any[]): { data: any; status: ItemChangeStatus; id: number | string }[] {
  return formacoes.map((f) => ({
    id: f.id,
    data: f,
    status: "original",
  }));
}