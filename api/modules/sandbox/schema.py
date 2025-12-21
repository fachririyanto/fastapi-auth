QUERY_CREATE_TABLES = """
    CREATE TABLE IF NOT EXISTS sandbox (
        sandbox_id BIGSERIAL PRIMARY KEY,
        sandbox_name VARCHAR(50) NOT NULL,
        created_by BIGINT NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
"""

QUERY_DROP_TABLES = """
    DROP TABLE IF EXISTS sandbox;
"""

QUERY_INSERT_DATA = """
    INSERT INTO role_capabilities (role_id, capability_id) VALUES
        (1, 'read_sandbox'),
        (1, 'create_sandbox'),
        (1, 'update_sandbox'),
        (1, 'delete_sandbox');
"""
