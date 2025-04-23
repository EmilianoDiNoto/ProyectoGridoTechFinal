using System;
using System.Collections.Generic;

namespace WebApplicationGridoTech.Models
{
    public class TurnoRepository
    {
        private readonly string connectionString = @"Data Source=EMI-PC\EMI_PC_SERVER;Initial Catalog=GridoTech ; Integrated Security= True ";

        // Map estático para turnos (si no quieres crear una tabla en la base de datos)
        private static readonly Dictionary<string, int> turnoMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            { "MAÑANA", 1 },
            { "TARDE", 2 },
            { "NOCHE", 3 }
        };

        public int? GetTurnoIdByName(string turnoName)
        {
            if (turnoMap.TryGetValue(turnoName, out int turnoId))
            {
                return turnoId;
            }

            return null; // No se encontró el turno
        }
    }
}