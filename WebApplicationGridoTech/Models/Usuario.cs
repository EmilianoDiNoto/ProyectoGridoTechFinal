using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    // Modelo principal de Usuario con todos los campos
    public class Usuario
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string UserLastName { get; set; }
        public string UserPass { get; set; }
        public int RolID { get; set; }
        public string RolName { get; set; } // Para mostrar el nombre del rol
        public string Email { get; set; }
        public string ProfileImage { get; set; } // Ruta o base64 de la imagen
        public bool UserState { get; set; } // true = Activo, false = Inactivo
        public string ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
    }

    // Clase para crear un nuevo usuario
    public class CreateUserRequest
    {
        public string UserName { get; set; }
        public string UserLastName { get; set; }
        public string UserPass { get; set; }
        public int RolID { get; set; }
        public string Email { get; set; }
        public string ProfileImage { get; set; }
    }

    // Clase para actualizar un usuario existente
    public class UpdateUserRequest
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string UserLastName { get; set; }
        public int RolID { get; set; }
        public string Email { get; set; }
        public string ProfileImage { get; set; }
    }

    // Clase para cambiar el estado de un usuario
    public class ChangeUserStateRequest
    {
        public int UserID { get; set; }
        public bool UserState { get; set; }
    }

    // Clase para cambiar la contraseña de un usuario
    public class ChangeUserPasswordRequest
    {
        public int UserID { get; set; }
        public string NewPassword { get; set; }
    }

    // Las clases existentes se mantienen
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }

    // Modelo para representar un rol
    public class Rol
    {
        public int RolID { get; set; }
        public string RolName { get; set; }
    }
}