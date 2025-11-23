"use client";
import { useState, useEffect} from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CardContatoProps {
  idPesquisador: number;
  aberto: boolean;
  onClose: () => void;
  podeEditar: boolean;
  exibirContato: boolean;
  email?: string;
  telefone?: string;
  cidade?: string;
  pais?: string;
}

export function CardContato({
  idPesquisador,
  aberto,
  onClose,
  podeEditar,
  exibirContato,
  email,
  telefone,
  cidade,
  pais
}: CardContatoProps) {
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "cooldownWait" | "error">(null);
  const router = useRouter();

  useEffect(() => {
  if (!aberto) {
    setStatus(null);
    setMensagem("");
    setLoading(false);
  }
  }, [aberto]);

  if (!aberto) return null;


  const handleEnviarMensagem = async () => {

    setLoading(true);
    setStatus(null);

    try {

      const token = localStorage.getItem("token")
      const usuarioId = localStorage.getItem("usuarioId")
      const usuarioTipo = localStorage.getItem("tipo_usuario")

      const dados = {
        "texto" : mensagem,
        "idRemetente": usuarioId,
        "tipoRemetente": usuarioTipo,
        "idDestinatario": idPesquisador
      }

      const res = await fetch(`http://localhost:8080/api/email/enviarContato`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados)
      });
      

      if (res.ok) {
        setStatus("success");
        setMensagem("");
      } else if (res.status == 400){
        setStatus("cooldownWait")
      } else {
        setStatus("error");
      }

    } catch (err) {
      setStatus("error");
    }

    setLoading(false)

  };

  const IconWrapper = ({ children }: any) => (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-600">
      {children}
    </div>
  );

  const Field = ({ icon, children }: any) => (
    <div className="flex items-center gap-3">
      <IconWrapper>{icon}</IconWrapper>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-300/60 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full h-[450px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-center relative p-6 border-b bg-gray-100 rounded-t-2xl">
          <h2 className="text-2xl font-semibold text-[#8B0000]">Informações de Contato</h2>
          <button
            onClick={onClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ✖
          </button>
        </div>

        {/* CONTEÚDO */}
        
        <div className="p-6 h-full flex flex-col items-center justify-center space-y-6">
          {/* CASO 1 - Pode editar & não exibe */}
          {podeEditar && !exibirContato && (
            <div className="text-center space-y-4">
              <p className="text-sm text-black">
                Você não configurou para exibir suas informações de contato para outros usuários.
              </p>
              <Link href="/telaEdicaoPesquisador#contato" scroll={true}>
                    <button className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50">
                        Configurar Informações de Contato
                    </button>
                </Link>
            </div>
          )}

          {/* CASO 2 - Pode editar & exibe */}
          {podeEditar && exibirContato && (
            <div className="space-y-6">
              <Field icon={<Mail size={20} />}>
                <p className="text-gray-900">{email || "Não informado"}</p>
              </Field>

              <Field icon={<Phone size={20} />}>
                <p className="text-gray-900">{telefone || "Não informado"}</p>
              </Field>

              <Field icon={<MapPin size={20} />}>
                <p className="text-gray-900">
                {cidade && pais
                    ? `${cidade}, ${pais}`
                    : cidade
                    ? cidade
                    : pais
                    ? pais
                    : "Não informado"}
                </p>
              </Field>      
            <Link href="/telaEdicaoPesquisador#contato" scroll={true}>
                <button className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50">
                    Editar Informações
                </button>
            </Link>
              
            </div>
          )}


          {/* CASO 3 - Não pode editar & exibe */}
          {!podeEditar && exibirContato && (
            <div className="space-y-6">
              <Field icon={<Mail size={20} />}> 
                <p className="text-gray-900">{email || "Não informado"}</p>
              </Field>

              <Field icon={<Phone size={20} />}> 
                <p className="text-gray-900">{telefone || "Não informado"}</p>
              </Field>

              <Field icon={<MapPin size={20} />}> 
                <p className="text-gray-900">
                {cidade && pais
                    ? `${cidade}, ${pais}`
                    : cidade
                    ? cidade
                    : pais
                    ? pais
                    : "Não informado"}
                </p>
              </Field>
            </div>
          )}

          {/* CASO 4 - Não pode editar & não exibe */}
          {!podeEditar && !exibirContato && (
            <div className="space-y-4">

              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center ">
                  <LoadingSpinner />
                </div>
              ) : status === "success" ? (
                <div className="text-center space-y-4 py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mensagem enviada com sucesso!</h3>
                    <p className="text-sm text-gray-600">O pesquisador receberá sua mensagem por e-mail.</p>
                  </div>
                </div>

              ) : status === "cooldownWait" ? (
              <div className="text-center space-y-4 py-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Você já entrou em contato recentemente</h3>
                  <p className="text-sm text-gray-600">
                    É necessário esperar o período de <strong>sete dias</strong> antes de enviar outra mensagem.
                  </p>
                  </div>

                  
              </div>
                
              ) : status === "error" ? (
                <div className="text-center space-y-4 py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao enviar mensagem</h3>
                    <p className="text-sm text-gray-600">Ocorreu um problema. Por favor, tente novamente.</p>
                  </div>
                  <button
                    onClick={() => setStatus(null)}
                    className="bg-[#990000] hover:bg-red-700 text-white px-5 py-1.5 rounded-lg shadow-md transition text-sm"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-700">
                    Este pesquisador optou por não exibir suas informações de contato.
                    Você pode enviar uma mensagem que será encaminhada por e-mail, formalizando seu interesse. 
                    Uma vez enviada a mensagem, é necessário esperar o período de <strong>sete dias</strong> para 
                    destacar seu interesse novamente.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sua mensagem (opcional)
                    </label>

                    <textarea
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Digite sua mensagem aqui..."
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                                hover:border-gray-400 
                                focus:border-red-800 focus:ring-red-800 
                                resize-none text-black 
                                transition-colors duration-200
                                focus:ring-0 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleEnviarMensagem}
                    disabled={loading}
                    className="w-full bg-red-800 text-white p-3 rounded-lg hover:bg-red-900 transition disabled:opacity-50"
                  >
                    Enviar Mensagem
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}