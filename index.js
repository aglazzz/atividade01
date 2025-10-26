import express from 'express';

const host = '0.0.0.0';
const porta = 3000;
const server = express();

server.get('/', (req, res) => {
    res.send(`
        Calculador de Reajuste Salarial <br>
        Informe na URL os seguintes parametros: <br>
        /calcular?idade=&sexo=&salarioBase=&anoContratacao=&matricula= <br><br>
        Idade > 16 anos <br>
        Sexo = M ou F <br>
        Salario base valido <br>
        Ano de contratacao > 1960 <br>
        Matricula > 0 <br>
        `);
});

server.get('/calcular', (req, res) => {
    const idade = parseInt(req.query.idade);
    const sexo = req.query.sexo;
    const salarioBase = parseFloat(req.query.salarioBase);
    const anoContratacao = parseInt(req.query.anoContratacao);
    const matricula = parseInt(req.query.matricula);

    //validacao
    if(isNaN(idade) || idade <= 16 ||
    (sexo !== 'M' && sexo !== 'F') ||
    isNaN(salarioBase) || salarioBase <= 0 ||
    isNaN(anoContratacao) || anoContratacao <= 1960 ||
    isNaN(matricula) || matricula <= 0) {
        res.send('Parametros invalidos');
        return;
    }

    const anoAtual = new Date().getFullYear();
    const tempoContratacao = anoAtual - anoContratacao;

    let reajuste = 0;
    let desconto = 0;
    let acrescimo = 0;

    if (idade >= 18 && idade <= 39) {
        if (sexo === 'M') {
            reajuste = 0.10;
            desconto = 10;
            acrescimo = 17;
        } else {
            reajuste = 0.08;
            desconto = 11;
            acrescimo = 16;
        }
    } else if (idade >= 40 && idade <= 69) {
        if (sexo === 'M') {
            reajuste = 0.08;
            desconto = 5;
            acrescimo = 15;
        } else {
            reajuste = 0.10;
            desconto = 7;
            acrescimo = 14;
        }
    } else if (idade >= 70 && idade <= 99) {
        if (sexo === 'M') {
            reajuste = 0.15;
            desconto = 15;
            acrescimo = 13;
        } else {
            reajuste = 0.17;
            desconto = 17;
            acrescimo = 12;
        }
    } else {
        res.send("Idade invalida");
        return;
    }

    let novoSalario = salarioBase + (salarioBase * reajuste);
    if(tempoContratacao > 10){
        novoSalario += acrescimo;
    }else{
        novoSalario -= desconto;
    }

    res.send(`
        Matricula: ${matricula} <br>
        Idade: ${idade} <br>
        Sexo: ${sexo} <br>
        Salario Base: R$ ${salarioBase.toFixed(2)} <br>
        Ano de Contratacao: ${anoContratacao} <br>
        Tempo de Contratacao: ${tempoContratacao} anos <br>
        <b>Novo Salario: R$ ${novoSalario.toFixed(2)}</b>
        `);
});

server.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});