"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
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

  const carregarDados = async (userId: number) => {
    try {
      // Buscar dados do usuário
      const userRes = await fetch(`http://localhost:8080/cadastro/${userId}`);
      const userData = await userRes.json();
      setUsuario(userData);

      // Buscar agendamentos
      const agRes = await fetch("http://localhost:8080/reservations");
      const agData = await agRes.json();

      if (Array.isArray(agData)) {
        setAgendamentos(agData);
      } else {
        setAgendamentos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      carregarDados(parsed.id);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      await fetch(`http://localhost:8080/reservations/${id}`, {
        method: "DELETE",
      });
      setAgendamentos((prev) => prev.filter((agendamento) => agendamento.id !== id));
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  return (
    <>
      <NavBar active="agendamentos" />
      <main className="flex flex-col items-center p-6 min-h-screen bg-gray-100 relative">

        <h1 className="text-2xl font-bold mt-20 mb-4">Histórico de Agendamentos</h1>

        {usuario && (
          <div className="bg-white p-4 rounded shadow-md w-full max-w-2xl mb-6">
            <h2 className="text-lg font-semibold mb-2">Dados do Usuário</h2>
            <p><strong>Nome:</strong> {usuario.nome}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>CPF:</strong> {usuario.cpf}</p>
          </div>
        )}

        <div className="w-full max-w-2xl">
          {agendamentos.length === 0 ? (
            <div className="text-center mt-6">
              <p className="text-gray-600 mb-4">Você ainda não fez nenhum agendamento.</p>
              <button
                onClick={() => router.push("/reserva")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Fazer uma reserva
              </button>
            </div>
          ) : (
            agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-4"
              >
                <div>
                  <h2 className="font-bold text-lg">Quadra {agendamento.quadra}</h2>
                  <p className="text-gray-600">Dia: {agendamento.data}</p>
                  <p className="text-gray-600">Horário: {agendamento.horario}</p>
                </div>
                <button
                  onClick={() => handleDelete(agendamento.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
