function validarEmail(contas, email) {
    const validacaoEmail = contas.find((conta) => {
        return email === conta.usuario.email
    })

    if (validacaoEmail) {
        return "Já existe uma conta com o e-mail informado!"
    }
}

function validarCpf(contas, cpf) {
    const validacaoCpf = contas.find((conta) => {
        return cpf === conta.usuario.cpf
    })

    if (validacaoCpf) {
        return "Já existe uma conta com o cpf informado!"
    }
}

function validarCamposVazios(parametros) {
    const validacao = parametros.some((p) => {
        return !p
    })
    if(validacao) {
        return "Informe todos os campos"
    }
}

function validarContaNumero(contaSelecionada) {
    if (!contaSelecionada) {
        return "O número da conta não existe"
    }
}

function verificarSaldoExclusao(contaSelecionada) {
    if (contaSelecionada.saldo !== 0) {
        return "A conta só pode ser removida se o saldo for zero!"
    }
}

function verificarSaldoSacar(contaSelecionada, valor) {
    if (contaSelecionada.saldo < valor) {
        return "A conta não tem saldo disponível"
    }
}

function validarValor(valor) {
    if (valor <= 0) {
        return "Informe um valor válido"
    }
}

module.exports = {
    validarEmail,
    validarCpf, 
    validarCamposVazios,
    validarContaNumero,
    verificarSaldoExclusao,
    verificarSaldoSacar,
    validarValor
}