const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            // Se crean objetos para la lista
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`    
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`    
            },
            
        ]
    }
];

const questions = [
    {
      type: 'input',
      name: 'enter',
      message: `\nPresione ${'ENTER'.green} para continuar`,
    }
];

const inquirerMenu = async() => {
    //console.clear();
    console.log('========================='.green);
    console.log('  Seleccione una opción');
    console.log('=========================\n'.green);

    const {opcion} = await inquirer.prompt(preguntas) // para realizar una pregunta

    return opcion;
}

// Pausa de la aplicación 
const pausa = async() => {

    console.log('\n')
    await inquirer.prompt(questions);

}

const leerInput = async(message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            // se define función validate dentro de objeto
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;    // indica que la validación pasó
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;

}

const listarLugares = async(lugares = []) => {

    const choices = lugares.map( (lugar, i) => { // el método .map permite crear un nuevo arreglo
        
        const idx = `${i + 1}`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas) 

    return id;

}

const confirmar = async(message) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const {ok} = await inquirer.prompt(question);
    return ok;
}

const mostrarListadoChecklist = async(tareas = []) => {

    console.log('\n');

    const choices = tareas.map( (tarea, i) => { // el método .map permite crear un nuevo arreglo
        
        const idx = `${i + 1}`.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false    // si existe se pone en true, de lo contrario en false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',    // name indica lo que regresa
            message: 'Selecciones',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta); 
    return ids;

}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}