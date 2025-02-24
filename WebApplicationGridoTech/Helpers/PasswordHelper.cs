using System;
using System.Security.Cryptography;
using System.Text;

namespace WebApplicationGridoTech.Helpers
{
    public static class PasswordHelper
    {
        // Constante para el salting (para mayor seguridad)
        private const string Salt = "GridoTechAdv@nce2024";

        /// <summary>
        /// Encripta una contraseña utilizando algoritmo SHA256
        /// </summary>
        /// <param name="password">Contraseña en texto plano</param>
        /// <returns>Contraseña encriptada</returns>
        public static string EncryptPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                return string.Empty;

            // Combinar contraseña con salt
            string passwordWithSalt = string.Concat(password, Salt);

            // Crear instancia de SHA256
            using (SHA256 sha256 = SHA256.Create())
            {
                // Convertir la cadena a bytes
                byte[] bytes = Encoding.UTF8.GetBytes(passwordWithSalt);

                // Calcular el hash
                byte[] hash = sha256.ComputeHash(bytes);

                // Convertir el hash a cadena hexadecimal
                StringBuilder result = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    result.Append(hash[i].ToString("x2"));
                }

                return result.ToString();
            }
        }

        /// <summary>
        /// Verifica si la contraseña ingresada coincide con la contraseña encriptada
        /// </summary>
        /// <param name="enteredPassword">Contraseña ingresada por el usuario</param>
        /// <param name="storedPassword">Contraseña almacenada (encriptada)</param>
        /// <returns>True si las contraseñas coinciden, False en caso contrario</returns>
        public static bool VerifyPassword(string enteredPassword, string storedPassword)
        {
            if (string.IsNullOrEmpty(enteredPassword) || string.IsNullOrEmpty(storedPassword))
                return false;

            string encryptedEnteredPassword = EncryptPassword(enteredPassword);
            return string.Equals(encryptedEnteredPassword, storedPassword, StringComparison.OrdinalIgnoreCase);
        }
    }
}