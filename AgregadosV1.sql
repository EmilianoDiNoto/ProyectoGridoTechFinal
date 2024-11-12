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


select * from [dbo].[Products]




