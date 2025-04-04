"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../components/Navbar";

export default function LoginOuCadastro() {
  const router = useRouter();
  const [modoLogin, setModoLogin] = useState(true); // alterna entre login/cadastro

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modoLogin) {
      // Modo LOGIN
      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, senha: formData.senha }),
        });

        if (response.ok) {
          alert("Login realizado com sucesso!");
          const userData = await response.json();
          localStorage.setItem("usuario", JSON.stringify({ id: userData.id, nome: userData.nome }));
          router.push("/agendamentos");
        } else {
          const erro = await response.text();
          alert("Erro no login: " + erro);
        }
      } catch (err) {
        console.error("Erro no login:", err);
        alert("Erro ao conectar com o servidor.");
      }
    } else {
      // Modo CADASTRO
      try {
        const response = await fetch("http://localhost:8080/cadastro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Cadastro realizado com sucesso!");
          const userData = await response.json();
          localStorage.setItem("usuario", JSON.stringify(userData));
          router.push("/agendamentos");
        } else {
          const erro = await response.json();
          alert("Erro ao cadastrar: " + erro.join(", "));
        }
      } catch (err) {
        console.error("Erro ao cadastrar:", err);
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <div>
      <NavBar active="login" />
      <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6">
          {modoLogin ? "Login" : "Cadastro"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          {!modoLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Nome completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  maxLength={14}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {modoLogin ? "Entrar" : "Cadastrar"}
          </button>

          <p className="text-sm text-center mt-4">
            {modoLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => setModoLogin(!modoLogin)}
            >
              {modoLogin ? "Cadastre-se aqui" : "Faça login"}
            </span>
          </p>
        </form>
      </main>
    </div>
  );
}
