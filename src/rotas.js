const express = require('express')
const { depositar, sacar, transferir } = require('./controladores/transacoes.js')
const { listarContas, criarConta, atualizarUsuario, excluirConta, saldo, extrato } = require('./controladores/contas.js')
const rotas = express()

rotas.get('/contas', listarContas)
rotas.post('/contas', criarConta)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/contas/saldo', saldo)
rotas.get('/contas/extrato', extrato)

module.exports = rotas