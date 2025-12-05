USE autoservicio_db;

-- ========================================
-- TIPOS DE PRODUCTOS
-- ========================================
INSERT INTO tipos (nombre)
VALUES ('Remeras'),('Buzos');

-- ========================================
-- USUARIOS (Admins y Staff)
-- ========================================
-- Password para todos: Admin123!

INSERT INTO usuarios (nombre, email, password, admin, updated_by, created_by) VALUES
    ('Admin main', 'admin@autoservicio.com', '$2a$12$Gq2Hu.4U620oWdKaR4TCOub0sLGDQ0gAk4T8z9xk8/hhO1Ojq9OB6', TRUE, 1, 1),
    ('Xavi Admin', 'xavi@autoservicio.com', '$2a$12$Gq2Hu.4U620oWdKaR4TCOub0sLGDQ0gAk4T8z9xk8/hhO1Ojq9OB6', TRUE, 1, 1),
    ('Gabi Admin', 'gabi@autoservicio.com', '$2a$12$Gq2Hu.4U620oWdKaR4TCOub0sLGDQ0gAk4T8z9xk8/hhO1Ojq9OB6', TRUE, 1, 1)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ========================================
-- CLIENTES
-- ========================================
INSERT INTO clientes (nombre, telefono, email) VALUES
    ('Pedro Martinez', '1145678901', 'pedro@email.com'),
    ('Laura Fernandez', '1156789012', 'laura@email.com'),
    ('Diego Rodriguez', '1167890123', 'diego@email.com'),
    ('Sofia Ramirez', '1178901234', 'sofia@email.com'),
    ('Martin Castro', '1189012345', 'martin@email.com'),
    ('Lucia Romero', '1190123456', 'lucia@email.com'),
    ('Facundo Torres', '1101234567', 'facundo@email.com'),
    ('Valentina Gomez', '1112345678', 'valentina@email.com'),
    ('Santiago Diaz', '1123456789', 'santiago@email.com'),
    ('Camila Ruiz', '1134567890', 'camruiz@email.com')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- ========================================
-- PRODUCTOS - REMERAS (tipo 1)
-- ========================================
INSERT INTO productos (titulo, precio, stock, descripcion, sku, url_image, id_usuario, id_tipo, activo) VALUES
    ('Remera Lisa Negra', 45000.00, 25, 'Remera de algodón 100% talle S a XXL', 'REM-LIS-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_650888-MLA92177569116_092025-F.webp', 1, 1, TRUE),
    ('Remera Lisa Blanca', 45000.00, 30, 'Remera de algodón 100% talle S a XXL', 'REM-LIS-BLA-001', 'https://http2.mlstatic.com/D_Q_NP_851422-MLA97241219629_112025-F.webp', 1, 1, TRUE),
    ('Remera Lisa Gris', 45000.00, 28, 'Remera de algodón 100% talle S a XXL', 'REM-LIS-GRI-001', 'https://http2.mlstatic.com/D_Q_NP_609390-MLA96785629868_112025-F.webp', 1, 1, TRUE),
    ('Remera Estampada Gato', 52000.00, 20, 'Remera con estampado gato', 'REM-EST-GAT-001', 'https://http2.mlstatic.com/D_Q_NP_612264-MLA90975670112_082025-F.webp', 1, 1, TRUE),
    ('Remera Estampada Rayas', 50000.00, 22, 'Remera a rayas horizontales', 'REM-EST-RAY-001', 'https://http2.mlstatic.com/D_Q_NP_932259-MLA97444141051_112025-F.webp', 1, 1, TRUE),
    ('Remera Deportiva Nike', 35000.00, 15, 'Remera técnica para deporte', 'REM-DEP-NIK-001', 'https://http2.mlstatic.com/D_Q_NP_971175-MLA74667190426_022024-F.webp', 2, 1, TRUE),
    ('Remera Deportiva Adidas', 52000.00, 18, 'Remera técnica para deporte', 'REM-DEP-ADI-001', 'https://http2.mlstatic.com/D_Q_NP_731246-MLA80926570436_122024-F.webp', 2, 1, TRUE),
    ('Remera Oversize Negra', 68000.00, 12, 'Remera corte oversize', 'REM-OVE-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_610045-MLA84422571729_052025-F.webp', 1, 1, TRUE),
    ('Remera V-Neck Blanca', 28000.00, 25, 'Remera cuello en V', 'REM-VNE-BLA-001', 'https://http2.mlstatic.com/D_Q_NP_858950-MLA94925576588_102025-F.webp', 1, 1, TRUE),
    ('Remera Oversize Estampada', 29000.00, 20, 'Remera manga larga básica', 'REM-MLA-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_749615-MLA93665449516_102025-F.webp', 1, 1, TRUE),
    ('Remera Oversize Gris', 25000.00, 18, 'Remera manga larga básica', 'REM-MLA-GRI-001', 'https://http2.mlstatic.com/D_Q_NP_957230-MLA98556254689_112025-F.webp', 1, 1, TRUE),
    ('Remera Estampada Banda', 62000.00, 15, 'Remera con estampado de banda', 'REM-EST-BAN-001', 'https://http2.mlstatic.com/D_Q_NP_645875-MLA96871866687_102025-F.webp', 1, 1, TRUE),
    ('Remera Deportiva Roja', 75000.00, 14, 'Remera tipo deportiva roja', 'REM-DEP-ROJ-001', 'https://http2.mlstatic.com/D_Q_NP_911884-MLA92003649008_092025-F.webp', 3, 1, TRUE),
    ('Remera Musculosa Negra', 75000.00, 16, 'Remera tipo musculosa negra', 'REM-MUS-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_863721-MLA96650416862_112025-F.webp', 3, 1, TRUE)
