CREATE TABLE recipe_collections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    collected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes1(id)
);
