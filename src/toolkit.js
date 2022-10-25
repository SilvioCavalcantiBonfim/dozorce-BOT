module.exports = {
    equals: (object1, object2) => {
        // Realiza a verificação das propriedades dos objetos.
        var prop1 = Object.getOwnPropertyNames(object1);
        var prop2 = Object.getOwnPropertyNames(object1);
    
        // Realiza a verificação se ambos objetos possuem o mesmo número de 
        // propriedades. Caso contrário, já retorna dizendo que são diferentes.
        if(prop1.length !== prop2.length)
            return false;
    
        // Aqui, está sendo verificado se o objeto possui alguma propriedade.
        // Será usado quando for chamada a função na sua forma recursiva,
        // para verificar valores literais.
        if(prop1.length === 0)
            if(object1 === object2)
                return true;
            else
                return false;
    
        // Se forem iguais, realiza uma iteração por todas as propriedades.
        for(var i = 0; i < prop1.length; i++) {
        // Guarda o valor da propriedade atual na variável "prop".
            var prop = prop1[i];
    
        // Aqui está o pulo do gato.
        // Verifica se o valor e o tipo das duas propriedades são iguais.
        // Se sim, somente pula para a próxima iteração. Caso contrário,
        // podem ser duas coisas: ou são realmente distintos, ou é um objeto,
        // que, ao comparar as referências, retorna sempre falso.
        // Para ter certeza da informação, é chamada a mesma função de forma
        // recursiva, mandando, por parâmetro, os dois objetos que ficou a dúvida.
        // Se forem iguais, ou se tiverem mais algum objeto internamente, 
        // a função continuará a ser chamada recursivamente, até chegar ao
        // ponto de ser um valor literal. Ou, então, retornará falso, pois não
        // são iguais.
        // Caso sejam iguais, a função só continuará para a próxima iteração.
        // Caso contrário, a função já informa que não são dois objetos iguais.
            if(object1[prop] !== object2[prop]){
                if(equals(object1[prop], object2[prop]))
                    continue;
                else
                    return false;
            }
        }
        // Se chegou até aqui e aguentou todas as verificações...
        // Os objetos são iguais!
        return true;
    }
}