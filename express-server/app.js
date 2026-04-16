const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // No olvides instalarlo: npm install cors
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
// Middleware
app.use(cors());          // Permite que Angular (puerto 4200) se conecte
app.use(express.json());  // Permite que tu servidor entienda el JSON que envía Angular
// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(express.json());
const destinosPath = path.join(__dirname, 'db', 'destinos.json');
// RUTAS
// 1. Obtener todos los destinos
app.get('/api/destinos', (req, res) => {
    try {
        const dbPath = path.join(__dirname, 'db', 'destinos.json');
        const data = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(data);
        // Enviamos el array directamente
        res.json(db);
    } catch (error) {
        console.warn("Error:", error);
        res.status(500).json({ error: "No se pudo leer el archivo" });
    }
});
app.get('/api/paises', (req, res) => {
    try {
        const dbPath = path.join(__dirname, 'db', 'paises.json');
        const data = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(data);
        res.json(db);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "No se pudo leer el archivo" });
    }
});

//app de translate
/*
    app.get('/api/translate/', (req, res, next) => res.json([
    { lang: req.query.lang, key: 'hola', value: 'Hola' + req.query.lang }
    ]));
*/
app.get('/api/translate/', (req, res) => {
    // 1. Obtenemos el idioma o ponemos 'es' por defecto si viene vacío
    const lang = req.query.lang || 'es';

    // 2. Definimos todos los textos en un solo sitio
    const traducciones = {
        'en': {
            'hola': 'Hi!',
            'lista_deseos': 'Wishlist',
            'destino_guardado': 'Destination saved'
        },
        'fr': {
            'hola': 'Bonjour!',
            'lista_deseos': 'Liste de souhaits',
            'destino_guardado': 'Destination enregistrée'
        },
        'es': {
            'hola': '¡Hola!',
            'lista_deseos': 'Lista de deseos',
            'destino_guardado': 'Destino guardado'
        }
    };

    // 3. Buscamos el idioma solicitado. Si no existe (ej: mandan 'it'), devolvemos español.
    const respuesta = traducciones[lang] || traducciones['es'];

    console.log(`Enviando traducción para: [${lang}]`, respuesta);

    // 4. Enviamos el objeto limpio
    res.json(respuesta);
});
// 2. Guardar un nuevo destino
app.post('/api/destinos', (req, res) => {
    try {
        const data = fs.readFileSync(destinosPath, 'utf8');
        const listaDestinos = JSON.parse(data);
        const nuevo = req.body;
        if (nuevo.votos === undefined) {
            nuevo.votos = 0;
        }
        // Buscamos si ya existe uno igual por nombre (para evitar que el bucle de sincronización duplique)
        const existe = listaDestinos.find(d => d.nombre === nuevo.nombre);
        if (existe) {
            return res.status(400).json({ error: "El destino ya existe" });
        }

        if (!nuevo.id || nuevo.id > 1000000000000) {
            // Si la lista está vacía, el max da -Infinity, por eso usamos Math.max con 0
            const maxId = listaDestinos.length > 0 ? Math.max(...listaDestinos.map(d => d.id)) : 0;
            nuevo.id = maxId + 1;
        }
        listaDestinos.push(nuevo);
        fs.writeFileSync(destinosPath, JSON.stringify(listaDestinos, null, 2));
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: "No se pudo guardar el destino" });
    }
});
app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});

// Ruta para eliminar un destino por nombre
app.delete('/api/destinos/:id', (req, res) => {
    const idAEliminar = parseInt(req.params.id); // Los params llegan como string
    try {
        let listaDestinos = JSON.parse(fs.readFileSync(destinosPath, 'utf8'));
        const inicial = listaDestinos.length;
        listaDestinos = listaDestinos.filter(d => d.id !== idAEliminar);

        if (listaDestinos.length < inicial) {
            fs.writeFileSync(destinosPath, JSON.stringify(listaDestinos, null, 2));
            res.status(200).json({ message: 'Eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Destino no encontrado en el archivo' });
        }
    }
    catch (error) {
        console.error("Error al eliminar en destinos.json:", error);
        res.status(500).json({ error: "No se pudo eliminar el destino" });
    }
});

// express-server/app.js

app.patch('/api/destinos/:id', (req, res) => {
    const idAActualizar = parseInt(req.params.id);
    const { votos } = req.body; // Recibimos el nuevo valor de votos desde el body;
    try {
        // 1. Leer el contenido actual del archivo
        const data = fs.readFileSync(destinosPath, 'utf8');
        const listaDestinos = JSON.parse(data);
        // 2. Comprobar si existe antes de filtrar (opcional, para mejor feedback)
        const destino = listaDestinos.find(d => d.id === idAActualizar);
        if (destino) {
            destino.votos = votos;
            fs.writeFileSync(destinosPath, JSON.stringify(listaDestinos, null, 2));
            res.json(destino);
        } else {
            res.status(404).json({ message: 'Destino no encontrado' });
        }
    }
    catch (error) {
        console.error("Error al actualizar los votos en destinos.json:", error);
        res.status(500).json({ error: "No se pudo actyalizar el destino" });
    }
});