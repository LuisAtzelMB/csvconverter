"use client"; // Para el uso de estados
import { useState } from "react"; // Hook de React para manejar estados
import Papa from "papaparse"; // Librería para parsear CSV
import React from "react";
import Image from "next/image";

// Componente principal
const CSVConverter = () => {
  // Estados del componente:
  const [file, setFile] = useState(null); // Guarda el archivo CSV subido
  const [convertedData, setConvertedData] = useState(null); // Almacena los datos convertidos
  const [downloadReady, setDownloadReady] = useState(false); // Controla si la descarga está lista
  const [error, setError] = useState(null); // Maneja mensajes de error

  // **Función que maneja la selección del archivo CSV**
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Guarda el archivo seleccionado
    setDownloadReady(false); // Reinicia el estado de descarga
    setError(null); // Limpia errores previos
  };

  // **Función que convierte un usuario de WordPress a formato Moodle**
  const convertToMoodleFormat = (wpUser) => {
    // Validación: Si no tiene user_login o user_email, se ignora
    if (!wpUser.user_login || !wpUser.user_email) {
      return null;
    }

    // Retorna un objeto con la estructura de Moodle
    return {
      id: "", // Vacío para que Moodle lo autoasigne
      auth: "manual", // Método de autenticación manual
      confirmed: 1, // Usuario confirmado
      policyagreed: 0, // No ha aceptado políticas
      deleted: 0, // No está eliminado
      suspended: 0, // No está suspendido
      mnethostid: 1, // ID del host (Moodle Network)
      username: wpUser.user_login.trim(), // Nombre de usuario (sin espacios)
      password: wpUser.user_pass || "", // Contraseña (o vacío)
      idnumber: "", // Sin ID numérico
      firstname: (wpUser.display_name || "").split(" ")[0] || "N/A", // Primer nombre
      lastname:
        (wpUser.display_name || "").split(" ").slice(1).join(" ") || "N/A", // Apellido
      email: wpUser.user_email.trim(), // Email (sin espacios)
      emailstop: 0, // No detener correos
      phone1: "", // Teléfono 1 (vacío)
      phone2: "", // Teléfono 2 (vacío)
      institution: "", // Institución (vacío)
      department: "", // Departamento (vacío)
      address: "", // Dirección (vacío)
      city: "", // Ciudad (vacío)
      country: "", // País (vacío)
      lang: "es", // Idioma español
      calendartype: "gregorian", // Calendario gregoriano
      theme: "", // Tema (vacío)
      timezone: "99", // Zona horaria por defecto
      firstaccess: "", // Primer acceso (vacío)
      lastaccess: "", // Último acceso (vacío)
      lastlogin: "", // Último login (vacío)
      currentlogin: "", // Login actual (vacío)
      lastip: "", // Última IP (vacío)
      secret: "", // Secreto (vacío)
      picture: "", // Imagen (vacío)
      description: "", // Descripción (vacío)
      descriptionformat: 1, // Formato HTML
      mailformat: 1, // Formato de correo HTML
      maildigest: 0, // No recibe resúmenes
      maildisplay: 2, // Muestra email a todos
      autosubscribe: 1, // Suscripción automática
      trackforums: 0, // No rastrea foros
      timecreated: wpUser.user_registered
        ? Math.floor(new Date(wpUser.user_registered).getTime() / 1000) // Timestamp de registro
        : Math.floor(Date.now() / 1000), // Timestamp actual si no hay fecha
      timemodified: Math.floor(Date.now() / 1000), // Fecha de modificación (ahora)
      trustbitmask: 0, // Nivel de confianza
      imagealt: "", // Texto alternativo (vacío)
      lastnamephonetic: "", // Apellido fonético (vacío)
      firstnamephonetic: "", // Nombre fonético (vacío)
      middlename: "", // Segundo nombre (vacío)
      alternatename: "", // Nombre alternativo (vacío)
      moodlenetprofile: "", // Perfil MoodleNet (vacío)
    };
  };

  // **Función que procesa el CSV y lo convierte al formato Moodle**
  const handleConvert = () => {
    if (!file) {
      setError("Por favor selecciona un archivo primero");
      return;
    }

    Papa.parse(file, {
      header: true, // Interpreta la primera fila como encabezados
      skipEmptyLines: true, // Ignora líneas vacías (solución al problema del usuario vacío)
      complete: (results) => {
        // Filtra y convierte los datos:
        const moodleData = results.data
          .map(convertToMoodleFormat) // Convierte cada usuario
          .filter((user) => user !== null); // Elimina usuarios inválidos

        if (moodleData.length === 0) {
          setError("El archivo no contiene usuarios válidos");
          return;
        }

        setConvertedData(moodleData); // Guarda los datos convertidos
        setDownloadReady(true); // Habilita la descarga
        setError(null); // Limpia errores
      },
      error: (error) => {
        console.error("Error al procesar el CSV:", error);
        setError("El archivo no es un CSV válido de WordPress");
      },
    });
  };

  // **Función que descarga el CSV convertido**
  const handleDownload = () => {
    if (!convertedData) return;

    // Convierte los datos a formato CSV:
    const csv = Papa.unparse(convertedData, {
      quotes: true, // Usa comillas para los valores
      delimiter: ";", // Separador punto y coma
      header: true, // Incluye encabezados
    });

    // Crea un Blob (archivo en memoria) y lo descarga:
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "moodle_users.csv"); // Nombre del archivo
    document.body.appendChild(link);
    link.click(); // Simula un clic para descargar
    document.body.removeChild(link); // Limpia el enlace
  };

  // **Renderizado del componente**
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sección de imagen (izquierda) */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/salonClases.jpg"
          alt="Salón de clases"
          fill
          className="object-cover h-full w-full"
          priority
        />
      </div>

      {/* Sección de formulario (derecha) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Conversor de CSV WordPress a Moodle
          </h1>

          {/* Mensaje de error (si existe) */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Selector de archivo */}
          <div className="mb-6">
            <label className="block mb-3 font-medium text-gray-700">
              Sube tu archivo CSV de WordPress:
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200 transition-colors"
            />
          </div>

          {/* Botón de conversión */}
          <button
            onClick={handleConvert}
            disabled={!file}
            className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              file
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Convertir a formato Moodle
          </button>

          {/* Sección de descarga (aparece después de la conversión) */}
          {downloadReady && (
            <div className="mt-8 p-5 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-green-700 mb-4">
                ¡Conversión completada! Se procesaron {convertedData.length}{" "}
                usuarios.
              </p>
              <button
                onClick={handleDownload}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Descargar CSV para Moodle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CSVConverter;
