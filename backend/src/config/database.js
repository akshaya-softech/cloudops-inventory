const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const initializeDatabase = async () => {
    console.log('🔄 Running database migrations...');
    
    const createTables = `
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
        
        CREATE TABLE IF NOT EXISTS audit_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            action VARCHAR(50) NOT NULL,
            table_name VARCHAR(100) NOT NULL,
            record_id INT,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS system_metrics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            metric_name VARCHAR(100) NOT NULL,
            metric_value VARCHAR(255) NOT NULL,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    const statements = createTables.split(';').filter(s => s.trim());
    for (const statement of statements) {
        if (statement.trim()) {
            await pool.query(statement);
        }
    }
    
    // Check if seed data needed
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM inventory_items');
    if (rows[0].count === 0) {
        console.log('📦 Seeding initial data...');
        await pool.query(`
            INSERT INTO inventory_items (name, description, quantity, price, category, sku) VALUES
            ('EC2 t3.micro', 'General purpose VM - 2 vCPU, 1GB RAM', 15, 8.50, 'Compute', 'AWS-EC2-T3MICRO'),
            ('EC2 t3.medium', 'General purpose VM - 2 vCPU, 4GB RAM', 8, 33.41, 'Compute', 'AWS-EC2-T3MED'),
            ('EC2 m5.large', 'Compute optimized VM - 2 vCPU, 8GB RAM', 5, 70.08, 'Compute', 'AWS-EC2-M5LRG'),
            ('RDS MySQL db.t3.micro', 'Managed MySQL database', 4, 12.41, 'Database', 'AWS-RDS-MYSQL-MICRO'),
            ('RDS MySQL db.t3.small', 'Managed MySQL Multi-AZ', 2, 48.00, 'Database', 'AWS-RDS-MYSQL-SMALL'),
            ('DynamoDB On-Demand', 'NoSQL serverless database', 6, 25.00, 'Database', 'AWS-DYNAMO-OD'),
            ('S3 Standard 100GB', 'Object storage', 20, 2.30, 'Storage', 'AWS-S3-STD-100'),
            ('S3 Standard 500GB', 'Object storage', 10, 11.50, 'Storage', 'AWS-S3-STD-500'),
            ('EBS gp3 100GB', 'Block storage SSD', 25, 8.00, 'Storage', 'AWS-EBS-GP3-100'),
            ('Application Load Balancer', 'Layer 7 load balancer', 3, 22.27, 'Networking', 'AWS-ALB-STD'),
            ('NAT Gateway', 'Network address translation', 2, 32.85, 'Networking', 'AWS-NAT-GW'),
            ('CloudFront Distribution', 'CDN distribution', 4, 8.50, 'Networking', 'AWS-CF-100'),
            ('ECS Fargate Task', 'Serverless container', 10, 14.26, 'Containers', 'AWS-FARGATE-SM'),
            ('Lambda Function', 'Serverless compute', 12, 0.20, 'Serverless', 'AWS-LAMBDA-1M'),
            ('ECR Repository', 'Container registry', 5, 1.00, 'Containers', 'AWS-ECR-10'),
            ('AWS WAF WebACL', 'Web application firewall', 2, 5.00, 'Security', 'AWS-WAF-ACL'),
            ('CloudWatch Dashboard', 'Monitoring dashboard', 8, 3.00, 'Monitoring', 'AWS-CW-DASH'),
            ('CloudWatch Logs 10GB', 'Log storage', 15, 5.03, 'Monitoring', 'AWS-CW-LOGS-10'),
            ('AWS Secrets Manager', 'Secret storage', 10, 0.40, 'Security', 'AWS-SM-SECRET')
        `);
    }
    
    console.log('✅ Database ready');
};

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected');
        connection.release();
        await initializeDatabase();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

module.exports = { pool, testConnection };