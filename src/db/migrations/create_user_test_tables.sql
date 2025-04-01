-- Création de la table user_tests
CREATE TABLE IF NOT EXISTS user_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unique_id VARCHAR(36) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    score INT NOT NULL,
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    status ENUM('pending', 'in_progress', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    result_details TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (test_id) REFERENCES code_tests(id),
    CHECK (score >= 0 AND score <= 100)
);

-- Création de la table user_test_results
CREATE TABLE IF NOT EXISTS user_test_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    unique_id VARCHAR(36) NOT NULL UNIQUE,
    user_test_id INT NOT NULL,
    error_type VARCHAR(100) NOT NULL,
    line_number INT NOT NULL,
    suggestion TEXT,
    execution_time INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_test_id) REFERENCES user_tests(id),
    CHECK (line_number > 0),
    CHECK (execution_time >= 0)
); 