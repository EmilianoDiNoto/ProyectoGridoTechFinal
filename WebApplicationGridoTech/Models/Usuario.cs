using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Data;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Models
{
    public class Usuario
    {


        public int UserID { get; set; }
        public string UserName { get; set; }
        public string UserLastName { get; set; }
        public string UserPass { get; set; }
        public int RolID { get; set; }
        public string Email { get; set; }  // Agregamos email para recuperación de contraseña
        public string ResetToken { get; set; }  // Para el token de recuperación
        public DateTime? ResetTokenExpiry { get; set; }  // Fecha de expiración del token


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

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}