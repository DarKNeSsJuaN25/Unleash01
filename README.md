# Unleash01
En primer lugar, se ha creado un toggle llamado **task** para funcionar como activador. A este se le ha configurado con un 50% de rollout.
![image](https://github.com/DarKNeSsJuaN25/Unleash01/assets/68095284/0cf578fb-e039-4845-83b3-edfb89a6324b)

Tambien se debe crear un API Key para poder conectarse a nuestro codigo localmente.

![image](https://github.com/DarKNeSsJuaN25/Unleash01/assets/68095284/193db15e-1b4d-402f-b3fa-d4b422c9b7e9)

Luego, en el codigo se inicializa el Unleash como cliente de la siguiente manera.
````javascript
const unleashConfig = {
  appName: 'task',
  url: 'http://localhost:4242/api/',
  customHeaders: {
    Authorization : '*:development.3dd388362c9ddf9a13ae5353ee646ea1c42da802317b33fa2b8409c5'
  }
};

initialize(unleashConfig);

// Feature toggle function
function isFeatureEnabled(featureName) {
    // console.log("Llamado a la funcion");
   return isEnabled(featureName, {});
}
````
Ahora, dentro de nuestro endpoint debemos colocar la condicinal de activacion para que funcione la API GEOCODIGO.
````javascript
        if (isFeatureEnabled('task')){
            // LA NUEVA API
            console.log("Aqui");
            const response = await axios.get(URI_GEOCODING + `name=${place}`);
            res.send({"SEGUNDA API" : "GEOCODING","response": response.data});
            console.log(response.data.results);
        }else
        {
        //LA API YA IMPLEMENTADA
        }
````
De esta manera, cada vez que realizamos una busqueda, se tiene 50% de probabilidad de usar la antigua API y 50% de usar la nueva api. En las imagenes, se podra encontrar al inicio del JSON a que api pertenece el response.

![Captura desde 2023-11-15 21-03-16](https://github.com/DarKNeSsJuaN25/Unleash01/assets/68095284/d0743590-dc40-4a63-8468-f5e95da4cb0d)
Segunda API

![image](https://github.com/DarKNeSsJuaN25/Unleash01/assets/68095284/07568506-d789-4513-8421-bdb370762673)
Primera API
