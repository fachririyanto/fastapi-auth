QUERY_CREATE_TABLES = """
    CREATE TABLE IF NOT EXISTS users (
        user_id BIGSERIAL PRIMARY KEY,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        full_name VARCHAR(50) NOT NULL,
        role INT NOT NULL,
        metadata JSONB,
        created_by BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP WITH TIME ZONE,
        reset_code VARCHAR(20),
        verify_code VARCHAR(20),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        is_deleted BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS roles (
        role_id SERIAL PRIMARY KEY,
        role_name VARCHAR(30) NOT NULL,
        created_by BIGINT NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS role_capabilities (
        role_id INT NOT NULL,
        capability_id VARCHAR(50) NOT NULL,
        PRIMARY KEY (role_id, capability_id)
    );

    CREATE TABLE IF NOT EXISTS auth_tokens (
        auth_id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        refresh_token TEXT NOT NULL,
        user_agent TEXT,
        ip_address VARCHAR(30),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE
    );
"""

QUERY_DROP_TABLES = """
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS roles;
    DROP TABLE IF EXISTS role_capabilities;
    DROP TABLE IF EXISTS auth_tokens;
"""

QUERY_INSERT_DATA = """
    INSERT INTO roles (role_id, role_name, created_by) VALUES
        (1, 'Super Admin', 1),
        (2, 'Admin', 1),
        (3, 'User', 1);

    INSERT INTO users (email, password, full_name, role, created_by, is_verified, is_active, is_deleted) VALUES
        ('superadmin@example.ai', '$2a$12$y55GE2ovKZn26M//xqujnOhXYxI.gGRIFCAXdivczOMVUr1Oxekhu', 'Super Admin', 1, 1, true, true, false),
        ('admin@example.ai', '$2a$12$Q/Jc/WSP91T1IAJ0yB.Ch.m8kTb8QtsO4Q6UIZ.u9Dm10L.FleTx.', 'Admin', 2, 1, true, true, false),
        ('fachri@example.ai', '$2b$12$laFwlj466Ykfs595nEjCXeKVnPYHemAE3RYoXYgpfjrOPjEUrIv6u', 'Fachri Riyanto', 3, 1, true, true, false);

    INSERT INTO role_capabilities (role_id, capability_id) VALUES
        (1, 'read_role'),
        (1, 'create_role'),
        (1, 'update_role'),
        (1, 'delete_role'),
        (1, 'read_user'),
        (1, 'create_user'),
        (1, 'update_user'),
        (1, 'delete_user');

    INSERT INTO role_capabilities (role_id, capability_id) VALUES
        (2, 'read_user'),
        (2, 'create_user'),
        (2, 'update_user'),
        (2, 'delete_user');

    ALTER SEQUENCE users_user_id_seq RESTART WITH 4;
    ALTER SEQUENCE roles_role_id_seq RESTART WITH 4;
"""
