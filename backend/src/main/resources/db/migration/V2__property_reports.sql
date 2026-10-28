CREATE TABLE property_reports (
    id BIGINT NOT NULL AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(80) NOT NULL,
    details VARCHAR(1500),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_reports_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users(id),
    CONSTRAINT chk_report_status CHECK (status IN ('OPEN', 'REVIEWED', 'DISMISSED')),
    INDEX idx_reports_status_created (status, created_at)
);
