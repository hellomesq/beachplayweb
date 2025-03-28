"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import NavBar from "../components/Navbar";
interface Agendamento {
  id: number;
  quadra: string;
  data: string;
  horario: string;
}

export default function HistoricoAgendamentos() {
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
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  return (
    <>
    <NavBar active="inicio" />
    <main className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Histórico de Agendamentos</h1>
      <div className="w-full max-w-2xl space-y-4">
        {agendamentos.length === 0 ? (
          <p className="text-gray-600">Nenhum agendamento encontrado.</p>
        ) : (
          agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold text-lg">{agendamento.quadra}</h2>
                <p className="text-gray-600">Dia: {agendamento.data}</p>
                <p className="text-gray-600">Horário: {agendamento.horario}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(agendamento.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
    </>
  );
}