ON DUPLICATE KEY UPDATE titulo=titulo;

-- ========================================
-- PRODUCTOS - BUZOS (tipo 2)
-- ========================================
INSERT INTO productos (titulo, precio, stock, descripcion, sku, url_image, id_usuario, id_tipo, activo) VALUES
    ('Buzo Canguro Negro', 60000.00, 18, 'Buzo con capucha y bolsillo delantero', 'BUZ-CAN-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_851005-MLA87569621725_072025-F.webp', 1, 2, TRUE),
    ('Buzo Canguro Gris', 6500.00, 20, 'Buzo con capucha y bolsillo delantero', 'BUZ-CAN-GRI-001', 'https://http2.mlstatic.com/D_Q_NP_902794-MLA84311998925_052025-F.webp', 1, 2, TRUE),
    ('Buzo Canguro Azul', 6500.00, 15, 'Buzo con capucha y bolsillo delantero', 'BUZ-CAN-AZU-001', 'https://http2.mlstatic.com/D_Q_NP_695738-MLA84341994850_052025-F.webp', 1, 2, TRUE),
    ('Buzo sin Capucha Negro', 58000.00, 22, 'Buzo cuello redondo básico', 'BUZ-SIN-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_660400-MLA96309480786_102025-F.webp', 1, 2, TRUE),
    ('Buzo sin Capucha Gris', 5500.00, 24, 'Buzo cuello redondo básico', 'BUZ-SIN-GRI-001', 'https://http2.mlstatic.com/D_Q_NP_793692-MLA85572618572_062025-F.webp', 1, 2, TRUE),
    ('Buzo con Cierre Negro', 5500.00, 14, 'Buzo con cierre frontal y capucha', 'BUZ-CIE-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_988675-MLA96525499071_102025-F.webp', 1, 2, TRUE),
    ('Buzo con Cierre Azul', 5500.00, 12, 'Buzo con cierre frontal y capucha', 'BUZ-CIE-AZU-001', 'https://http2.mlstatic.com/D_Q_NP_852413-MLA54984131052_042023-F.webp', 1, 2, TRUE),
    ('Buzo Deportivo Nike', 68000.00, 10, 'Buzo técnico para deporte', 'BUZ-DEP-NIK-001', 'https://http2.mlstatic.com/D_Q_NP_960753-MLA86884469824_072025-F.webp', 1, 2, TRUE),
    ('Buzo Deportivo Adidas', 67800.00, 12, 'Buzo técnico para deporte', 'BUZ-DEP-ADI-001', 'https://http2.mlstatic.com/D_Q_NP_837912-MLA46405536192_062021-F.webp', 1, 2, TRUE),
    ('Buzo Oversize Negro', 54500.00, 10, 'Buzo corte oversize con capucha', 'BUZ-OVE-NEG-001', 'https://http2.mlstatic.com/D_Q_NP_919501-MLA94554627323_102025-F.webp', 1, 2, TRUE),
    ('Buzo Estampado Banda', 55200.00, 8, 'Buzo con estampado de banda', 'BUZ-EST-BAN-001', 'https://http2.mlstatic.com/D_Q_NP_802108-CBT98319016490_112025-F.webp', 1, 2, TRUE),
    ('Buzo Crewneck Gris', 41800.00, 16, 'Buzo cuello redondo clásico', 'BUZ-CRE-GRI-001', 'https://http2.mlstatic.com/D_Q_NP_762921-MLA74692363214_022024-F.webp', 1, 2, TRUE)
