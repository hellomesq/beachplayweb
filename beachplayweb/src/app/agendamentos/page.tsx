"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaEdit } from "react-icons/fa";
import NavBar from "../components/Navbar";

interface Agendamento {
  id: number;
  quadra: number;
  data: string;
  horario: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

export default function HistoricoAgendamentos() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [naoLogado, setNaoLogado] = useState(false);

  const carregarDados = async (userId: number) => {
    try {
      const userRes = await fetch(`http://localhost:8080/cadastro/${userId}`);
      const userData = await userRes.json();
      setUsuario(userData);

      const agRes = await fetch(
        `http://localhost:8080/reservations/usuario/${userId}`
      );
      const agData = await agRes.json();

      setAgendamentos(Array.isArray(agData) ? agData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      carregarDados(parsed.id);
    } else {
      setNaoLogado(true);
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      await fetch(`http://localhost:8080/reservations/${id}`, {
        method: "DELETE",
      });
      setAgendamentos((prev) =>
        prev.filter((agendamento) => agendamento.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  return (
    <>
      <NavBar active="perfil" />
      <div className="flex min-h-screen bg-white">
        {/* Sidebar */}
        {!naoLogado && (
          <aside className="w-86 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.13)] p-6 hidden md:block">
            <div className="mb-50 mt-30">
              <p className="text-2xl font-bold text-center">
                Olá, {usuario?.nome || "@user"}
              </p>
              <div className="w-18 h-1 bg-yellow-300 mt-8 mx-auto"></div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-center text-xl text-white bg-[#083344] px-4 py-3 rounded-tl-[20px] font-medium w-80">
                <span className="mr-2">⟳</span> Histórico
              </li>
              <li className="flex items-center text-xl text-black px-4 py-3 font-medium">
                <span className="mr-2">✎</span> Perfil
              </li>
            </ul>

            <div className="absolute bottom-22 left-6 text-sm text-black cursor-pointer text-xl">
              ↩ Sair
            </div>
          </aside>
        )}
        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 md:p-12">
          {isLoading ? (
            <p className="text-center">Carregando...</p>
          ) : naoLogado ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
              <h1 className="text-3xl font-semibold mb-8">
                Verifique seus agendamentos
              </h1>
              <p className="text-gray-700 mb-4 text-xl">
                Você não está logado no sistema. Por favor, faça login para
                acessar seus agendamentos.
              </p>
              <br></br>
              <button
                onClick={() => router.push("/login")}
                className="btn-login"
              >
                Login
              </button>
            </div>
            ) : (
            <div className="space-y-6">
              {usuario && (
                  <div className="bg-[#f9fafb] p-6 rounded-lg shadow mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Seus dados</h2>
                  <p>
                    <strong>Nome:</strong> {usuario.nome}
                  </p>
                  <p>
                    <strong>Email:</strong> {usuario.email}
                  </p>
                  <p>
                    <strong>CPF:</strong> {usuario.cpf}
                  </p>
                </div>
              )}
              {agendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex bg-gray-50 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="bg-yellow-300 w-3"></div>
                  <div className="flex justify-between items-center w-full p-4">
                    <div>
                      <h2 className="font-bold text-lg">
                        QUADRA {agendamento.quadra}
                      </h2>
                      <p>
                        <strong>Dia:</strong> {agendamento.data}
                      </p>
                      <p>
                        <strong>Horário:</strong> {agendamento.horario}
                      </p>
                    </div>
                    <div className="flex space-x-4 text-[#083344] text-lg">
                      <button className="hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(agendamento.id)}
                        className="hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
