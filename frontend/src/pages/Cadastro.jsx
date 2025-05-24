import { Nav } from "../components/Nav";
import { Menu } from "../components/Menu";
import { useState } from "react";

export function Cadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const formatCpf = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  };

  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      nome,
      cpf,
      telefone,
      email,
      nascimento,
      objetivo,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar paciente");
      }

      alert("Paciente cadastrado com sucesso!");

      
      setNome("");
      setCpf("");
      setTelefone("");
      setEmail("");
      setNascimento("");
      setObjetivo("");
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  return (
    <div className="flex">
      <Nav />

      <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <h2 className="text-[#A28567] font-semibold text-xl mb-4">
          Sistema de Cálculo de Comissão e Análise de Orçamentos
        </h2>

        <Menu />

        <div className="bg-white rounded-lg p-10 shadow-md w-full max-w-5xl mx-auto mt-6">
          <h2 className="text-[#A28567] text-lg font-medium mb-1">
            Cadastro de Paciente
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Adicione um novo paciente ao sistema
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex flex-col">
              <label className="text-sm text-gray-700">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome completo"
                className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@exemplo.com"
                className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700">
                Objetivo do Tratamento
              </label>
              <input
                type="text"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
              />
            </div>

            <button
              type="submit"
              className="col-span-1 md:col-span-2 mt-4 bg-[#A28567] text-white font-medium py-3 rounded-md hover:opacity-90 transition"
            >
              Cadastrar Paciente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
