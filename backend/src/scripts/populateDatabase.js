const mongoose = require("mongoose")
const Obra = require("../models/Obra")
const Fiscalizacao = require("../models/Fiscalizacao")
require("dotenv").config()

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:joao2005@cluster0.fwta8pc.mongodb.net/obras-db?retryWrites=true&w=majority&appName=Cluster0"

async function populateDatabase() {
  try {
    console.log("🔄 Conectando ao MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Conectado ao MongoDB")

    // Limpar dados existentes
    console.log("🧹 Limpando dados existentes...")
    await Fiscalizacao.deleteMany({})
    await Obra.deleteMany({})

    // Dados de exemplo para obras
    const obrasData = [
      {
        nome: "Construção do Edifício Residencial Alpha",
        responsavel: "João Silva Santos",
        dataInicio: new Date("2024-01-15"),
        dataFim: new Date("2024-12-15"),
        localizacao: {
          latitude: -23.5505,
          longitude: -46.6333,
        },
        descricao:
          "Construção de edifício residencial de 15 andares com 120 apartamentos, incluindo área de lazer completa.",
        foto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        status: "Em Andamento",
        orcamento: 2500000,
        progresso: 45,
      },
      {
        nome: "Reforma do Centro Comercial Beta",
        responsavel: "Maria Oliveira Costa",
        dataInicio: new Date("2024-02-01"),
        dataFim: new Date("2024-08-30"),
        localizacao: {
          latitude: -23.5489,
          longitude: -46.6388,
        },
        descricao:
          "Reforma completa do centro comercial incluindo modernização da fachada, sistemas elétricos e hidráulicos.",
        foto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        status: "Em Andamento",
        orcamento: 800000,
        progresso: 70,
      },
      {
        nome: "Construção da Ponte Gamma",
        responsavel: "Carlos Eduardo Lima",
        dataInicio: new Date("2023-10-01"),
        dataFim: new Date("2024-06-30"),
        localizacao: {
          latitude: -23.552,
          longitude: -46.63,
        },
        descricao: "Construção de ponte rodoviária de 200 metros sobre o rio, incluindo vias de acesso e sinalização.",
        foto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        status: "Concluída",
        orcamento: 5000000,
        progresso: 100,
      },
      {
        nome: "Ampliação do Hospital Delta",
        responsavel: "Ana Paula Ferreira",
        dataInicio: new Date("2024-03-01"),
        dataFim: new Date("2025-02-28"),
        localizacao: {
          latitude: -23.5558,
          longitude: -46.6396,
        },
        descricao: "Ampliação do hospital com nova ala de emergência, 50 novos leitos e centro cirúrgico moderno.",
        foto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        status: "Planejada",
        orcamento: 3200000,
        progresso: 5,
      },
      {
        nome: "Revitalização da Praça Central",
        responsavel: "Roberto Mendes Silva",
        dataInicio: new Date("2024-01-10"),
        dataFim: new Date("2024-07-10"),
        localizacao: {
          latitude: -23.5475,
          longitude: -46.6361,
        },
        descricao:
          "Projeto de revitalização da praça central com novo paisagismo, playground, academia ao ar livre e iluminação LED.",
        foto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        status: "Pausada",
        orcamento: 450000,
        progresso: 30,
      },
    ]

    // Inserir obras
    console.log("📝 Inserindo obras de exemplo...")
    const obras = await Obra.insertMany(obrasData)
    console.log(`✅ ${obras.length} obras inseridas`)

    // Inserir fiscalizações para cada obra
    console.log("📋 Inserindo fiscalizações de exemplo...")
    const fiscalizacoes = []

    for (const obra of obras) {
      // 2-4 fiscalizações por obra
      const numFiscalizacoes = Math.floor(Math.random() * 3) + 2

      for (let i = 0; i < numFiscalizacoes; i++) {
        const dataFiscalizacao = new Date(obra.dataInicio)
        dataFiscalizacao.setDate(dataFiscalizacao.getDate() + i * 30 + Math.floor(Math.random() * 15))

        const statusOptions = ["Em dia", "Atrasada", "Parada"]
        const observacoesOptions = [
          "Obra progredindo conforme cronograma estabelecido. Equipe trabalhando em ritmo normal.",
          "Pequenos atrasos devido às condições climáticas adversas. Previsão de normalização em breve.",
          "Materiais entregues dentro do prazo. Qualidade aprovada pela fiscalização.",
          "Equipe trabalhando em horário normal. Segurança do trabalho em conformidade.",
          "Necessário ajuste no cronograma devido a mudanças no projeto original.",
          "Qualidade dos materiais e execução aprovada. Obra dentro dos padrões técnicos.",
          "Segurança do trabalho em conformidade com as normas. Equipamentos adequados.",
          "Progresso satisfatório. Cumprimento das especificações técnicas do projeto.",
          "Atraso pontual devido a problemas com fornecedores. Situação sendo resolvida.",
          "Obra temporariamente parada para ajustes no projeto. Retomada prevista em breve.",
        ]

        const fiscaisOptions = [
          { nome: "Eng. Carlos Mendes", registro: "CREA-SP 123456" },
          { nome: "Eng. Ana Santos", registro: "CREA-SP 789012" },
          { nome: "Arq. Pedro Lima", registro: "CAU-SP 345678" },
          { nome: "Eng. Mariana Costa", registro: "CREA-SP 901234" },
          { nome: "Eng. Roberto Silva", registro: "CREA-SP 567890" },
        ]

        const condicoesClimaticas = ["Ensolarado", "Nublado", "Chuvoso", "Tempestade", "Neblina"]
        const niveisRisco = ["Baixo", "Médio", "Alto", "Crítico"]

        fiscalizacoes.push({
          data: dataFiscalizacao,
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          observacoes: observacoesOptions[Math.floor(Math.random() * observacoesOptions.length)],
          localizacao: {
            latitude: obra.localizacao.latitude + (Math.random() - 0.5) * 0.001,
            longitude: obra.localizacao.longitude + (Math.random() - 0.5) * 0.001,
          },
          foto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          obra: obra._id,
          fiscal: fiscaisOptions[Math.floor(Math.random() * fiscaisOptions.length)],
          temperatura: Math.floor(Math.random() * 25) + 15, // 15-40°C
          condicaoClimatica: condicoesClimaticas[Math.floor(Math.random() * condicoesClimaticas.length)],
          nivelRisco: niveisRisco[Math.floor(Math.random() * niveisRisco.length)],
        })
      }
    }

    await Fiscalizacao.insertMany(fiscalizacoes)
    console.log(`✅ ${fiscalizacoes.length} fiscalizações inseridas`)

    console.log("\n🎉 Database populado com sucesso!")
    console.log("\n📊 Resumo:")
    console.log(`   • ${obras.length} obras criadas`)
    console.log(`   • ${fiscalizacoes.length} fiscalizações criadas`)
    console.log("\n🚀 Você pode agora testar a API e o app mobile!")

    // Mostrar algumas obras criadas
    console.log("\n📋 Obras criadas:")
    obras.forEach((obra, index) => {
      console.log(`   ${index + 1}. ${obra.nome} - ${obra.status}`)
    })
  } catch (error) {
    console.error("❌ Erro ao popular database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("\n🔌 Desconectado do MongoDB")
  }
}

// Executar o script
populateDatabase()
