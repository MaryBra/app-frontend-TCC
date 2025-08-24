"use client"
import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';
import MenuLateral from "../components/MenuLateral";

export default function EditarPerfil() {
  const [formData, setFormData] = useState({
    // Informações Principais
    nomeRegistro: 'Empresa de Tecnologia LTDA',
    nomeComercial: 'TechCorp',
    cnpj: '12.345.678/0001-90',
    telefone: '(41) 99999-9999',
    email: 'contato@techcorp.com.br',
    site: 'www.techcorp.com.br',
    setor: 'Desenvolvimento de Software',
    
    // Informações de Endereço
    cep: '80010-000',
    logradouro: 'Rua das Flores, 123',
    numeroEndereco: '123',
    bairro: 'Centro',
    cidade: 'Curitiba',
    estado: 'PR',
    
    // Informações Gerais
    frase: 'Inovação e tecnologia para transformar o seu negócio',
    textoEmpresa: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam bibendum, sem non gravida varius, libero lacus varius ipsum, a posuere lorem diam non elit. Aliquam gravida commodo enim, et volutpat libero tincidunt in. Sed sed feugiat felis, molestie cursus tortor. Maecenas ut amet sem lacus. Etiam eu semper nisl. Suspendisse quis elit id ligula ultrices aliquet commodo quis leo. Donec eleifend quam mauris, ac ornare purus congue vitae. Etiam ac pharetra elit. Vestibulum ipsum magna, vulputate vitae felis eu, dapibus venenatis elit. Mauris et nibh et dolor venenatis cursus a vel velit. Ut semper tincidunt erat eget tincidunt.'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    // Lógica para cancelar - pode resetar o form ou navegar para outra página
    console.log('Cancelar edição');
  };

  const handleSave = () => {
    // Lógica para salvar os dados
    console.log('Dados salvos:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    {/* Menu lateral fixo */}
    <MenuLateral />
      <div className="w-4/5 mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-6 relative group cursor-pointer">
            <User className="w-8 h-8 text-gray-400" />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-red-600">Editar Perfil</h1>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8">
          {/* Informações Principais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Informações Principais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome de Registro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Registro
                </label>
                <input
                  type="text"
                  name="nomeRegistro"
                  value={formData.nomeRegistro}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Nome Comercial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Comercial
                </label>
                <input
                  type="text"
                  name="nomeComercial"
                  value={formData.nomeComercial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* CNPJ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Site */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site
                </label>
                <input
                  type="url"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Setor */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setor
                </label>
                <select
                  name="setor"
                  value={formData.setor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Desenvolvimento de Software">Desenvolvimento de Software</option>
                  <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                  <option value="Consultoria">Consultoria</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informações de Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Informações de Endereço
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* CEP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Logradouro */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logradouro
                </label>
                <input
                  type="text"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Número */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  name="numeroEndereco"
                  value={formData.numeroEndereco}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR" selected>PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informações Gerais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Informações Gerais
            </h3>
            
            <div className="space-y-4">
              {/* Frase de Destaque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frase de Destaque
                </label>
                <input
                  type="text"
                  name="frase"
                  value={formData.frase}
                  onChange={handleInputChange}
                  placeholder="Frase que representa a empresa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Descrição da Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição da Empresa
                </label>
                <textarea
                  name="textoEmpresa"
                  value={formData.textoEmpresa}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                  placeholder="Descreva a empresa, seus valores, missão e diferencias..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Gravar
          </button>
        </div>
      </div>
    </div>
  );
}