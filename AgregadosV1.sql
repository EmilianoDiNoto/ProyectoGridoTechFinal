-- NUEVOS SCRIPT

CREATE PROCEDURE SP_Update_WorkOrders
@OT INT,
@PRODUCTOID INT,
@CODIGO INT,
@DEMANDA INT,
@UM NVARCHAR(50),
@FECHACREADA DATETIME,
@FECHAMODIFICADA DATETIME,
@ESTADO NVARCHAR(50)
AS
BEGIN
UPDATE [dbo].[WorkOrders]
SET 
	ProductID = @PRODUCTOID,
	Quantity = @DEMANDA,
	UM = @UM,
	CreatedAt = @FECHACREADA,
	UpdatedAt = @FECHAMODIFICADA,
	Status = @ESTADO
	WHERE WorkOrderID = @OT
END
GO

ALTER VIEW V_WorkOrderMaterial AS
SELECT WM.WorkOrderID AS OT, M.MaterialName AS MATERIAL, WM.Quantity AS NECESIDAD
FROM     dbo.WorkOrderMaterials AS WM INNER JOIN
                  dbo.Materials AS M ON WM.MaterialID = M.MaterialID
GO

CREATE PROCEDURE SP_Get_WorkOrderMaterialOT
@OT INT
AS
BEGIN
 SELECT WM.WorkOrderID OT, M.MaterialName MATERIAL, WM.Quantity NECESIDAD, M.StockUnit UM, M.MaterialCod CODIGO FROM WorkOrderMaterials WM
 INNER JOIN Materials M
 ON WM.MaterialID=M.MaterialID
 WHERE WorkOrderID=@OT
END
GO

ALTER VIEW [dbo].[V_WorkOrderMaterial] AS
SELECT M.MaterialName MATERIAL, M.MaterialCod CODIGO , sum(WM.Quantity) NECESIDAD FROM WorkOrderMaterials WM
 INNER JOIN Materials M
 ON WM.MaterialID=M.MaterialID
 group by m.MaterialName, M.MaterialCod
GO

--12/11 Agregar columna NATO
ALTER TABLE [dbo].[Products]
ADD Nato nvarchar(50)
go

UPDATE Products
set Nato= 'GRIDO'
WHERE ProductID = 1
GO
UPDATE Products
set Nato= 'MOUSSE'
WHERE ProductID = 2
GO
UPDATE Products
set Nato= 'COOKIES'
WHERE ProductID = 3
GO
UPDATE Products
set Nato= 'GRIDO'
WHERE ProductID = 4
GO
UPDATE Products
set Nato= 'MOUSSE'
WHERE ProductID = 5
GO
UPDATE Products
set Nato= 'COOKIES'
WHERE ProductID = 6
GO
UPDATE Products
set Nato= 'GRIDO'
WHERE ProductID = 7
GO
UPDATE Products
set Nato= 'MOUSSE'
WHERE ProductID = 8
GO
UPDATE Products
set Nato= 'COOKIES'
WHERE ProductID = 9
GO
UPDATE Products
set Nato= 'GRIDO'
WHERE ProductID = 10
GO
UPDATE Products
set Nato= 'MOUSSE'
WHERE ProductID = 11
GO
UPDATE Products
set Nato= 'COOKIES'
WHERE ProductID = 12
GO
UPDATE Products
set Nato= 'GRIDO'
WHERE ProductID = 13
GO
UPDATE Products
set Nato= 'MOUSSE'
WHERE ProductID = 14
GO
UPDATE Products
set Nato= 'COOKIES'
WHERE ProductID = 15
GO


create view V_GetAll_ProductNato
as
select Nato from Products
GROUP BY Nato
go

create procedure SP_GetAll_ProductNato
as
begin
select * from V_GetAll_ProductNato
end
go


ALTER VIEW [dbo].[V_Products] AS
SELECT ProductCod AS CODIGO, ProductName AS PRODUCTO, Description AS DESCRIPCION, UM, Nato AS NATO
FROM     dbo.Products




