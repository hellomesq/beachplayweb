"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import NavBar from "../components/Navbar";

export default function ReservaQuadra() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedQuadra, setSelectedQuadra] = useState<string>("");
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  // Pega o ID do usuário se já estiver logado
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData?.id) setUsuarioId(userData.id);
    }
  }, []);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 7; hour < 22; hour += 2) {
      const formattedHour = hour.toString().padStart(2, "0");
      times.push(`${formattedHour}:00:00`);
    }
    return times;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica login somente ao clicar em "Reservar"
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      alert("Você precisa estar logado para reservar.");
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (!userData?.id) {
      alert("Usuário inválido.");
      router.push("/login");
      return;
    }

    setUsuarioId(userData.id);

    if (!selectedDate || !selectedTime || !selectedQuadra) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];

      const reservationData = {
        quadra: selectedQuadra === "Quadra 1" ? 1 : 2,
        data: formattedDate,
        horario: selectedTime,
        userId: userData.id, 
      };
      
    try {
      const response = await fetch("http://localhost:8080/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        alert("Reserva feita com sucesso!");
        setTimeout(() => {
            router.push("/agendamentos");
          }, 1000);
      } else {
        const errorText = await response.text();
        console.error("Erro ao fazer a reserva:", errorText);
        alert("Erro ao fazer a reserva.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro de conexão.");
    }
  };

  return (
    <>
      <NavBar active="inicio" />
      <main className="flex flex-col items-center justify-center min-h-screen px-6">
        <h1 className="text-3xl font-bold text-center mb-2">
          Garanta sua quadra de areia agora!
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-2xl mb-2">
          Reserve seu espaço para jogar vôlei sem preocupações. <br />
          Escolha o horário, chame a galera e aproveite!
        </p>

        <div className="rounded-lg w-[700px] flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Faça a sua reserva
          </h2>
        </div>

        <div className="bg-container p-6 rounded-lg shadow-md w-[700px] h-[400px] flex flex-col items-center">
          <h2 className="text-lg flex justify-between w-full self-start mt-2 uppercase tracking-wide">
            Selecione a data
            <FaCalendarAlt className="text-xl" />
          </h2>
          <hr className="w-full border-t-2 border-black-300 mt-0 mb-14" />

          {/* Quadra */}
          <div className="mb-3">
            <select
              className="w-[540px] h-[55px] p-2 border rounded focus:outline-none"
              onChange={(e) => setSelectedQuadra(e.target.value)}
              value={selectedQuadra}
            >
              <option value="">Selecione a quadra</option>
              <option value="Quadra 1">Quadra 1</option>
              <option value="Quadra 2">Quadra 2</option>
            </select>
          </div>

          {/* Data */}
          <div className="relative w-[540px] h-[55px] mb-3">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-[540px] h-[55px] p-2 border rounded focus:outline-none"
              placeholderText="Selecione a data"
              minDate={new Date()}
            />
          </div>

          {/* Horário */}
          <div className="mb-4">
            <select
              className="w-[540px] h-[55px] p-2 border rounded focus:outline-none"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Selecione o horário</option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 w-full justify-end pr-12">
            <button className="w-[100px] h-[35px] font-semibold rounded-lg text-black hover:bg-gray-400 transition-all">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="w-[100px] h-[35px] font-semibold rounded-lg text-black btn-reserva transition-all"
            >
              Reservar
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
