import { useState } from "react";
import { Menu } from "../components/Menu";
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';

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
      cpf: cpf.replace(/\D/g, ""),
      telefone: telefone.replace(/\D/g, ""),
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

      // Reset form
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
      <div className="main bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <Menu />
        
        <div className="ml-10 p-6">
          <h3 className="text-lg font-medium text-[#A28567] mb-2">Cadastro de Paciente</h3>
          <p className="text-sm text-gray-400 mb-6">Adicione um novo paciente ao sistema</p>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 flex items-center">
                  <FaUser className="mr-2 text-gray-500" /> Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome completo"
                  className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
                  required
                />
              </div>

              {/* CPF */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 flex items-center">
                  <FaIdCard className="mr-2 text-gray-500" /> CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
                  required
                />
              </div>

              {/* Telefone */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 flex items-center">
                  <FaPhone className="mr-2 text-gray-500" /> Telefone
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500" /> E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@exemplo.com"
                  className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
                  required
                />
              </div>

              {/* Data de Nascimento */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" /> Data de Nascimento
                </label>
                <input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
                  required
                />
              </div>

              {/* Objetivo */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1 flex items-center">
                  <FaClipboardList className="mr-2 text-gray-500" /> Objetivo do Tratamento
                </label>
                <input
                  type="text"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Descreva o objetivo do tratamento"
                  className="border border-gray-200 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-[#A28567]"
                  required
                />
              </div>

              {/* Botão de Submit */}
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="w-2xs bg-[#A28567] text-white font-medium py-3 rounded-md hover:bg-[#8a7358] transition"
                >
                  Cadastrar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;