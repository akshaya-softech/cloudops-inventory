-- CloudOps Inventory Platform - Database Schema
-- Tracks cloud resources like VMs, databases, storage, etc.

-- Create cloud resources inventory table
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100),
    sku VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create audit log table (for operational dashboard)
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system metrics table (for self-aware dashboard)
CREATE TABLE IF NOT EXISTS system_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value VARCHAR(255) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample cloud resources inventory data
INSERT INTO inventory_items (name, description, quantity, price, category, sku) VALUES
-- Virtual Machines (Compute)
('EC2 t3.micro', 'General purpose VM - 2 vCPU, 1GB RAM', 15, 8.50, 'Compute', 'AWS-EC2-T3MICRO'),
('EC2 t3.medium', 'General purpose VM - 2 vCPU, 4GB RAM', 8, 33.41, 'Compute', 'AWS-EC2-T3MED'),
('EC2 m5.large', 'Compute optimized VM - 2 vCPU, 8GB RAM', 5, 70.08, 'Compute', 'AWS-EC2-M5LRG'),
('EC2 r5.large', 'Memory optimized VM - 2 vCPU, 16GB RAM', 3, 91.98, 'Compute', 'AWS-EC2-R5LRG'),

-- Databases
('RDS MySQL db.t3.micro', 'Managed MySQL database - Single AZ', 4, 12.41, 'Database', 'AWS-RDS-MYSQL-MICRO'),
('RDS MySQL db.t3.small', 'Managed MySQL database - Multi-AZ', 2, 48.00, 'Database', 'AWS-RDS-MYSQL-SMALL'),
('RDS PostgreSQL db.t3.medium', 'Managed PostgreSQL - Multi-AZ', 2, 98.50, 'Database', 'AWS-RDS-PG-MED'),
('DynamoDB On-Demand', 'NoSQL serverless database table', 6, 25.00, 'Database', 'AWS-DYNAMO-OD'),

-- Storage
('S3 Standard 100GB', 'Object storage - Standard tier', 20, 2.30, 'Storage', 'AWS-S3-STD-100'),
('S3 Standard 500GB', 'Object storage - Standard tier', 10, 11.50, 'Storage', 'AWS-S3-STD-500'),
('EBS gp3 100GB', 'Block storage - General purpose SSD', 25, 8.00, 'Storage', 'AWS-EBS-GP3-100'),
('EFS Standard 50GB', 'Elastic file system - Standard', 5, 15.00, 'Storage', 'AWS-EFS-STD-50'),

-- Networking
('Application Load Balancer', 'Layer 7 load balancer', 3, 22.27, 'Networking', 'AWS-ALB-STD'),
('NAT Gateway', 'Network address translation', 2, 32.85, 'Networking', 'AWS-NAT-GW'),
('Elastic IP', 'Static public IPv4 address', 8, 3.65, 'Networking', 'AWS-EIP'),
('CloudFront Distribution', 'CDN distribution - 100GB transfer', 4, 8.50, 'Networking', 'AWS-CF-100'),

-- Containers & Serverless
('ECS Fargate Task (0.5 vCPU)', 'Serverless container - Small', 10, 14.26, 'Containers', 'AWS-FARGATE-SM'),
('ECS Fargate Task (1 vCPU)', 'Serverless container - Medium', 6, 28.52, 'Containers', 'AWS-FARGATE-MD'),
('Lambda Function (1M requests)', 'Serverless compute - per million', 12, 0.20, 'Serverless', 'AWS-LAMBDA-1M'),
('ECR Repository', 'Container image registry - 10GB', 5, 1.00, 'Containers', 'AWS-ECR-10'),

-- Security & Monitoring
('AWS WAF WebACL', 'Web application firewall', 2, 5.00, 'Security', 'AWS-WAF-ACL'),
('CloudWatch Dashboard', 'Custom monitoring dashboard', 8, 3.00, 'Monitoring', 'AWS-CW-DASH'),
('CloudWatch Logs 10GB', 'Log storage and analysis', 15, 5.03, 'Monitoring', 'AWS-CW-LOGS-10'),
('AWS Secrets Manager', 'Secret storage per secret/month', 10, 0.40, 'Security', 'AWS-SM-SECRET');

-- Insert initial system metrics
INSERT INTO system_metrics (metric_name, metric_value) VALUES
('deployment_version', 'v1.0.0-local'),
('environment', 'development'),
('database_status', 'connected');