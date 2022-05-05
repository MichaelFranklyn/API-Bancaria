const { format } = require('date-fns')
let { contas, depositos, saques, transferencias } = require('../bancodedados.js')
const { validarCamposVazios, validarContaNumero, verificarSaldoSacar, validarValor } = require('./validadores.js')

function depositar(req, res) {
    const { numero_conta, valor } = req.body

    const validarCampoVazio = validarCamposVazios([numero_conta, valor])
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

    const mensagemValidarValor = validarValor(valor)
    if (mensagemValidarValor) {
        return res.status(400).json({ "mensagem": `${mensagemValidarValor}` })
    }

    contaSelecionada.saldo = contaSelecionada.saldo + valor
    const novoDeposito = {
        data: format(new Date(), "yyyy-MM-dd' 'k:m:s"),
        numero_conta: numero_conta,
        valor: valor
    }
    depositos.push(novoDeposito)
    return res.status(201).json()
}

function sacar(req, res) {
    const { numero_conta, valor, senha } = req.body

    const validarCampoVazio = validarCamposVazios([numero_conta, valor, senha])
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

    const mensagemValidarValor = validarValor(valor)
    if (mensagemValidarValor) {
        return res.status(400).json({ "mensagem": `${mensagemValidarValor}` })
    }

    const mensagemVerificarSaldo = verificarSaldoSacar(contaSelecionada, valor)
    if (mensagemVerificarSaldo) {
        return res.status(403).json({ "mensagem": `${mensagemVerificarSaldo}` })
    }

    contaSelecionada.saldo = contaSelecionada.saldo - valor
    const novoSaque = {
        data: format(new Date(), "yyyy-MM-dd' 'k:m:s"),
        numero_conta: numero_conta,
        valor: valor
    }
    saques.push(novoSaque)
    return res.status(201).json()
}

function transferir(req, res) {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    const validarCampoVazio = validarCamposVazios([numero_conta_origem, numero_conta_destino, valor, senha])
    if (validarCampoVazio) {
        return res.status(400).json({ "mensagem": `${validarCampoVazio}` })
    }

    const validacaoContaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })
    if (!validacaoContaOrigem) {
        return res.status(404).json({ "mensagem": "A conta bancária de origem não existe" })
    }

    const validacaoContaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })
    if (!validacaoContaDestino) {
        return res.status(404).json({ "mensagem": "A conta bancária de destino não existe" })
    }

    if (validacaoContaOrigem === validacaoContaDestino) {
        return res.status(404).json({ "mensagem": "A conta bancária de origem e a de destino são iguais" })
    }

    if (senha !== validacaoContaOrigem.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida" })
    }

    if (validacaoContaOrigem.saldo < valor) {
        return res.status(403).json({ "mensagem": "Saldo indisponível" })
    }

    validacaoContaOrigem.saldo = validacaoContaOrigem.saldo - valor
    validacaoContaDestino.saldo = validacaoContaDestino.saldo + valor
    const novaTransferencia = {
        data: format(new Date(), "yyyy-MM-dd' 'k:m:s"),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }
    transferencias.push(novaTransferencia)
    return res.status(201).json()
}

module.exports = {
    depositar,
    sacar,
    transferir
}