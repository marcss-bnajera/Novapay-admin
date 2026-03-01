const corsOption = {
    // Permite que cualquiera acceda a la API
    origin: true,
    // Permite que la API envie y recia cookies
    credentials: true,
    // Establece los metodos permitidos en la API
    methods: "GET, POST, PUT, DELETE",
    // Define los headers que el cliente puede enviar
    allowHeadears: "Content-Type, Authorization"
}

export { corsOption }