ON DUPLICATE KEY UPDATE titulo=titulo;

-- ========================================
-- CARRITOS
-- ========================================
INSERT INTO carritos(id_cliente, estado, created_at, updated_at) VALUES
    (1, 'convertido', '2025-11-05 15:30:00', '2025-11-05 15:30:00'),
    (2, 'abandonado', '2025-11-05 15:30:00', '2025-11-05 15:30:00'),
    (3, 'abandonado', '2025-11-08 15:30:00', '2025-11-08 15:30:00'),
    (4, 'convertido', '2025-11-09 15:30:00', '2025-11-09 15:30:00'),
    (5, 'convertido', '2025-11-11 15:30:00', '2025-11-11 15:30:00'),
    (6, 'convertido', '2025-11-12 15:30:00', '2025-11-12 15:30:00'),
    (7, 'abandonado', '2025-11-18 15:30:00', '2025-11-18 15:30:00'),
    (8, 'convertido', '2025-11-20 15:30:00', '2025-11-20 15:30:00'),
    (9, 'convertido', '2025-11-29 15:30:00', '2025-11-29 15:30:00'),
    (10, 'convertido', '2025-12-01 15:30:00', '2025-12-01 15:30:00');

-- ========================================
-- CARRITOS_ITEMS
-- ========================================

-- Carrito 1 (Cliente 1) - 3 productos - 05/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (1, 2, 1, 45000.00, 45000.00, '2025-11-05 15:30:00', '2025-11-05 15:30:00'),
    (1, 15, 2, 60000.00, 120000.00, '2025-11-05 15:32:00', '2025-11-05 15:32:00'),
    (1, 8, 1, 68000.00, 68000.00, '2025-11-05 15:35:00', '2025-11-05 15:35:00');

-- Carrito 2 (Cliente 2) - 4 productos - 05/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (2, 1, 2, 45000.00, 90000.00, '2025-11-05 16:10:00', '2025-11-05 16:10:00'),
    (2, 17, 1, 6500.00, 6500.00, '2025-11-05 16:12:00', '2025-11-05 16:12:00'),
    (2, 4, 1, 52000.00, 52000.00, '2025-11-05 16:15:00', '2025-11-05 16:15:00'),
    (2, 20, 1, 58000.00, 58000.00, '2025-11-05 16:18:00', '2025-11-05 16:18:00');

-- Carrito 3 (Cliente 3) - 2 productos - 08/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (3, 6, 1, 35000.00, 35000.00, '2025-11-08 10:20:00', '2025-11-08 10:20:00'),
    (3, 16, 2, 6500.00, 13000.00, '2025-11-08 10:25:00', '2025-11-08 10:25:00');

