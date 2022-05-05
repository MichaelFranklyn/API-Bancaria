let { banco, contas, depositos, saques, transferencias } = require('../bancodedados.js')
const { validarEmail, validarCpf, validarCamposVazios, validarContaNumero, verificarSaldoExclusao } = require('./validadores.js')
let numero = 1

function listarContas(req, res) {
    const { senha_banco } = req.query

    if (!senha_banco) {
        return res.status(403).json({ "mensagem": "A senha não foi informada" })
    }

    if (senha_banco !== banco.senha) {
        return res.status(403).json({ "mensagem": "A senha é inválida" })
    }

    return res.status(200).json(contas)
}

function criarConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const validarCampoVazio = validarCamposVazios([nome, cpf, data_nascimento, telefone, email, senha])
    if (validarCampoVazio) {
        return res.status(400).json({ "mensagem": `${validarCampoVazio}` })
    }

    const mensagemCpf = validarCpf(contas, cpf)
    if (mensagemCpf) {
        return res.status(400).json({ "mensagem": `${mensagemCpf}` })
    }

    const mensagemEMail = validarEmail(contas, email)
    if (mensagemEMail) {
        return res.status(400).json({ "mensagem": `${mensagemEMail}` })
    }

    const novaConta = {
        numero: numero++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    contas.push(novaConta)
    return res.status(201).json()
}

function atualizarUsuario(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { numeroConta } = req.params

    const validarCampoVazio = validarCamposVazios([nome, cpf, data_nascimento, telefone, email, senha])
    if (validarCampoVazio) {
        return res.status(400).json({ "mensagem": `${validarCampoVazio}` })
    }

    const contaSelecionada = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })
    const mensagemContaSelecionada = validarContaNumero(contaSelecionada)
    if (mensagemContaSelecionada) {
        return res.status(404).json({ "mensagem": `${mensagemContaSelecionada}` })
    }

    const contasDoBanco = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta)
    })

    const mensagemCpf = validarCpf(contasDoBanco, cpf)
    if (mensagemCpf) {
        return res.status(400).json({ "mensagem": `${mensagemCpf}` })
    }

    const mensagemEMail = validarEmail(contasDoBanco, email)
    if (mensagemEMail) {
        return res.status(400).json({ "mensagem": `${mensagemEMail}` })
    }

    contaSelecionada.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }
    return res.status(200).json()
}

function excluirConta(req, res) {
    const { numeroConta } = req.params

    const contaSelecionada = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })
    const mensagemContaSelecionada = validarContaNumero(contaSelecionada)
    if (mensagemContaSelecionada) {
        return res.status(404).json({ "mensagem": `${mensagemContaSelecionada}` })
    }

    const mensagemVerificarSaldo = verificarSaldoExclusao(contaSelecionada)
    if (mensagemVerificarSaldo) {
        return res.status(403).json({ "mensagem": `${mensagemVerificarSaldo}` })
    }

    const contasDoBanco = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta)
    })
    contas = contasDoBanco
    return res.status(200).json()
}

function saldo(req, res) {
    const { numero_conta, senha } = req.query

    const validarCampoVazio = validarCamposVazios([numero_conta, senha])
    if (validarCampoVazio) {
        return res.status(400).json({ "mensagem": `${validarCampoVazio}` })
    }

    const contaSelecionada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    const mensagemContaSelecionada = validarContaNumero(contaSelecionada)
    if (mensagemContaSelecionada) {
        return res.status(404).json({ "mensagem": `${mensagemContaSelecionada}` })
    }

    if (senha !== contaSelecionada.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida" })
    }

    return res.status(200).json({ "saldo": `${contaSelecionada.saldo}` })
}

function extrato(req, res) {
    const { numero_conta, senha } = req.query

    const validarCampoVazio = validarCamposVazios([numero_conta, senha])
    if (validarCampoVazio) {
        return res.status(400).json({ "mensagem": `${validarCampoVazio}` })
    }

    const contaSelecionada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    const mensagemContaSelecionada = validarContaNumero(contaSelecionada)
    if (mensagemContaSelecionada) {
        return res.status(404).json({ "mensagem": `${mensagemContaSelecionada}` })
    }

    if (senha !== contaSelecionada.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida" })
    }

    const listaDepositos = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta
    })
    const listaSaques = saques.filter((saques) => {
        return saques.numero_conta === numero_conta
    })
    const listaTransfEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta
    })
    const listaTransfRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta
    })

    return res.status(200).json({
        "depositos": listaDepositos,
        "saques": listaSaques,
        "transferenciasEnviadas": listaTransfEnviadas,
        "transferenciasRecebidas": listaTransfRecebidas
    })
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    saldo,
    extrato
}