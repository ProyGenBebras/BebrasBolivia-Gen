-- Se ejecuta SOLO en la primera inicialización del volumen de Postgres
-- (docker-entrypoint-initdb.d). Crea la BD separada para pruebas de integración,
-- de modo que "migrate reset" de los tests nunca toque la BD de desarrollo.
-- Sin OWNER explícito: la BD queda en manos del rol POSTGRES_USER (el que arranca
-- el contenedor), sea cual sea la credencial configurada. Antes hardcodeaba dev_user,
-- lo que rompía la creación al cambiar de credenciales.
CREATE DATABASE bebras_bolivia_test;
