Emi aca voy dejando sentencias nuevas.

modificacion de la vista Solicitudo Material.
alter VIEW V_GetAll_SolMaterial
as
select SolicitudID ORDEN, FechaSolicitud EMISION, Estado ESTADO from SolicitudesMateriales
go


Procedimiento Almacenado
create procedure SP_GetAll_SolMat
as
begin
select * from V_GetAll_SolMaterial
end
