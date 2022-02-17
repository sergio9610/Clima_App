const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        // TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() {

        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');    // se corta todo por los espacios
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ')   // se une por el espacio que se habia cortado
        });
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad(lugar = '') {

        try {
            // Petición http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/`,
                params: this.paramsMapBox
            });

            const resp = await instance.get(`${ lugar }.json`);

            // Se obtienen los datos de id, nombre y ubicación 
            return resp.data.features.map( lugar => ({  // regresar objeto de forma implicita
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            
            

        } catch (error) {
            return[];
        }

    }


    async climaLugar(lat,lon) {

        try {
            
            // intance axios.create()
            // Petición http
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instance.get();
            const { weather, main} = resp.data;
            
            // resp.data
            
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }


        } catch (error) {
            console.log(error);
        }
    }


    agregarHistorial(lugar = ''){
        // Prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5) // Así solo se mantienen 6 en el historial

        this.historial.unshift(lugar.toLocaleLowerCase());
        
        // Grabar en DB
        this.guardarDB();
        //this.leerDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify(payload));

    }

    leerDB() {

        if(fs.existsSync(this.dbPath)){
            const info = fs.readFileSync(this.dbPath, {encoding:'utf-8'})
            const data = JSON.parse(info) // parsear -> pasa el string a objeto
            //console.log(data)
            this.historial = data.historial;
        }
        return;


    }

}


module.exports = Busquedas;