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

export default function HistoricoAgendamentos() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/reservations")
      .then((res) => res.json())
      .then((data) => setAgendamentos(data))
      .catch((error) => console.error("Erro ao buscar agendamentos:", error));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      await fetch(`http://localhost:8080/reservations/${id}`, {
        method: "DELETE",
      });
      setAgendamentos((prev) => prev.filter((agendamento) => agendamento.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  return (
    <>
      <NavBar active="agendamentos" />
      <main className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mt-16 text-right">Histórico de Agendamentos</h1>
        <div className="w-full max-w-2xl">
          {agendamentos.length === 0 ? (
            <p className="text-gray-600">Nenhum agendamento encontrado.</p>
          ) : (
            agendamentos.map((agendamento) => (
              <div key={agendamento.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-4">
                <div>
                  <h2 className="font-bold text-lg">Quadra {agendamento.quadra}</h2>
                  <p className="text-gray-600">Dia: {agendamento.data}</p>
                  <p className="text-gray-600">Horário: {agendamento.horario}</p>
                </div>
                <button onClick={() => handleDelete(agendamento.id)} className="text-red-500 hover:text-red-700">
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