-- Carrito 4 (Cliente 4) - 5 productos - 09/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (4, 3, 1, 45000.00, 45000.00, '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
    (4, 7, 1, 52000.00, 52000.00, '2024-11-09 14:33:00', '2025-11-09 14:33:00'),
    (4, 15, 1, 60000.00, 60000.00, '2025-11-09 14:36:00', '2025-11-09 14:36:00'),
    (4, 24, 1, 68000.00, 68000.00, '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
    (4, 10, 2, 29000.00, 58000.00, '2025-11-09 14:45:00', '2025-11-09 14:45:00');

-- Carrito 5 (Cliente 5) - 3 productos - 11/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (5, 12, 1, 62000.00, 62000.00, '2025-11-11 11:15:00', '2025-11-11 11:15:00'),
    (5, 18, 2, 6500.00, 13000.00, '2025-11-11 11:20:00', '2025-11-11 11:20:00'),
    (5, 5, 1, 50000.00, 50000.00, '2025-11-11 11:25:00', '2025-11-11 11:25:00');

-- Carrito 6 (Cliente 6) - 4 productos - 12/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (6, 9, 2, 28000.00, 56000.00, '2025-11-12 16:45:00', '2025-11-12 16:45:00'),
    (6, 22, 1, 5500.00, 5500.00, '2025-11-12 16:48:00', '2025-11-12 16:48:00'),
    (6, 13, 1, 75000.00, 75000.00, '2025-11-12 16:52:00', '2025-11-12 16:52:00'),
    (6, 26, 1, 41800.00, 41800.00, '2025-11-12 16:55:00', '2025-11-12 16:55:00');

-- Carrito 7 (Cliente 7) - 2 productos - 18/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (7, 11, 3, 25000.00, 75000.00, '2025-11-18 09:30:00', '2025-11-18 09:30:00'),
    (7, 19, 1, 5500.00, 5500.00, '2025-11-18 09:35:00', '2025-11-18 09:35:00');

-- Carrito 8 (Cliente 8) - 5 productos - 20/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (8, 1, 1, 45000.00, 45000.00, '2025-11-20 13:20:00', '2025-11-20 13:20:00'),
    (8, 2, 1, 45000.00, 45000.00, '2025-11-20 13:22:00', '2025-11-20 13:22:00'),
    (8, 3, 1, 45000.00, 45000.00, '2025-11-20 13:24:00', '2025-11-20 13:24:00'),
    (8, 25, 1, 67800.00, 67800.00, '2025-11-20 13:28:00', '2025-11-20 13:28:00'),
    (8, 26, 1, 41800.00, 41800.00, '2025-11-20 13:32:00', '2025-11-20 13:32:00');

-- Carrito 9 (Cliente 9) - 3 productos - 29/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (9, 14, 2, 75000.00, 150000.00, '2025-11-29 10:15:00', '2025-11-29 10:15:00'),
    (9, 23, 1, 5500.00, 5500.00, '2025-11-29 10:18:00', '2025-11-29 10:18:00'),
    (9, 4, 1, 52000.00, 52000.00, '2025-11-29 10:22:00', '2025-11-29 10:22:00');

-- Carrito 10 (Cliente 10) - 4 productos - 29/11/2025
INSERT INTO carrito_items(id_carrito, id_producto, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES
    (10, 8, 1, 68000.00, 68000.00, '2025-12-01 15:30:00', '2025-12-01 15:30:00'),
    (10, 21, 1, 5500.00, 5500.00, '2025-12-01 15:30:00', '2025-12-01 15:30:00'),
    (10, 26, 1, 41800.00, 41800.00, '2025-12-01 15:30:00', '2025-12-01 15:30:00'),
    (10, 6, 2, 35000.00, 70000.00, '2025-12-01 01:30:00', '2025-12-01 01:30:00');

-- ========================================
-- VENTAS
-- ========================================

INSERT INTO ventas(id_carrito, id_cliente, total, estado, metodo_pago, created_at, updated_at) VALUES
    (1, 1, 233000, 'completado', 'efectivo', '2025-11-05 15:30:00', '2025-11-05 15:30:00'),
    (2, 2, 206500, 'cancelado', 'transferencia', '2025-11-05 15:30:00', '2025-11-05 15:30:00'),
    (3, 3, 48000, 'cancelado', 'efectivo', '2025-11-08 15:30:00', '2025-11-08 15:30:00'),
    (4, 4, 283000, 'completado', 'efectivo', '2025-11-09 14:33:00', '2025-11-09 14:33:00'),
    (5, 5, 125000, 'completado', 'transferencia', '2025-11-11 11:15:00', '2025-11-11 11:15:00'),
    (6, 6, 178300, 'completado', 'efectivo', '2025-11-12 16:45:00', '2025-11-12 16:45:00'),
    (7, 7, 80500, 'completado', 'efectivo', '2025-11-18 09:30:00', '2025-11-18 09:30:00'),
    (8, 8, 244600, 'procesando', 'transferencia', '2025-11-20 13:20:00', '2025-11-20 13:20:00'),
    (9, 9, 207500, 'pendiente', 'transferencia', '2025-11-20 13:20:00', '2025-11-20 13:20:00'),
    (10, 10, 185300, 'procesando', 'efectivo', '2025-12-01 01:20:00', '2025-12-01 01:20:00');