let contasBancarias = require('../bancodedados');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const contaExistente = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta));

    if (!contaExistente) {
        return res.status(404).json({ "mensagem": "O número da conta e o valor são obrigatórios!" });
    }

    if (valor <= 0) {
        return res.status(404).json({ "mensagem": "Não é permitido depositos negativos" });
    }


    contaExistente.saldo += valor
    const registro = {
        "data": new Date().toDateString(),
        "numero_conta": contaExistente.numero_conta,
        "valor": valor
    }

    contasBancarias.depositos.push(registro);

    return res.status(201).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const contaExistente = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta));

    if (!contaExistente) {
        return res.status(404).json({ "mensagem": "O número da conta e o valor são obrigatórios!" });
    }

    if (valor <= 0) {
        return res.status(401).json({ "mensagem": "O valor não pode ser menor que zero!" });
    }
    if (senha !== contaExistente.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida" });
    }

    if (valor > contaExistente.saldo) {
        return res.status(401).json({ "mensagem": "Valor indisponível para saque" });
    }

    contaExistente.saldo -= valor
    const registro = {
        "data": new Date().toDateString(),
        "numero_conta": contaExistente.numero_conta,
        "valor": valor
    }

    contasBancarias.saques.push(registro);

    return res.status(201).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaOrigem = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta_origem));
    const contaDestino = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta_destino));

    if (!contaOrigem || !contaDestino) {
        return res.status(401).json({ "mensagem": "Conta de origem ou destino não encontrada" });
    }

    if (contaOrigem.numero_conta === contaDestino.numero_conta) {
        return res.status(400).json({ "mensagem": "Contas de origem e destino são iguais" });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida" });
    }

    if (valor > contaOrigem.saldo || contaOrigem.saldo <= 0) {
        return res.status(401).json({ "mensagem": "Saldo insuficiente!" });
    }
    console.log(contaOrigem);

    contaOrigem.saldo -= valor
    contaDestino.saldo += valor
    const registro = {
        "data": new Date().toDateString(),
        "numero_conta_origem": numero_conta_origem,
        "numero_conta_destino": numero_conta_destino,
        "valor": valor
    }

    contasBancarias.transferencias.push(registro);

    return res.status(201).send(registro);
}


const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(404).json({ "mensagem": "Numero da conta ou senha não informados" });
    }
    const contaExistente = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta));

    if (!contaExistente) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    if (senha !== contaExistente.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida" });
    }

    return res.status(201).json({
        "saldo": contaExistente.saldo
    });
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaExistente = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta));

    if (!numero_conta || !senha) {
        return res.status(404).json({ "mensagem": "Numero da conta ou senha não informados" });
    }

    if (!contaExistente) {
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    if (senha !== contaExistente.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida" });
    }
    const deposito = contasBancarias.depositos.find(deposito => deposito.numero_conta === Number(contaExistente.numero_conta));

    const saque = contasBancarias.saques.find(saque => saque.numero_conta === Number(contaExistente.numero_conta));

    const transferenciasEnviadas = contasBancarias.transferencias.find(transferencia => Number(transferencia.numero_conta_origem) === Number(contaExistente.numero_conta));

    const transferenciasRecebidas = contasBancarias.transferencias.find(transferencia => Number(transferencia.numero_conta_destino) === Number(contaExistente.numero_conta));



    return res.status(200).json({
        "depositos": deposito,
        "saques": saque,
        "tranferencias_enviadas": transferenciasEnviadas,
        "transferencias_recebidas": transferenciasRecebidas
    })


}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}