let contasBancarias = require('../bancodedados');
let proximoNumeroConta = 1;

const listarContas = (req, res) => {
    return res.status(200).json(contasBancarias.contas);
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(401).json({ "mensagem": "Todos os campos são obrigatórios" });
    }

    const cpfEmailExistente = contasBancarias.contas.find(contaExistente => contaExistente.usuario.cpf === cpf || contaExistente.usuario.email === email);


    if (cpfEmailExistente) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    let conta = {
        numero_conta: proximoNumeroConta,
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
    proximoNumeroConta++;
    contasBancarias.contas.push(conta);

    return res.status(201).send();

}

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numero_conta } = req.params

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(401).json({ "mensagem": "Todos os campos são obrigatórios" });
    }

    const contaExistente = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta));

    if (!contaExistente) {
        return res.status(404).json({ "mensagem": "Informe um número de conta válido" });
    }

    const cpfEmailExistente = contasBancarias.contas.find(contaExistente => contaExistente.usuario.cpf === cpf || contaExistente.usuario.email === email);


    if (cpfEmailExistente && cpfEmailExistente.numero_conta !== contaExistente.numero_conta) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    }


    contaExistente.usuario.nome = nome;
    contaExistente.usuario.cpf = cpf;
    contaExistente.usuario.data_nascimento = data_nascimento;
    contaExistente.usuario.telefone = telefone;
    contaExistente.usuario.email = email;
    contaExistente.usuario.senha = senha

    return res.status(201).send();

}

const deletarConta = (req, res) => {
    const { numero_conta } = req.params
    const contaExistente = contasBancarias.contas.find(conta => conta.numero_conta === Number(numero_conta));

    if (!contaExistente) {
        return res.status(404).json({ "mensagem": "Informe um número de conta válido" });
    }

    if (contaExistente.saldo > 0 || contaExistente.saldo < 0) {
        return res.status(401).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }

    contasBancarias.contas.splice(contaExistente, 1);

    return res.status(201).send();

}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    deletarConta
}