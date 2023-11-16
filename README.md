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
app.get('/weather/:place', async (req, res) => {
    try {
        const place = req.params.place;
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
      }
  //RESTO DEL CODIGO
````
De esta manera, cada vez que realizamos una busqueda, se tiene 50% de probabilidad de usar la antigua API y 50% de usar la nueva api. En las imagenes, se podra encontrar al inicio del JSON a que api pertenece el response al buscar `http://localhost:8100/weather/lima` como parametro.

![image](https://github.com/DarKNeSsJuaN25/Unleash01/assets/68095284/94b55633-de69-4faf-950c-259a472ba641)
Primera API

![image](https://github.com/DarKNeSsJuaN25/Unleash01/assets/68095284/e4141059-d3dd-4899-bebb-69b3016177e2)
Segunda API

Podemos comprobar en **Unleash** los requests solicitados.

![image](https://github.com/DarKNeSsJuaN25/Unleash01/assets/68095284/e93839d1-8af5-44bb-8d3b-cb97746bb4ce)

