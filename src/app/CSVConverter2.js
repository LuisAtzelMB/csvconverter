"use client";
import { useState } from "react";
import Papa from "papaparse";
import React from "react";
import Image from "next/image";

const CSVConverter2 = () => {
  const [file, setFile] = useState(null);
  const [convertedData, setConvertedData] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadReady(false);
    setError(null);
  };

  const convertToMoodleFormat = (wpUser) => {
    if (!wpUser.user_login || !wpUser.user_email) {
      return null;
    }

    // Solo incluir las columnas necesarias
    return {
      username: wpUser.user_login.trim(),
      firstname: (wpUser.display_name || "").split(" ")[0] || "N/A",
      lastname:
        (wpUser.display_name || "").split(" ").slice(1).join(" ") || "N/A",
      email: wpUser.user_email.trim(),
    };
  };

  const handleConvert = () => {
    if (!file) {
      setError("Por favor selecciona un archivo primero");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const moodleData = results.data
          .map(convertToMoodleFormat)
          .filter((user) => user !== null);

        if (moodleData.length === 0) {
          setError("El archivo no contiene usuarios válidos");
          return;
        }

        setConvertedData(moodleData);
        setDownloadReady(true);
        setError(null);
      },
      error: (error) => {
        console.error("Error al procesar el CSV:", error);
        setError("El archivo no es un CSV válido de WordPress");
      },
    });
  };

  const handleDownload = () => {
    if (!convertedData) return;

    const csv = Papa.unparse(convertedData, {
      quotes: true,
      delimiter: ";",
      header: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "moodle_users_simplified.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/salonClases.jpg"
          alt="Salón de clases"
          fill
          className="object-cover h-full w-full"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Conversor de CSV WordPress a Moodle
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

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

export default CSVConverter2;
