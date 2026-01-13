<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

/* =========================
  CONFIGURACIÓN BD
========================= */
$host         = 'localhost';
$port         = '5432';
$bd           = 'registro_clientes_db';
$usuario      = 'postgres';
$contrasena   = 'admin123';
$nombre_tabla = 'clientes';

/* =========================
  CONEXIÓN
========================= */
try {
  $dsn = "pgsql:host=$host;port=$port;dbname=$bd";
  $conexion = new PDO($dsn, $usuario, $contrasena, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
      'success' => false,
      'message' => 'Error de conexión a la base de datos',
      'error' => $e->getMessage()
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

/* =========================
  LISTAR CLIENTES (GET)
========================= */
if ($method === 'GET' && $action === 'listar') {
  try {
      $sql = "SELECT id, nombre, apellido_paterno, apellido_materno,
                    email, telefono, direccion, producto, fecha
              FROM $nombre_tabla
              ORDER BY id DESC";

      $stmt = $conexion->prepare($sql);
      $stmt->execute();

      echo json_encode([
        'success' => true,
        'data' => $stmt->fetchAll()
      ], JSON_UNESCAPED_UNICODE);

  } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Error al obtener clientes',
        'error' => $e->getMessage()
      ], JSON_UNESCAPED_UNICODE);
  }
  exit;
}

/* =========================
  CREAR CLIENTE (POST)
========================= */
if ($method === 'POST' && $action === 'crear') {

  $data = json_decode(file_get_contents("php://input"), true);

  try {
      // Verificar email duplicado
      $check = $conexion->prepare("SELECT id FROM $nombre_tabla WHERE email = :email");
      $check->execute([':email' => $data['email']]);

      if ($check->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'El email ya está registrado'
        ], JSON_UNESCAPED_UNICODE);
        exit;
      }

      $sql = "INSERT INTO $nombre_tabla
              (nombre, apellido_paterno, apellido_materno, email, telefono, direccion, producto)
              VALUES
              (:nombre, :apellido_paterno, :apellido_materno, :email, :telefono, :direccion, :producto)";

      $stmt = $conexion->prepare($sql);
      $stmt->execute([
        ':nombre' => $data['nombre'],
        ':apellido_paterno' => $data['apellido_paterno'],
        ':apellido_materno' => $data['apellido_materno'],
        ':email' => $data['email'],
        ':telefono' => $data['telefono'],
        ':direccion' => $data['direccion'],
        ':producto' => $data['producto']
      ]);

      echo json_encode([
        'success' => true,
        'message' => 'Cliente registrado correctamente'
      ], JSON_UNESCAPED_UNICODE);

  } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Error al registrar cliente',
        'error' => $e->getMessage()
      ], JSON_UNESCAPED_UNICODE);
  }
  exit;
}

/* =========================
  ACTUALIZAR CLIENTE (PUT)
========================= */
if ($method === 'PUT' && $action === 'actualizar') {

  $id = $_GET['id'] ?? null;
  $data = json_decode(file_get_contents("php://input"), true);

   // Verificar email duplicado (excepto el mismo cliente)  
  $check = $conexion->prepare(
      "SELECT id FROM $nombre_tabla WHERE email = :email AND id != :id"
  );
  $check->execute([
      ':email' => $data['email'],
      ':id' => $id
  ]);

  if ($check->fetch()) {
      echo json_encode([
        'success' => false,
        'message' => 'Ese email ya pertenece a otro cliente'
      ], JSON_UNESCAPED_UNICODE);
      exit;
  }


  try {
      $sql = "UPDATE $nombre_tabla SET
                  nombre = :nombre,
                  apellido_paterno = :apellido_paterno,
                  apellido_materno = :apellido_materno,
                  email = :email,
                  telefono = :telefono,
                  direccion = :direccion,
                  producto = :producto
              WHERE id = :id";

      $stmt = $conexion->prepare($sql);
      $stmt->execute([
        ':nombre' => $data['nombre'],
        ':apellido_paterno' => $data['apellido_paterno'],
        ':apellido_materno' => $data['apellido_materno'],
        ':email' => $data['email'],
        ':telefono' => $data['telefono'],
        ':direccion' => $data['direccion'],
        ':producto' => $data['producto'],
        ':id' => $id
      ]);

      echo json_encode([
        'success' => true,
        'message' => 'Cliente actualizado correctamente'
      ], JSON_UNESCAPED_UNICODE);

  } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar cliente',
        'error' => $e->getMessage()
      ], JSON_UNESCAPED_UNICODE);
  }
  exit;
}

/* =========================
  ELIMINAR CLIENTE (DELETE)
========================= */
if ($method === 'DELETE' && $action === 'eliminar') {

  $id = $_GET['id'] ?? null;

  if (!$id) {
      echo json_encode([
        'success' => false,
        'message' => 'ID no proporcionado'
      ]);
      exit;
  }

  try {
      $stmt = $conexion->prepare("DELETE FROM $nombre_tabla WHERE id = :id");
      $stmt->execute([':id' => $id]);

      echo json_encode([
        'success' => true,
        'message' => 'Cliente eliminado correctamente'
      ], JSON_UNESCAPED_UNICODE);

  } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Error al eliminar cliente',
        'error' => $e->getMessage()
      ], JSON_UNESCAPED_UNICODE);
  }
  exit;
}

/* =========================
  RUTA NO VÁLIDA
========================= */
echo json_encode([
   'success' => false,
   'message' => 'Acción no válida'
]);