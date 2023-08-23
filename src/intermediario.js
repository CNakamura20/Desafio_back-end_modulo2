const validarSenha = (req, res, next) => {
    const { senha } = req.query;
    if (!senha) {
        return res.status(401).json({ "mensagem": "senha não informada" });
    }

    if (senha !== 'Cubos123Bank') {
        return res.status(401).json({ "mensagem": "A senha do banco informada é inválida!" });
    }

    next();

}

module.exports = validarSenha;