'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function PerfilRedirect() {
  const tipoUsuario = localStorage.getItem("tipo_usuario")
  const idUsuario = localStorage.getItem("usuarioId")
  const router = useRouter();
  
  useEffect(() => {
    if (tipoUsuario === 'pesquisador') {
      router.replace(`/pesquisadores/${idUsuario}`);
    } else if (tipoUsuario === 'empresa') {
      router.replace(`/perfilEmpresa/${idUsuario}`);
    }
  }, [router]);
  
  return LoadingSpinner()
}