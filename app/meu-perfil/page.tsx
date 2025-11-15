'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PerfilRedirect() {
  const tipoUsuario = localStorage.getItem("tipo_usuario")
  const idUsuario = localStorage.getItem("id_usuario")
  const router = useRouter();
  
  useEffect(() => {
    if (tipoUsuario === 'pesquisador') {
      router.replace(`/pesquisadores/${idUsuario}`);
    } else if (tipoUsuario === 'empresa') {
      router.replace(`/perfilEmpresa/${idUsuario}`);
    }
  }, [router]);
  
  return <div>Carregando...</div>;
}