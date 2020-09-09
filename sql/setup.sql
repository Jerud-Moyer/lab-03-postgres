DROP TABLE IF EXISTS motorcycles;
DROP TABLE IF EXISTS skeletons;

CREATE TABLE motorcycles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    size INT CHECK (size > 0)
);

CREATE TABLE skeletons (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    limbs INT CHECK (limbs > 0)
);