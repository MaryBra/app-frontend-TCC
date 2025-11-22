"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation"; // 1. Importe o useRouter

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalConfiguracoes({ isOpen, onClose }: SettingsModalProps) {
  const router = useRouter(); // 2. Instancie o router
  
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento opcional

  useEffect(() => {
    if (isOpen) {
      const emailSalvo = localStorage.getItem("email") || "";
      setEmail(emailSalvo);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    alert("Configurações salvas! (Lógica de senha pendente)");
    onClose();
  };

  // 👇 3. FUNÇÃO DE EXCLUIR CONTA IMPLEMENTADA
  const handleDeleteAccount = async () => {
    const confirmacao = confirm("Tem certeza que deseja excluir sua conta permanentemente? Todos os seus dados serão perdidos.");
    
    if (!confirmacao) return;

    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");

    console.log(usuarioId)

    if (!token || !usuarioId) {
        alert("Erro de autenticação. Faça login novamente.");
        return;
    }

    setLoading(true);

    try {
        const res = await fetch(`http://localhost:8080/api/usuarios/excluir/${usuarioId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            alert("Conta excluída com sucesso.");
            
            localStorage.clear();
            onClose();
            router.push("/");
            
        } else {
            throw new Error("Falha ao excluir conta.");
        }

    } catch (error) {
        console.error(error);
        alert("Ocorreu um erro ao tentar excluir a conta.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-white w-[600px] rounded-lg shadow-xl overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#990000] w-full text-center">Configurações da Conta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 absolute right-4 top-4">
            <X size={24} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-8 space-y-6">
          
          {/* Inputs de Email e Senha (mantidos iguais) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email cadastrado</label>
            <input type="text" value={email} readOnly className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Alterar senha</label>
            <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-200" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar senha</label>
            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-200" />
          </div>

          {/* Botão Excluir */}
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-[#990000] border border-red-200 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {loading ? "Processando..." : (
                <>
                    <Trash2 size={18} />
                    Excluir Conta
                </>
            )}
          </button>

        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition font-medium">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded bg-[#990000] text-white hover:bg-red-800 transition font-medium">
            Gravar
          </button>
        </div>

      </div>
    </div>
  );
}