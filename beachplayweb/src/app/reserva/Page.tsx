"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirecionamento
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';
import NavBar from "../components/Navbar";

export default function ReservaQuadra() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedQuadra, setSelectedQuadra] = useState<string>("");

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

        if (!selectedDate || !selectedTime || !selectedQuadra) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD

        const reservationData = {
            quadra: selectedQuadra === "Quadra 1" ? 1 : 2,
            data: formattedDate,
            horario: selectedTime,
        };

        try {
            const response = await fetch("http://localhost:8080/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                alert("Reserva feita com sucesso!");
                router.push("/historico"); // Redireciona para a página de agendamentos
            } else {
                const errorText = await response.text(); 
                console.log("Erro ao fazer a reserva:", errorText);  
                alert("Erro ao fazer a reserva.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro de conexão.");
        }
    };
        
    return (
        <>
            <NavBar active="reserva" />
            <main className="flex justify-center items-center h-screen">
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
                            className="w-[100px] h-[35px] font-semibold rounded-lg text-black btn-reserva transition-all">
                            Reservar
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
