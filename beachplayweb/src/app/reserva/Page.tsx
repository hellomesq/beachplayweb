"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReservaQuadra() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedQuadra, setSelectedQuadra] = useState<string>("");

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 7; hour < 22; hour += 2) {
            times.push(`${hour}h`);
        }
        return times;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate || !selectedTime || !selectedQuadra) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const reservationData = {
            quadra: selectedQuadra,
            date: selectedDate,
            time: selectedTime,
        };

        try {
            const response = await fetch("http://localhost:8080/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                alert("Reserva feita com sucesso!");
            } else {
                alert("Erro ao fazer a reserva.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro de conexão.");
        }
    };

    return (
        <main className="flex justify-center items-center h-screen">
            <div className="bg-container p-6 rounded-lg shadow-md w-[700px] h-[400px] flex flex-col items-center">
                <h2 className="text-lg font-bold mb-14 flex justify-between w-full self-start mt-2">
                    Selecione a data
                    <span className="text-xl">📅</span>
                </h2>

                {/* Select de Quadra */}
                <div className="mb-3">
                    <select
                        id="quadra"
                        className="w-[540px] h-[55px] p-2 border rounded text-lg"
                        onChange={(e) => setSelectedQuadra(e.target.value)}
                        value={selectedQuadra}
                    >
                        <option>Selecione a quadra</option>
                        <option value="Quadra 1">Quadra 1</option>
                        <option value="Quadra 2">Quadra 2</option>
                    </select>
                </div>

                {/* Seletor de Data */}
                <div className="relative w-[540px] h-[55px] mb-3">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className="w-[540px] h-[55px] p-2 border rounded text-lg"
                        placeholderText="Selecionar data"
                        minDate={new Date()}
                    />
                </div>

                {/* Select de Horário */}
                <div className="mb-4">
                    <select
                        id="horario"
                        className="w-[540px] h-[55px] p-2 border rounded text-lg"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                    >
                        <option>Selecione o horário</option>
                        {generateTimeOptions().map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botões */}
                <div className="flex gap-4 w-full justify-end pr-6">
                    <button className="w-[100px] h-[55px] py-3 rounded-lg text-black hover:bg-gray-400 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="w-[100px] h-[55px] py-3 rounded-lg text-black hover:bg-blue-700 transition-all"
                    >
                        Reservar
                    </button>
                </div>
            </div>
        </main>
    );
}
