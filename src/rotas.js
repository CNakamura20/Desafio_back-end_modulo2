const express = require('express');
const validarSenha = require('./intermediario');
const { listarContas, criarConta, atualizarUsuario, deletarConta } = require('./controladores/controlador');
const { depositar, sacar, transferir, saldo, extrato } = require('./controladores/transacoes');


const rotas = express();


rotas.get('/contas', validarSenha, listarContas);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numero_conta/usuario', atualizarUsuario);
rotas.delete('/contas/:numero_conta', deletarConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);



module.exports = rotas;