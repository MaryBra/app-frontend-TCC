"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface PesquisadorData {
  id: number;
  nomePesquisador: string;
  sobrenome: string;
  nomeCompleto: string;
  dataNascimento?: string;
  nacionalidade?: string;
  paisNascimento?: string;
  nomeCitacoesBibliograficas?: string;
  dataAtualizacao?: string;
  horaAtualizacao?: string;
  telefone?: string;
}

interface UserData {
  id: number;
  login: string;
  tipo: string;
  nome?: string;
  email?: string;
  emailVerificado?: boolean;
  fotoPerfil?: string;
  pesquisador?: PesquisadorData;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  logout: () => void;
  updateUserPhoto: (fotoUrl: string) => void;
  updateUserData: (newData: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserPhoto = (fotoUrl: string) => {
    if (userData) {
      const updatedUserData = {
        ...userData,
        fotoPerfil: fotoUrl,
      };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      localStorage.setItem(`userPhoto_${userData.id}`, fotoUrl);
    }
  };

  const updateUserData = (newData: Partial<UserData>) => {
    if (userData) {
      const updatedUserData = {
        ...userData,
        ...newData,
      };
      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const userResponse = await fetch(
        `http://localhost:8080/api/usuarios/listarUsuario/${encodeURIComponent(
          email
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.ok) {
        const userDataFromApi = await userResponse.json();

        const fotoSalva = localStorage.getItem(
          `userPhoto_${userDataFromApi.id}`
        );

        let userDataCompleto: UserData = {
          ...userDataFromApi,
          nome: userDataFromApi.login,
          fotoPerfil:
            fotoSalva || userDataFromApi.fotoPerfil || "/images/user.png",
        };

        if (userDataFromApi.tipoUsuario?.name === "PESQUISADOR") {
          try {
            const pesquisadorResponse = await fetch(
              `http://localhost:8080/api/pesquisadores/buscarPorUsuario/${userDataFromApi.id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (pesquisadorResponse.ok) {
              const dadosPesquisador = await pesquisadorResponse.json();

              if (dadosPesquisador) {
                const nomeCompleto = `${
                  dadosPesquisador.nomePesquisador || ""
                } ${dadosPesquisador.sobrenome || ""}`.trim();

                userDataCompleto = {
                  ...userDataCompleto,
                  nome: nomeCompleto || userDataFromApi.login,
                  pesquisador: {
                    id: dadosPesquisador.id,
                    nomePesquisador: dadosPesquisador.nomePesquisador,
                    sobrenome: dadosPesquisador.sobrenome,
                    nomeCompleto: nomeCompleto,
                    dataNascimento: dadosPesquisador.dataNascimento,
                    nacionalidade: dadosPesquisador.nacionalidade,
                    paisNascimento: dadosPesquisador.paisNascimento,
                    nomeCitacoesBibliograficas:
                      dadosPesquisador.nomeCitacoesBibliograficas,
                    dataAtualizacao: dadosPesquisador.dataAtualizacao,
                    horaAtualizacao: dadosPesquisador.horaAtualizacao,
                    telefone: dadosPesquisador.telefone,
                  },
                };

                localStorage.setItem("idTag", dadosPesquisador.id.toString());
              }
            }
          } catch (err) {
            console.log(
              "Usuário não é pesquisador ou dados não encontrados:",
              err
            );
          }
        }

        setUserData(userDataCompleto);
        localStorage.setItem("userData", JSON.stringify(userDataCompleto));
      } else {
        throw new Error("Falha ao carregar dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const fotoSalva = localStorage.getItem(`userPhoto_${parsedData.id}`);
        setUserData({
          ...parsedData,
          fotoPerfil: fotoSalva || parsedData.fotoPerfil || "/images/user.png",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("idTag");
    localStorage.removeItem("userData");
    setUserData(null);
    window.dispatchEvent(new Event("userLoggedOut"));
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  useEffect(() => {
    const handleUserDataUpdate = () => {
      refreshUserData();
    };

    const handleForceRefresh = () => {
      refreshUserData();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "forceRefresh" || e.key === "userData") {
        refreshUserData();
      }
    };

    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    window.addEventListener("forceRefresh", handleForceRefresh);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedOut", () => {
      setUserData(null);
      setLoading(false);
    });

    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
      window.removeEventListener("forceRefresh", handleForceRefresh);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedOut", () => {
        setUserData(null);
        setLoading(false);
      });
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        refreshUserData,
        logout,
        updateUserPhoto,
        updateUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
