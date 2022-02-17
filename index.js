require('dotenv').config()  // configuración de variables de entorno

const { leerInput,
    inquirerMenu,
    listarLugares, 
    pausa} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async() => {

    console.clear();

    const busquedas = new Busquedas();
    let menu = '';


    do {

        menu = await inquirerMenu()
        
        switch(menu) {

            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;
                
                const lugarSel = lugares.find( l => l.id === id);
                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre)
                
                
                // Datos del Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                //console.log(clima)
                
                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la Ciudad\n'.green);
                console.log('Ciudad:',lugarSel.nombre.green);
                console.log('Latitud:',lugarSel.lat);
                console.log('Longitud:',lugarSel.lng);
                console.log('Temperatura:',clima.temp);
                console.log('T_Mínima:',clima.min);
                console.log('T_Máxima :',clima.max);
                console.log('Como está el clima :',clima.desc.green);

            break;
            
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green
                    console.log(`${idx} ${lugar}`);
                })
            break;
            
            case 0:

            break;
        }

        if( menu !== 0) await pausa();
        
    } while ( menu !== 0 );   
}

main();